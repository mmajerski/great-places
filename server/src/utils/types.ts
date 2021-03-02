import { ObjectId, Collection } from "mongodb";

export interface SignInArgs {
  input: { code: string } | null;
}

export interface ConnectStripeArgs {
  input: { code: string };
}

export interface Viewer {
  _id?: string;
  token?: string;
  email?: string;
  avatar?: string;
  walletId?: string;
  didRequest: boolean;
}

export interface ReservationIndexMonth {
  [key: string]: boolean;
}

export interface ReservationsIndexYear {
  [key: string]: ReservationIndexMonth;
}

export interface ReservationIndex {
  [key: string]: ReservationsIndexYear;
}

export interface City {
  _id: ObjectId;
  name: string;
  description: string;
  image: string;
  owner: string;
  address: string;
  country: string;
  price: number;
  maxVisitors: number;
  rating: number;
  reservations: ObjectId[];
  reservationsIndex: ReservationIndex;
  authorized?: boolean;
}

export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  email: string;
  walletId?: string;
  income: number;
  reservations: ObjectId[];
  cities: ObjectId[];
  authorized?: boolean;
}

export interface UserArgs {
  id: string;
}

export interface UserReservationsArgs {
  limit: number;
  skip: number;
}

export interface UserReservationsData {
  total: number;
  result: Reservation[];
}

export interface UserCitiesArgs {
  limit: number;
  skip: number;
}

export interface UserCitiesData {
  total: number;
  result: City[];
}

export interface Reservation {
  _id: ObjectId;
  city: ObjectId;
  reservedBy: string;
  start: string;
  end: string;
}

export interface CityArgs {
  id: string;
}

export interface CityReservationsArgs {
  limit: number;
  skip: number;
}

export interface CityReservationsData {
  total: number;
  result: Reservation[];
}

export interface CitiesArgs {
  location: string | null;
  filter: CitiesFilters;
  limit: number;
  skip: number;
}

export enum CitiesFilters {
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH"
}

export interface CitiesData {
  total: number;
  result: City[];
}

export interface CitiesQuery {
  country?: string;
  name?: string;
}

export interface CreateCityArgs {
  input: CreateCityInput;
}

export interface CreateCityInput {
  name: string;
  description: string;
  image: string;
  address: string;
  price: number;
  maxVisitors: number;
}

export interface CreateReservationArgs {
  input: CreateReservationInput;
}

export interface CreateReservationInput {
  id: string;
  source: string;
  start: string;
  end: string;
}

export interface Database {
  cities: Collection<City>;
  users: Collection<User>;
  reservations: Collection<Reservation>;
}
