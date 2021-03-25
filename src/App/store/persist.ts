import { createSelector } from "reselect";
import type { UseStore } from "zustand";
import type { Api, State } from "./store";
import { getLocationsByKey } from "../../locations";
import { split } from "../../utils";

export const init = (store: UseStore<State & Api>) => {
  store.subscribe((hash) => {
    window.location.hash = hash;
  }, selectHash);

  const keys = split(window.location.hash.slice(1), 3);
  getLocationsByKey(keys).then(store.getState().initLocations);
};

const selectHash = createSelector(
  (s: State) => s.locations,
  (locations) => locations.map((c) => c.key).join("")
);
