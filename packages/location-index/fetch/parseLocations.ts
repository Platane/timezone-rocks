export const parseLocations = (csv: string) =>
  csv
    .trim()
    .split("\n")
    .map((s, i) => {
      const [type, name, countryCode, lo, la, timezone] = s.split(",");

      const l = {
        key: i.toString(),
        name,
        longitude: +lo / 100,
        latitude: +la / 100,
        timezone: timezone,
      };

      if (type === "timezone") {
        return {
          ...l,
          type: "timezone" as const,
          countryCode: countryCode || null,
        };
      } else {
        return {
          ...l,
          type: type as "city" | "admin" | "country",
          countryCode: countryCode,
        };
      }
    });

export type ILocation = ReturnType<typeof parseLocations>[number];
