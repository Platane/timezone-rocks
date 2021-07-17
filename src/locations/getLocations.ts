// @ts-ignore
import locationListPath from "../assets/locations.csv";

const parseLocations = (csv: string) =>
  csv.split("\n").map((s, i) => {
    const [type, name, countryCode, lo, la, timezone] = s.split(",");
    return {
      key: i,
      type: type as "city" | "admin" | "country",
      name,
      countryCode,
      longitude: +lo / 100,
      latitude: +la / 100,
      timezone: timezone,
    };
  });

export type Location = ReturnType<typeof parseLocations>[number];

export const getLocations = () =>
  fetch(locationListPath)
    .then((res) => res.text())
    .then(parseLocations);
