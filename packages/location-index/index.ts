import type { API as WorkerAPI } from "./worker";
import { createRpcClient } from "./rpc";
export { listVersion } from "./fetch/getLocations";
export type { ILocation } from "./fetch/parseLocations";

// @ts-ignore
import MyWorker from "./worker?worker";

const api = createRpcClient<WorkerAPI>(new MyWorker());

export const getLocationsByKey = api.getLocationsByKey;
export const getMatchingLocation = api.getMatchingLocation;
export const getLocationByTimezoneAndCountryCode =
  api.getLocationByTimezoneAndCountryCode;
