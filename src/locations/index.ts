import { createRemote } from "../worker/utils";
export type { Location } from "./getLocations";
import * as api from "./api";

type Api = typeof api;

// @ts-ignore
import Worker from "worker-loader!./worker.ts";

const worker = new Worker();

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
