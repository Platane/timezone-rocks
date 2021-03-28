import { getLocations } from "./getLocations";
import { getLocationByTimezoneAndCountryCode as getLocationByTimezoneAndCountryCode_ } from "./search/getLocationByTimezoneAndCountryCode";
import { getLocationsByKey as getLocationsByKey_ } from "./search/getLocationsByKey";
import { createSearch } from "./search/search";

export const getLocationByTimezoneAndCountryCode = async (
  timezone: string,
  countryCode: string
) =>
  getLocationByTimezoneAndCountryCode_(await locationsPromise)(
    timezone,
    countryCode
  );

export const getLocationsByKey = async (keys: string[]) =>
  getLocationsByKey_(await locationsPromise)(keys);

export const getMatchingLocation = async (query: string) =>
  (await searchPromise)(query);

export const preload = async () => {
  start();

  await searchPromise;
};

let start: () => void;

const startPromise = new Promise<void>((r) => {
  start = r;
});

const locationsPromise = startPromise.then(getLocations);

const searchPromise = locationsPromise.then(createSearch);
