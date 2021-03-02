import { IResolvers } from "apollo-server-express";
import { Request } from "express";

import {
  UserArgs,
  Database,
  User,
  UserReservationsArgs,
  UserReservationsData,
  UserCitiesArgs,
  UserCitiesData,
  Viewer
} from "../utils/types";
import { authorize } from "../utils/authorize";

export const resolvers: IResolvers = {
  Query: {
    user: async (
      root: undefined,
      { id }: UserArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id });
        if (!user) {
          throw new Error("Could not find user");
        }

        const viewer = await authorize(db, req);
        if (viewer && viewer._id === user._id) {
          user.authorized = true;
        }

        return user;
      } catch (error) {
        throw new Error(`Failed to query user ${error}`);
      }
    }
  },
  User: {
    id: (user: User): string => {
      return user._id;
    },
    hasWallet: (user: User): boolean => {
      return Boolean(user.walletId);
    },
    income: (user: User): number | null => {
      return user.authorized ? user.income : null;
    },
    reservations: async (
      user: User,
      { limit, skip }: UserReservationsArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<UserReservationsData | null> => {
      try {
        const viewer = await authorize(db, req);

        if (!viewer || user._id !== viewer._id) {
          return null;
        }

        const data: UserReservationsData = {
          total: 0,
          result: []
        };

        let cursor = await db.reservations.find({
          _id: { $in: user.reservations }
        });

        cursor.skip(skip > 0 ? (skip - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user reservations: ${error}`);
      }
    },
    cities: async (
      user: User,
      { limit, skip }: UserCitiesArgs,
      { db }: { db: Database }
    ): Promise<UserCitiesData | null> => {
      try {
        const data: UserCitiesData = {
          total: 0,
          result: []
        };

        let cursor = await db.cities.find({
          _id: { $in: user.cities }
        });

        cursor.skip(skip > 0 ? (skip - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user cities: ${error}`);
      }
    }
  }
};
