import deburr from "lodash.deburr";
import { Location } from "../getLocations";

export const createSearch = (locations: Location[]) => {
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
