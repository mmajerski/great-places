export interface City {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  maxVisitors: number;
  rating: number;
}

export interface CityData {
  cities: City[];
}

export interface Viewer {
  id: string | null;
  email: string | null;
  token: string | null;
  avatar: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}
