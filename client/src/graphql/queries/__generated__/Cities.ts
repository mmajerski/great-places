/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CitiesFilter } from "./../../globalTypes";

// ====================================================
// GraphQL query operation: Cities
// ====================================================

export interface Cities_cities_result {
  __typename: "City";
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  maxVisitors: number;
}

export interface Cities_cities {
  __typename: "Cities";
  total: number;
  result: Cities_cities_result[];
}

export interface Cities {
  cities: Cities_cities;
}

export interface CitiesVariables {
  location?: string | null;
  filter: CitiesFilter;
  limit: number;
  skip: number;
}
