/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCityInput } from "./../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateCity
// ====================================================

export interface CreateCity_createCity {
  __typename: "City";
  id: string;
}

export interface CreateCity {
  createCity: CreateCity_createCity;
}

export interface CreateCityVariables {
  input: CreateCityInput;
}
