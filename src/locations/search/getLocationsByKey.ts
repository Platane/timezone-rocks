import type { ILocation } from "../";

export const getLocationsByKey =
  (locations: ILocation[]) => (keys: number[]) => {
    const l = keys
      .map((key) => locations.find((l) => l.key === key))
      .filter(Boolean);

    return l as any as ILocation[];
  };
