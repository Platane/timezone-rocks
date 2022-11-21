import { pruneUndefined } from "../../utils-array";
import type { ILocation } from "../fetch/parseLocations";

export const getLocationsByKey = (locations: ILocation[]) => (keys: string[]) =>
  pruneUndefined(keys.map((key) => locations.find((l) => l.key === key)));
