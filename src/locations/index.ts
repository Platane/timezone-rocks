import { createRemote } from "../worker/utils";
import type { Location } from "./getLocations";
export type { Location } from "./getLocations";

// @ts-ignore
import Worker from "worker-loader!./worker.ts";

const worker = new Worker();

export const getLocationsByKey: (
  keys: string[]
) => Promise<Location[]> = createRemote(worker, "getLocationsByKey");

export const getMatchingLocation: (
  query: string
) => Promise<Location[]> = createRemote(worker, "getMatchingLocation");

export const getLocationByTimezoneAndCountryCode: (
  timezone: string,
  countryCode: string
) => Promise<Location> = createRemote(
  worker,
  "getLocationByTimezoneAndCountryCode"
);
