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

export const init = async (store: UseStore<State & Api>) => {
  store.subscribe((hash) => {
    window.location.hash = hash;
  }, selectHash);

  let parsedHash;
  try {
    parsedHash = parse(window.location.hash);
  } catch (error) {}

  const locations = parsedHash ? await getLocationsByKey(parsedHash.keys) : [];

  if (locations.length === 0) {
    const clientLocation = await getLocationByTimezoneAndCountryCode(
      getClientTimezone(),
      getClientLocaleCountryCode()
    );

    if (clientLocation) locations.push(clientLocation);
  }

  store.getState().initLocations(locations, parsedHash?.t);
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
  let s = "";
  if (locations.length) s += locations.map(({ key }) => key).join("-");

  if (Number.isFinite(t))
    s += "-" + new Date(t!).toISOString().slice(0, 16) + "z";

  return s;
};

const parse = (hash: string) => {
  const [lkeys, ...lt] = hash.replace(/^#/, "").split("--");

  const keys = lkeys.split("-");

  try {
    const t = new Date(lt.join("-")).getTime();
    if (Number.isFinite(t)) return { keys, t };
  } catch (err) {}

  return { keys };
};
