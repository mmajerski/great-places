/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateReservationInput } from "./../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateReservation
// ====================================================

export interface CreateReservation_createReservation {
  __typename: "Reservation";
  id: string;
}

export interface CreateReservation {
  createReservation: CreateReservation_createReservation;
}

export interface CreateReservationVariables {
  input: CreateReservationInput;
}
