import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput) {
    signIn(input: $input) {
      id
      email
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut {
      id
      email
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;

export const CONNECT_STRIPE = gql`
  mutation ConnectStripe($input: ConnectStripeInput!) {
    connectStripe(input: $input) {
      hasWallet
    }
  }
`;

export const DISCONNECT_STRIPE = gql`
  mutation DisconnectStripe {
    disconnectStripe {
      hasWallet
    }
  }
`;

export const CREATE_CITY = gql`
  mutation CreateCity($input: CreateCityInput!) {
    createCity(input: $input) {
      id
    }
  }
`;

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
    }
  }
`;
