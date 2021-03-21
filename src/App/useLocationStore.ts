import { useEffect, useState } from "react";

// @ts-ignore
import locationListPath from "../assets/locations.csv";

const parseLocations = (csv: string) =>
  csv.split("\n").map((s, i) => {
    const [type, name, countryCode, lo, la, timezone] = s.split(",");
    return {
      key: i.toString(36).padStart(3, "0"),
      type: type as "city" | "admin" | "country",
      name,
      countryCode,
      longitude: +lo,
      latitude: +la,
      timezone: timezone,
    };
  });

export type Location = ReturnType<typeof parseLocations>[number];

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>();

  useEffect(() => {
    fetch(locationListPath)
      .then((res) => res.text())
      .then(parseLocations)
      .then(setLocations);
  }, []);

  return locations;
};
