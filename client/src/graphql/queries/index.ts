import { gql } from "@apollo/client";

export const AUTH_URL = gql`
  query AuthUrl {
    authUrl
  }
`;

export const USER = gql`
  query User(
    $id: ID!
    $reservationsSkip: Int!
    $citiesSkip: Int!
    $limit: Int!
  ) {
    user(id: $id) {
      id
      name
      avatar
      email
      hasWallet
      income
      reservations(limit: $limit, skip: $reservationsSkip) {
        total
        result {
          id
          city {
            id
            name
            image
            description
            price
            maxVisitors
          }
          start
          end
        }
      }
      cities(limit: $limit, skip: $citiesSkip) {
        total
        result {
          id
          name
          image
          description
          price
          maxVisitors
        }
      }
    }
  }
`;

export const CITY = gql`
  query City($id: ID!, $reservationsSkip: Int!, $limit: Int!) {
    city(id: $id) {
      id
      name
      description
      image
      owner {
        id
        name
        avatar
        hasWallet
      }
      address
      country
      reservations(limit: $limit, skip: $reservationsSkip) {
        total
        result {
          id
          reservedBy {
            id
            name
            avatar
          }
          start
          end
        }
      }
      reservationsIndex
      price
      maxVisitors
    }
  }
`;

export const CITIES = gql`
  query Cities(
    $location: String
    $filter: CitiesFilter!
    $limit: Int!
    $skip: Int!
  ) {
    cities(location: $location, filter: $filter, limit: $limit, skip: $skip) {
      total
      result {
        id
        name
        image
        description
        price
        maxVisitors
      }
    }
  }
`;
