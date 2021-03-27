import { createSelector } from "reselect";
import type { UseStore } from "zustand";
import type { Api, State } from "./store";
import { getLocationByTimezone, getLocationsByKey } from "../../locations";
import { split } from "../../utils";
import { getClientTimezone } from "../../intl-utils";

export const init = async (store: UseStore<State & Api>) => {
  store.subscribe((hash) => {
    window.location.hash = hash;
  }, selectHash);

  const keys = split(window.location.hash.slice(1), 3);
  const locations = await getLocationsByKey(keys);

  if (locations.length === 0)
    locations.push(await getLocationByTimezone(getClientTimezone()!));

  store.getState().initLocations(locations);
};

const selectHash = createSelector(
  (s: State) => s.locations,
  (locations) => locations.map((c) => c.key).join("")
);