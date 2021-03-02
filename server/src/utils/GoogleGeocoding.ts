import { createClient, AddressComponent } from "@google/maps";

const parseAddress = (addressComponents: AddressComponent<any>[]) => {
  let country = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types.includes("country")) {
      country = component.long_name;
    }

    if (component.types.includes("locality")) {
      city = component.long_name;
    }
  }

  return { country, city };
};

const maps = createClient({
  key: `${process.env.GOOGLE_GEOCODE_KEY}`,
  Promise
});

export const GoogleGeociding = {
  geocode: async (address: string) => {
    const res = await maps.geocode({ address }).asPromise();

    if (res.status < 200 || res.status > 299) {
      throw new Error("Failed to geocode address");
    }

    return parseAddress(res.json.results[0].address_components);
  }
};
