import { createSelector } from "reselect";
import type { UseStore } from "zustand";
import type { Api, State } from "./store";
import {
  getLocationByTimezoneAndCountryCode,
  getLocationsByKey,
} from "../../locations";
import {
  getClientLocaleCountryCode,
  getClientTimezone,
} from "../../intl-utils";
import { pack, unpack } from "./pack";

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
  locations: { key: number }[];
}) => {
  let s = pack(locations.map(({ key }) => key));

  if (Number.isFinite(t))
    s += "-" + new Date(t!).toISOString().slice(0, 16) + "z";

  return s;
};

const parse = (hash: string) => {
  const [lkeys, ...lt] = hash.replace(/^#/, "").split("-");

  const keys = unpack(lkeys);

  try {
    const t = new Date(lt.join("-")).getTime();
    if (Number.isFinite(t)) return { keys, t };
  } catch (err) {}

  return { keys };
};
