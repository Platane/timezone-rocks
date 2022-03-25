import { API as WorkerAPI } from "./worker";
import { createRpcClient } from "./worker-utils";

import init, { greet, init_locations } from "../../crates/search-location/pkg";

init().then(() => {
  greet("WebAssembly");
  init_locations(locationListPath);
});

export type { ILocation } from "./getLocations";

// @ts-ignore
import locationListPath from "../assets/locations.csv";
export const listVersion = (locationListPath as string).slice(-7, -4);

const worker = new Worker(
  new URL(
    "./worker.ts",
    // @ts-ignore
    import.meta.url
  )
);

const api = createRpcClient<WorkerAPI>(worker);

export const getLocationsByKey = api.getLocationsByKey;
export const getMatchingLocation = api.getMatchingLocation;
export const getLocationByTimezoneAndCountryCode =
  api.getLocationByTimezoneAndCountryCode;
