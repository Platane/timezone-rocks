import type { API } from "./worker";
import { createRpcClient } from "./rpc";
export type { ILocation } from "./fetch/parseLocations";

import locationsUri from "./assets/locations.csv";

export const createLocationSearcher = () => {
  const worker = new Worker(
    //
    new URL("./worker.ts", import.meta.url),
    { type: "module" }
  );
  const api = createRpcClient<API>(worker);

  api.init(locationsUri);
  return api as Omit<typeof api, "init">;
};

export type LocationSearcher = ReturnType<typeof createLocationSearcher>;
