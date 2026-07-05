import type { ILocation } from "../fetch/parseLocations";

export const getLocationsByKey = (locations: ILocation[]) => (keys: string[]) =>
  keys.map((key) => locations.find((l) => l.key === key));
