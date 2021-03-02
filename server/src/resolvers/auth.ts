import { IResolvers } from "apollo-server-express";
import crypto from "crypto";
import { Response, Request } from "express";

import {
  Viewer,
  SignInArgs,
  Database,
  User,
  ConnectStripeArgs
} from "../utils/types";
import { GoogleOAuth } from "../utils/GoogleOAuth";
import { authorize } from "../utils/authorize";
import { Stripe } from "../utils/Stripe";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "production"
};

const autologinWithCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined> => {
  const user = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnOriginal: false }
  );

  let viewer = user.value;
  if (!viewer) {
    res.clearCookie("viewer", cookieOptions);
  }

  return viewer;
};

const loginByGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | undefined> => {
  const { user } = await GoogleOAuth.signIn(code);

  if (!user) {
    throw new Error("Google sign in error");
  }

  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  const userName = userNamesList ? userNamesList[0].displayName : undefined;
  const userId =
    userNamesList &&
    userNamesList[0].metadata &&
    userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google sign in error");
  }

  const update = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        email: userEmail,
        token
      }
    },
    { returnOriginal: false }
  );

  let viewer = update.value;
  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      email: userEmail,
      income: 0,
      reservations: [],
      cities: []
    });

    viewer = insertResult.ops[0];
  }

  res.cookie("viewer", userId, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });

  return viewer;
};

export const resolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return GoogleOAuth.authUrl;
      } catch (error) {
        throw new Error("Failed to query Google Auth");
      }
    }
  },
  Mutation: {
    signIn: async (
      root: undefined,
      { input }: SignInArgs,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");

        const viewer = code
          ? await loginByGoogle(code, token, db, res)
          : await autologinWithCookie(token, db, req, res);

        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: viewer._id,
          email: viewer.email,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true
        };
      } catch (error) {
        throw new Error("Failed to sign in");
      }
    },
    signOut: (root: undefined, args: {}, { res }: { res: Response }) => {
      try {
        res.clearCookie("viewer", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error("Error during sign out");
      }
    },
    connectStripe: async (
      parent: undefined,
      { input }: ConnectStripeArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        const { code } = input;

        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("User cannot be found");
        }

        const wallet = await Stripe.connect(code);
        if (!wallet) {
          throw new Error("Stripe error");
        }

        const updatedRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: wallet.stripe_user_id } },
          { returnOriginal: false }
        );

        if (!updatedRes.value) {
          throw new Error("Cannot update user");
        }

        viewer = updatedRes.value;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true
        };
      } catch (error) {
        throw new Error("Failed to connect with Stripe");
      }
    },
    disconnectStripe: async (
      parent: undefined,
      args: {},
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("Cannot find viewer");
        }

        const updatedRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: undefined } },
          { returnOriginal: false }
        );
        if (!updatedRes.value) {
          throw new Error("Cannot update user");
        }

        viewer = updatedRes.value;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true
        };
      } catch (error) {
        throw new Error("Failed to disconnect with Stripe");
      }
    }
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viever: Viewer): boolean | undefined => {
      return viever.walletId ? true : undefined;
    }
  }
};
