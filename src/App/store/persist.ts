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
import { selectLocations, selectT } from "./selector";
import { parse, stringify } from "./stringify-utils";
import { location0 } from "../SolarSystem/location0";

export const init = async (store: UseStore<State & Api>) => {
  {
    let timeout: NodeJS.Timeout;
    store.subscribe(({ locations, t }) => {
      clearTimeout(timeout);

      if (
        initialParsedHash &&
        initialParsedHash.listVersion === listVersion &&
        initialParsedHash.keys.length === locations.length &&
        initialParsedHash.keys.every((key, i) => key === locations[i].key) &&
        t === initialParsedHash.t
      )
        return;

      timeout = setTimeout(() => {
        window.location.hash = stringify({ locations, listVersion });
      }, 100);
    }, selectHashPrimitive);
  }

  let initialParsedHash: ReturnType<typeof parse> | undefined;
  try {
    initialParsedHash = parse(window.location.hash);
  } catch (error) {}

  const locations =
    listVersion === initialParsedHash?.listVersion
      ? await getLocationsByKey(initialParsedHash.keys)
      : [];

  if (locations.length === 0) {
    const clientLocation = await getLocationByTimezoneAndCountryCode(
      getClientTimezone(),
      getClientLocaleCountryCode()
    );

    if (clientLocation) locations.push(clientLocation);
  }

  locations.length = 0;
  locations.push(location0);

  store.getState().initLocations(locations, initialParsedHash?.t);
};

const selectHashPrimitive = createSelector(
  selectLocations,
  selectT,
  (locations, t) => ({ locations, listVersion, t })
);
