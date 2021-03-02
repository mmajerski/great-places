import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";

import {
  City,
  Database,
  CityArgs,
  User,
  CityReservationsArgs,
  CityReservationsData,
  CitiesArgs,
  CitiesData,
  CitiesFilters,
  CitiesQuery,
  CreateCityArgs,
  CreateCityInput
} from "../utils/types";
import { authorize } from "../utils/authorize";
import { GoogleGeociding } from "../utils/GoogleGeocoding";
import { Cloudinary } from "../utils/Cloudinary";

const verifyCreateCityInput = ({
  name,
  description,
  price
}: CreateCityInput) => {
  if (name.length > 100) {
    throw new Error("City name must be less than 100 characters");
  }

  if (description.length > 5000) {
    throw new Error("City description must be less than 5000 characters");
  }

  if (price <= 0) {
    throw new Error("Price must be greater than 0");
  }
};

export const resolvers: IResolvers = {
  Query: {
    city: async (
      parent: undefined,
      { id }: CityArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<City> => {
      try {
        const city = await db.cities.findOne({ _id: new ObjectId(id) });
        if (!city) {
          throw new Error("City cannot be found");
        }

        const viewer = await authorize(db, req);
        if (viewer && viewer._id === city.owner) {
          city.authorized = true;
        }

        return city;
      } catch (error) {
        throw new Error(`Failed to query city: ${error}`);
      }
    },
    cities: async (
      parent: undefined,
      { location, filter, limit, skip }: CitiesArgs,
      { db }: { db: Database }
    ): Promise<CitiesData> => {
      try {
        const query: CitiesQuery = {};

        const data: CitiesData = {
          total: 0,
          result: []
        };

        if (location) {
          const { country, city } = await GoogleGeociding.geocode(location);

          if (city) {
            query.name = city;
          }

          if (country) {
            query.country = country;
          } else {
            throw new Error("Country not found");
          }
        }

        let cursor = await db.cities.find(query);

        if (filter && filter === CitiesFilters.PRICE_HIGH_TO_LOW) {
          cursor = cursor.sort({ price: -1 });
        }

        if (filter && filter === CitiesFilters.PRICE_LOW_TO_HIGH) {
          cursor = cursor.sort({ price: 1 });
        }

        cursor.skip(skip > 0 ? (skip - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query cities: ${error}`);
      }
    }
  },
  Mutation: {
    createCity: async (
      parent: undefined,
      { input }: CreateCityArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<City> => {
      verifyCreateCityInput(input);

      let viewer = await authorize(db, req);
      if (!viewer) {
        throw new Error("Viewer cannot be found");
      }

      const { country, city } = await GoogleGeociding.geocode(input.address);
      if (!country || !city) {
        throw new Error("Invalid address");
      }

      const imageUrl = await Cloudinary.upload(input.image);

      const insertResult = await db.cities.insertOne({
        _id: new ObjectId(),
        ...input,
        image: imageUrl,
        reservations: [],
        reservationsIndex: {},
        country,
        owner: viewer._id,
        rating: Math.floor(Math.random() * 5)
      });

      const insertedCity: City = insertResult.ops[0];

      await db.users.updateOne(
        {
          _id: viewer._id
        },
        { $push: { cities: insertedCity._id } }
      );

      return insertedCity;
    }
  },
  City: {
    id: (city: City): string => {
      return city._id.toString();
    },
    owner: async (
      city: City,
      args: {},
      { db }: { db: Database }
    ): Promise<User> => {
      const owner = await db.users.findOne({ _id: city.owner });
      if (!owner) {
        throw new Error("Owner cannot be found");
      }
      return owner;
    },
    reservationsIndex: (city: City): string => {
      return JSON.stringify(city.reservationsIndex);
    },
    reservations: async (
      city: City,
      { limit, skip }: CityReservationsArgs,
      { db }: { db: Database }
    ): Promise<CityReservationsData | null> => {
      try {
        if (!city.authorized) {
          return null;
        }

        const data: CityReservationsData = {
          total: 0,
          result: []
        };

        let cursor = await db.reservations.find({
          _id: { $in: city.reservations }
        });

        cursor = cursor.skip(skip > 0 ? (skip - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query city reservations: ${error}`);
      }
    }
  }
};
