import { generateUniqueKey } from "./generateUniqueKey";
import { parseLocations } from "./parseLocations";

export const getLocations = (uri: string) =>
  fetch(uri)
    .then((res) => res.text())
    .then((t) => generateUniqueKey(parseLocations(t)));
