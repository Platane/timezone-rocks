import { getLocations } from "./fetch/getLocations";
import { getLocationByTimezoneAndCountryCode as getLocationByTimezoneAndCountryCode_ } from "./search/getLocationByTimezoneAndCountryCode";
import { getLocationsByKey as getLocationsByKey_ } from "./search/getLocationsByKey";
import { createSearch } from "./search/search";
import { createRpcServer } from "./rpc";
import { ILocation } from "./fetch/parseLocations";

const getLocationByTimezoneAndCountryCode = async (
  timezone: string,
  countryCode: string
) =>
  getLocationByTimezoneAndCountryCode_(await locationsPromise)(
    timezone,
    countryCode
  );

const getLocationsByKey = async (keys: string[]) =>
  getLocationsByKey_(await locationsPromise)(keys);

const getMatchingLocation = async (query: string) =>
  (await searchPromise)(query);

let locationsPromise: Promise<ILocation[]>;
let searchPromise: Promise<ReturnType<typeof createSearch>>;

const api = {
  init: async (locationUri: string) => {
    locationsPromise = getLocations(locationUri);
    searchPromise = locationsPromise.then(createSearch);
    await locationsPromise;
  },
  getLocationsByKey,
  getLocationByTimezoneAndCountryCode,
  getMatchingLocation,
};
export type API = typeof api;

createRpcServer(api);
