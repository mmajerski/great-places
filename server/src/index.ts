import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import path from "path";
import cookiePraser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
// require("dotenv").config();

import { connectMongo } from "./db";

// const corsOptions = { credentials: true, origin: process.env.PUBLIC_URL };
const corsOptions = { credentials: true };

const start = async (app: Application) => {
  const db = await connectMongo();

  app.use(cookiePraser(process.env.COOKIE_SECRET));
  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(compression()); //

  app.use(express.static(`${__dirname}/client`)); //
  app.get("/*", (req, res) => res.sendFile(`${__dirname}/client/index.html`)); //

  const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"));
  const typeDefs = mergeTypeDefs(typesArray);

  const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"));
  const resolvers = mergeResolvers(resolversArray);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      return { db, req, res };
    }
  });

  apolloServer.applyMiddleware({
    app,
    cors: corsOptions
  });

  app.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${
        apolloServer.graphqlPath
      }`
    )
  );
};

start(express());
