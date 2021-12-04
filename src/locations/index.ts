import { createRemote } from "../worker/utils";
export type { Location } from "./getLocations";
import * as api from "./api";

type Api = typeof api;

const worker = new Worker((window as any).__location_worker_url);

export const listVersion = "xxx";
export const getLocationsByKey: Api["getLocationsByKey"] = createRemote(
  worker,
  "getLocationsByKey"
);

export const getMatchingLocation: Api["getMatchingLocation"] = createRemote(
  worker,
  "getMatchingLocation"
);

export const getLocationByTimezoneAndCountryCode: Api["getLocationByTimezoneAndCountryCode"] =
  createRemote(worker, "getLocationByTimezoneAndCountryCode");
