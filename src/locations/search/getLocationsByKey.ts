import { pruneUndefined } from "../../utils-array";
import type { ILocation } from "../fetch/parseLocations";

export const getLocationsByKey = (locations: ILocation[]) => (keys: number[]) =>
  pruneUndefined(keys.map((key) => locations.find((l) => l.key === key)));
