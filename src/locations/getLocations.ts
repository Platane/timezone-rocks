import { parseLocations } from "./parseLocations";

// @ts-ignore
import locationListPath from "../assets/locations.csv";

export const getLocations = () =>
  fetch(locationListPath)
    .then((res) => res.text())
    .then(parseLocations);
