import { createRpcServer } from "./worker-utils";
import init, {
  Searcher,
} from "../../crates/search-location/pkg/search_location";
import { ILocation } from "./getLocations";

// @ts-ignore
import locationListPath from "../assets/locations.csv";

const promise = init().then(() => Searcher.create(locationListPath));

const api = {
  getMatchingLocation: async (pattern: string) => {
    const searcher = await promise;
    const results = searcher.search(pattern) as ILocation[];
    return results;
  },
};
export type API = typeof api;

createRpcServer(api);
