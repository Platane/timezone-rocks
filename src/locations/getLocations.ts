import deburr from "lodash.deburr";
import { generateUniquePrefixes } from "./prefix.utils";

// @ts-ignore
import locationListPath from "../assets/locations.csv";

const parseLocations = (csv: string) =>
  csv.split("\n").map((s, i) => {
    const [type, name, countryCode, lo, la, timezone] = s.split(",");
    return {
      key: i.toString(),
      type: type as "city" | "admin" | "country" | "timezone",
      name,
      countryCode,
      longitude: +lo / 100,
      latitude: +la / 100,
      timezone: timezone,
    };
  });

export type ILocation = ReturnType<typeof parseLocations>[number];

export const getLocations = () =>
  fetch(locationListPath)
    .then((res) => res.text())
    .then(parseLocations)
    .then(generateUniqueKey);

const pascalCase = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");

export const toUniqueKey = (l: ILocation) =>
  pascalCase(
    deburr(
      l.name +
        l.countryCode +
        (l.type === "city" ? "x" : l.type[0]) +
        l.longitude +
        "" +
        l.latitude
    ).replace(/[^\w\s]/g, "")
  );

const generateUniqueKey = (ls: ILocation[]) => {
  const uniqueKeys = ls.map(toUniqueKey);

  const shortKeys = generateUniquePrefixes(uniqueKeys);

  return ls.map((l, i) => ({ ...l, key: shortKeys[i] }));
};
