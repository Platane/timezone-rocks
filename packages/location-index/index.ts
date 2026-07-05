import type { API } from "./worker";
import { createRpcClient } from "./rpc";
export type { ILocation } from "./fetch/parseLocations";

import locationsUri from "./assets/locations.csv";

// @ts-ignore
import MyWorker from "./worker?worker";

export const createLocationSearcher = () => {
  const worker = new MyWorker();
  const api = createRpcClient<API>(worker);

  api.init(locationsUri);
  return api as Omit<typeof api, "init">;
};

export type LocationSearcher = ReturnType<typeof createLocationSearcher>;
