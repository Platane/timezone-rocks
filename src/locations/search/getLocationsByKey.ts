import { Location } from "../getLocations";

export const getLocationsByKey =
  (locations: Location[]) => (keys: number[]) => {
    const l = keys
      .map((key) => locations.find((l) => l.key === key))
      .filter(Boolean);

    return l as any as Location[];
  };
