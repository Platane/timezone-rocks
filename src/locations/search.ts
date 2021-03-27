import deburr from "lodash.deburr";
import { Location, getLocations } from "./getLocations";

const createSearch = (locations: Location[]) => {
  const normalizedNames = locations.map((l) => normalize(l.name));

  return (query: string) => {
    const res: Location[] = [];

    const q = normalize(query);

    for (let i = 0; i < normalizedNames.length; i++) {
      if (normalizedNames[i].startsWith(q)) {
        res.push(locations[i]);
        if (res.length >= 9) return res;
      }
    }

    return res;
  };
};

const normalize = (s: string) => deburr(s.toLowerCase());

export const getLocationByTimezoneAndCountryCode = async (
  timezone: string,
  countryCode: string
) => {
  const locations = await locationsPromise;

  let bestI = 0;
  let bestN = 0;
  for (let i = 0; i < locations.length; i++) {
    const n =
      +(locations[i].countryCode === countryCode) * 1 +
      +(locations[i].timezone === timezone) * 2;

    if (n > bestN && locations[i].type === "city") {
      bestI = i;
      bestN = n;
      if (n === 3) break;
    }
  }

  return locations[bestI];
};

export const getLocationsByKey = async (keys: string[]) => {
  const locations = await locationsPromise;

  const l = keys
    .map((key) => locations.find((l) => l.key === key))
    .filter(Boolean);

  return (l as any) as Location[];
};

export const getMatchingLocation = async (query: string) =>
  (await searchPromise)(query);

const locationsPromise = getLocations();

const searchPromise = locationsPromise.then(createSearch);
