import { Request } from "express";
import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";

import {
  City,
  Database,
  Reservation,
  CreateReservationArgs
} from "../utils/types";
import { authorize } from "../utils/authorize";
import { Stripe } from "../utils/Stripe";

export const resolvers: IResolvers = {
  Mutation: {
    createReservation: async (
      parent: undefined,
      { input }: CreateReservationArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Reservation> => {
      try {
        const { id, source, start, end } = input;

        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("Could not find viewer");
        }

        const city = await db.cities.findOne({
          _id: new ObjectId(id)
        });
        if (!city) {
          throw new Error("Could not find city");
        }

        if (city.owner === viewer._id) {
          throw new Error("User cannot make reservation on its own city");
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        if (endDate < startDate) {
          throw new Error("End date is before start date");
        }

        // const cityIndex = resolveCitiesIndex(city.ci);
        const totalPrice =
          (city.price * (endDate.getTime() - startDate.getTime())) / 86400000 +
          1;

        const owner = await db.users.findOne({
          _id: city.owner
        });
        if (!owner || !owner.walletId) {
          throw new Error(
            "Owner does not exist or has not connected with Stripe"
          );
        }

        await Stripe.charge(totalPrice, source, owner.walletId);

        const insertRes = await db.reservations.insertOne({
          _id: new ObjectId(),
          city: city._id,
          reservedBy: viewer._id,
          start,
          end
        });

        const insertedReservation: Reservation = insertRes.ops[0];

        await db.users.updateOne(
          {
            _id: owner._id
          },
          { $inc: { income: totalPrice } }
        );

        await db.users.updateOne(
          {
            _id: viewer._id
          },
          { $push: { reservations: insertedReservation._id } }
        );

        await db.cities.updateOne(
          {
            _id: city._id
          },
          {
            $push: { reservations: insertedReservation._id }
          }
        );

        return insertedReservation;
      } catch (error) {
        throw new Error(`Failed to create reservation ${error}`);
      }
    }
  },
  Reservation: {
    id: (reservation: Reservation): string => {
      return reservation._id.toString();
    },
    city: (
      reservation: Reservation,
      args: {},
      { db }: { db: Database }
    ): Promise<City | null> => {
      return db.cities.findOne({ _id: reservation.city });
    },
    reservedBy: (
      reservation: Reservation,
      args: {},
      { db }: { db: Database }
    ) => {
      return db.users.findOne({ _id: reservation.reservedBy });
    }
  }
};
