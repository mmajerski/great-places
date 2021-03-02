/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: City
// ====================================================

export interface City_city_owner {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  hasWallet: boolean;
}

export interface City_city_reservations_result_reservedBy {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
}

export interface City_city_reservations_result {
  __typename: "Reservation";
  id: string;
  reservedBy: City_city_reservations_result_reservedBy;
  start: string;
  end: string;
}

export interface City_city_reservations {
  __typename: "Reservations";
  total: number;
  result: City_city_reservations_result[];
}

export interface City_city {
  __typename: "City";
  id: string;
  name: string;
  description: string;
  image: string;
  owner: City_city_owner;
  address: string;
  country: string;
  reservations: City_city_reservations | null;
  reservationsIndex: string | null;
  price: number;
  maxVisitors: number;
}

export interface City {
  city: City_city;
}

export interface CityVariables {
  id: string;
  reservationsSkip: number;
  limit: number;
}
