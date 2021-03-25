import deburr from "lodash.deburr";
import { Location, getLocations } from "./getLocations";

const generateIndex = (locations: Location[]) =>
  locations.map((value) => ({ value, normalized: normalize(value.name) }));

const normalize = (s: string) => deburr(s.toLowerCase());

export const getLocationsByKey = async (keys: string[]) => {
  const locations = await locationsPromise;

  const l = keys
    .map((key) => locations.find((l) => l.key === key))
    .filter(Boolean);

  return (l as any) as Location[];
};

export const getMatchingLocation = async (query: string) => {
  const index = await indexPromise;

  const q = normalize(query);

  const res: Location[] = [];

  for (const { value, normalized } of index) {
    if (normalized.startsWith(q)) {
      res.push(value);
      if (res.length >= 9) return res;
    }
  }

  return res;
};

const locationsPromise = getLocations();

const indexPromise = locationsPromise.then(generateIndex);
