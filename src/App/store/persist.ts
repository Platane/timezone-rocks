import { createSelector } from "reselect";
import type { UseStore } from "zustand";
import type { Api, State } from "./store";
import {
  getLocationByTimezoneAndCountryCode,
  getLocationsByKey,
} from "../../locations";
import { split } from "../../utils";
import {
  getClientLocaleCountryCode,
  getClientTimezone,
} from "../../intl-utils";

export const init = async (store: UseStore<State & Api>) => {
  store.subscribe((hash) => {
    window.location.hash = hash;
  }, selectHash);

  const { keys, t } = parse(window.location.hash);
  const locations = await getLocationsByKey(keys);

  if (locations.length === 0) {
    const clientLocation = await getLocationByTimezoneAndCountryCode(
      getClientTimezone(),
      getClientLocaleCountryCode()
    );

    if (clientLocation) locations.push(clientLocation);
  }

  store.getState().initLocations(locations, t);
};

const selectHash = createSelector(
  (s: State) => s.locations,
  (locations) => stringify({ locations })
);

export const stringify = ({
  t,
  locations,
}: {
  t?: number;
  locations: { key: string }[];
}) => {
  let s = locations.map((c) => c.key).join("");

  if (Number.isFinite(t))
    s += "-" + new Date(t!).toISOString().slice(0, 16) + "z";

  return s;
};

const parse = (hash: string) => {
  const [lkeys, lt] = hash.replace(/^#/, "").split("-", 2);

  const keys = split(lkeys, 3);

  try {
    const t = new Date(lt).getTime();
    if (Number.isFinite(t)) return { keys, t };
  } catch (err) {}

  return { keys };
};
