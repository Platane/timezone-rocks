import { createRpcServer } from "./worker-utils";
import init, { Searcher } from "./pkg/search_location";
import { ILocation } from "./getLocations";

// @ts-ignore
import locationListPath from "../assets/locations.csv";

const promise = init().then(() => Searcher.create(locationListPath));
// const promise = init().then(() => Searcher.create_test());

const api = {
  getMatchingLocation: async (pattern: string, limit: number) => {
    const searcher = await promise;
    const results = searcher.search(pattern, limit) as ILocation[];
    return results;
  },
};
export type API = typeof api;

createRpcServer(api);
