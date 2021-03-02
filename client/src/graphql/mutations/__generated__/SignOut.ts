/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignOut
// ====================================================

export interface SignOut_signOut {
  __typename: "Viewer";
  id: string | null;
  email: string | null;
  token: string | null;
  avatar: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}

export interface SignOut {
  signOut: SignOut_signOut;
}
