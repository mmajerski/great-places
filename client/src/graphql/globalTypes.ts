/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CitiesFilter {
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
}

export interface ConnectStripeInput {
  code: string;
}

export interface CreateCityInput {
  name: string;
  description: string;
  image: string;
  address: string;
  price: number;
  maxVisitors: number;
}

export interface CreateReservationInput {
  id: string;
  source: string;
  start: string;
  end: string;
}

export interface SignInInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
