import { API as WorkerAPI } from "./wasm-worker";
import { createRpcClient } from "./worker-utils";

export type { ILocation } from "./getLocations";

// @ts-ignore
import locationListPath from "../assets/locations.csv";
export const listVersion = (locationListPath as string).slice(-7, -4);

const worker = new Worker(
  new URL(
    "./wasm-worker.ts",
    // @ts-ignore
    import.meta.url
  )
);

const api = createRpcClient<WorkerAPI>(worker);

export const getMatchingLocation = api.getMatchingLocation;
