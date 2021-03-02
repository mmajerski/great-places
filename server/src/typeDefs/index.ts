import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    authUrl: String!
    user(id: ID!): User!
    city(id: ID!): City!
    cities(
      location: String
      filter: CitiesFilter!
      limit: Int!
      skip: Int!
    ): Cities!
  }

  type Mutation {
    signIn(input: SignInInput): Viewer!
    signOut: Viewer!
    connectStripe(input: ConnectStripeInput!): Viewer!
    disconnectStripe: Viewer!
    createCity(input: CreateCityInput!): City!
    createReservation(input: CreateReservationInput!): Reservation!
  }

  input SignInInput {
    code: String!
  }

  input ConnectStripeInput {
    code: String!
  }

  input CreateCityInput {
    name: String!
    description: String!
    image: String!
    address: String!
    price: Int!
    maxVisitors: Int!
  }

  input CreateReservationInput {
    id: ID!
    source: String!
    start: String!
    end: String!
  }

  type Viewer {
    id: ID
    email: String
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  type User {
    id: ID!
    name: String!
    avatar: String!
    email: String!
    hasWallet: Boolean!
    income: Int
    reservations(limit: Int, skip: Int): Reservations
    cities(limit: Int!, skip: Int!): Cities!
  }

  type Reservations {
    total: Int!
    result: [Reservation!]!
  }

  type Reservation {
    id: ID!
    city: City!
    reservedBy: User!
    start: String!
    end: String!
  }

  type Cities {
    total: Int!
    result: [City!]!
  }

  type City {
    id: ID!
    name: String!
    description: String!
    image: String!
    owner: User!
    address: String!
    country: String!
    price: Int!
    maxVisitors: Int!
    rating: Int!
    reservations(limit: Int, skip: Int): Reservations
    reservationsIndex: String
  }

  enum CitiesFilter {
    PRICE_HIGH_TO_LOW
    PRICE_LOW_TO_HIGH
  }
`;
