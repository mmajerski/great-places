interface City {
  id: string;
  name: string;
  image: string;
  address: string;
  price: number;
  visitors: number;
  rating: number;
}

export const cities: City[] = [
  {
    id: "1",
    name: "Athens",
    image:
      "https://i.insider.com/5db1a680045a31351909ea03?width=700&format=jpeg&auto=webp",
    address: "Athens, Greece",
    price: 10000,
    visitors: 2,
    rating: 5
  },
  {
    id: "2",
    name: "Queenstown",
    image:
      "https://i.insider.com/5db1c72f045a3142563a25d3?width=700&format=jpeg&auto=webp",
    address: "Queenstown, New Zealand",
    price: 15000,
    visitors: 3,
    rating: 4
  },
  {
    id: "3",
    name: "New York",
    image:
      "https://i.insider.com/5db21402045a31686863fed5?width=700&format=jpeg&auto=webp",
    address: "New York, NY, USA",
    price: 25000,
    visitors: 4,
    rating: 3
  }
];
