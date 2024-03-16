import { getLocations } from "./fetch/getLocations";
import { getLocationByTimezoneAndCountryCode as getLocationByTimezoneAndCountryCode_ } from "./search/getLocationByTimezoneAndCountryCode";
import { getLocationsByKey as getLocationsByKey_ } from "./search/getLocationsByKey";
import { createSearch } from "./search/search";
import { createRpcServer } from "./rpc";

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

const locationsPromise = getLocations();

const searchPromise = locationsPromise.then(createSearch);

const api = {
  getLocationsByKey,
  getLocationByTimezoneAndCountryCode,
  getMatchingLocation,
};
export type API = typeof api;

createRpcServer(api);
