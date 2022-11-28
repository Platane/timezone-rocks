import locationListPath from "../assets/locations.csv";
import { generateUniqueKey } from "./generateUniqueKey";
import { parseLocations } from "./parseLocations";

export const listVersion = locationListPath.slice(-7, -4);

export const getLocations = () =>
  fetch(locationListPath)
    .then((res) => res.text())
    .then((t) => generateUniqueKey(parseLocations(t)));
