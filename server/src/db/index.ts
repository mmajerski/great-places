import { MongoClient } from "mongodb";

import { Database, User, City, Reservation } from "../utils/types";

export const connectMongo = async (): Promise<Database> => {
  if (!process.env.MONGO_URI) {
    throw new Error("Could not find connection string");
  }

  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = client.db("tst");

  console.log("Mongo connected");

  return {
    cities: db.collection<City>("cities"),
    users: db.collection<User>("users"),
    reservations: db.collection<Reservation>("reservations")
  };
};
