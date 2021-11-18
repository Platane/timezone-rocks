import { createSelector } from "reselect";
import type { UseStore } from "zustand";
import type { Api, State } from "./store";
import {
  getLocationByTimezoneAndCountryCode,
  getLocationsByKey,
  listVersion,
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

  let parsedHash;
  try {
    parsedHash = parse(window.location.hash);
  } catch (error) {}

  const locations =
    listVersion === parsedHash?.listVersion
      ? await getLocationsByKey(parsedHash.keys)
      : [];

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
  (locations) => stringify({ locations, listVersion })
);

export const stringify = ({
  t,
  locations,
  listVersion,
}: {
  t?: number;
  locations: { key: number }[];
  listVersion: string;
}) => {
  let s = "";
  if (locations.length)
    s += listVersion + pack(locations.map(({ key }) => key));

  if (Number.isFinite(t))
    s += "-" + new Date(t!).toISOString().slice(0, 16) + "z";

  return s;
};

const parse = (hash: string) => {
  const [lkeys, ...lt] = hash.replace(/^#/, "").split("-");

  const listVersion = lkeys.slice(0, 3);
  const keys = unpack(lkeys.slice(3));

  try {
    const t = new Date(lt.join("-")).getTime();
    if (Number.isFinite(t)) return { keys, listVersion, t };
  } catch (err) {}

  return { keys, listVersion };
};
