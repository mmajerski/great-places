/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user_reservations_result_city {
  __typename: "City";
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  maxVisitors: number;
}

export interface User_user_reservations_result {
  __typename: "Reservation";
  id: string;
  city: User_user_reservations_result_city;
  start: string;
  end: string;
}

export interface User_user_reservations {
  __typename: "Reservations";
  total: number;
  result: User_user_reservations_result[];
}

export interface User_user_cities_result {
  __typename: "City";
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  maxVisitors: number;
}

export interface User_user_cities {
  __typename: "Cities";
  total: number;
  result: User_user_cities_result[];
}

export interface User_user {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  email: string;
  hasWallet: boolean;
  income: number | null;
  reservations: User_user_reservations | null;
  cities: User_user_cities;
}

export interface User {
  user: User_user;
}

export interface UserVariables {
  id: string;
  reservationsSkip: number;
  citiesSkip: number;
  limit: number;
}
