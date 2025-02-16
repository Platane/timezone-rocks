import { createSelector } from "reselect";
import type { Store } from "./store";
import { selectLocations, selectT } from "./selector";
import { parse, stringify } from "./utils-stringify";
import {
  getLocationByTimezoneAndCountryCode,
  getLocationsByKey,
  listVersion,
} from "@tzr/location-index";
import {
  getClientLocaleCountryCode,
  getClientTimezone,
} from "../intl/getClientTimezone";

export const init = async (store: Store) => {
  {
    let timeout: number | Timer | undefined;
    store.subscribe(selectHashPrimitive, ({ locations, t }) => {
      clearTimeout(timeout);

      if (
        initialParsedHash &&
        initialParsedHash.keys.length === locations.length &&
        initialParsedHash.keys.every((key, i) => key === locations[i].key) &&
        t === initialParsedHash.t
      )
        return;

      timeout = setTimeout(() => {
        window.location.hash = stringify({ locations });
      }, 100);
    });
  }

  let initialParsedHash: ReturnType<typeof parse> | undefined;
  try {
    initialParsedHash = parse(window.location.hash);
  } catch (error) {}

  const locations = initialParsedHash
    ? await getLocationsByKey(initialParsedHash.keys)
    : [];

  if (locations.length === 0) {
    const clientLocation = await getLocationByTimezoneAndCountryCode(
      getClientTimezone(),
      getClientLocaleCountryCode()
    );

    if (clientLocation) locations.push(clientLocation);
  }

  store.getState().initLocations(locations, initialParsedHash?.t);
};

const selectHashPrimitive = createSelector(
  selectLocations,
  selectT,
  (locations, t) => ({ locations, listVersion, t })
);
