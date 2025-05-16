import deburr from "lodash.deburr";
import { ILocation } from "./parseLocations";

/**
 * generate a unique key for each location
 */
export const generateUniqueKey = (ls: ILocation[]) => {
  const keys = new Set<string>();
  const nextKey = (fullKey: string, n = 3) => {
    while (n <= fullKey.length && keys.has(fullKey.substring(0, n))) n++;
    if (n > fullKey.length) throw new Error("could not generate unique key");
    return fullKey.substring(0, n);
  };
  const normalize = (w: string) =>
    deburr(w)
      .replace(/[^\w\+]+/g, " ")
      .trim()
      .replace(/ /g, "_");

  const timezoneShorts = new Map<string, number>();
  for (const l of ls)
    if (l.type === "timezone") {
      const short = l.name.substring(0, l.name.indexOf(" "));
      timezoneShorts.set(short, (timezoneShorts.get(short) ?? 0) + 1);
    }

  for (const l of ls) {
    switch (l.type) {
      case "country": {
        const fullKey = l.countryCode;
        const key = nextKey(fullKey, fullKey.length);
        keys.add(key);
        l.key = key;
        break;
      }

      case "timezone": {
        const short = l.name.substring(0, l.name.indexOf(" "));

        let key = short;

        if (timezoneShorts.get(key)! > 1 || keys.has(key))
          key = normalize(
            l.name.replace(/ ((Standard|Common) )?Time(\s|$)/, "")
          );

        keys.add(key);
        l.key = key;
        break;
      }

      case "city": {
        const fullKey = normalize(
          l.name + " city" + l.longitude + " " + l.latitude
        );
        const key = nextKey(fullKey, 3);
        keys.add(key);
        l.key = key;
        break;
      }

      case "admin": {
        const fullKey = normalize(
          l.name + " " + l.longitude + " " + l.latitude
        );
        const key = nextKey(fullKey, 3);
        keys.add(key);
        l.key = key;
        break;
      }
    }
  }

  return ls;
};
