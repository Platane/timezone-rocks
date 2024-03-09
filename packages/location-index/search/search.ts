import deburr from "lodash.deburr";
import type { ILocation } from "../fetch/parseLocations";
import { TextFragments, splitFragments } from "./splitFragments";

export const createSearch = (locations: ILocation[]) => {
  const normalizedNames = locations.map((l) => normalize(l.name));

  return (query: string) => {
    const res: (ILocation & {
      fragments: TextFragments;
    })[] = [];

    const q = normalize(query);

    for (let i = 0; i < normalizedNames.length; i++) {
      if (normalizedNames[i].includes(q)) {
        const fragments = splitFragments(
          q,
          normalizedNames[i],
          " " + locations[i].name
        );
        fragments[0].text = fragments[0].text.substring(1);

        res.push({ ...locations[i], fragments });
        if (res.length >= 9) return res;
      }
    }

    return res;
  };
};

const normalize = (s: string) => " " + deburr(s.toLowerCase());
