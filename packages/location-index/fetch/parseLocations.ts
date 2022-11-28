export const parseLocations = (csv: string) =>
  csv
    .trim()
    .split("\n")
    .map((s, i) => {
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
