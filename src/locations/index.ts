import { API as WorkerAPI } from "./worker";
import { createRpcClient } from "../utils-worker";
export { listVersion } from "./fetch/getLocations";
export type { ILocation } from "./fetch/parseLocations";

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
