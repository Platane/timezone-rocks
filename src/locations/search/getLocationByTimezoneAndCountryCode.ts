import type { ILocation } from "../";

export const getLocationByTimezoneAndCountryCode =
  (locations: ILocation[]) => (timezone: string, countryCode: string) => {
    let bestI = 0;
    let bestN = 0;
    for (let i = 0; i < locations.length; i++) {
      const n =
        +(locations[i].countryCode === countryCode) * 1 +
        +(locations[i].timezone === timezone) * 2;

      if (n > bestN && locations[i].type === "city") {
        bestI = i;
        bestN = n;
        if (n === 3) break;
      }
    }

    return locations[bestI];
  };
