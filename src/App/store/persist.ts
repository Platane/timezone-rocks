import { createSelector } from "reselect";
import type { Store } from "./store";
import {
  getLocationByTimezoneAndCountryCode,
  getLocationsByKey,
  listVersion,
} from "../../locations";
import {
  getClientLocaleCountryCode,
  getClientTimezone,
} from "../../utils-intl";
import { selectLocations, selectT } from "./selector";
import { parse, stringify } from "./utils-stringify";

export const init = async (store: Store) => {
  {
    let timeout: NodeJS.Timeout;
    store.subscribe(selectHashPrimitive, ({ locations, t }) => {
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
    });
  }

  let initialParsedHash: ReturnType<typeof parse> | undefined;
  try {
    initialParsedHash = parse(window.location.hash);
  } catch (error) {}

  const locations =
    initialParsedHash && listVersion === initialParsedHash?.listVersion
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
