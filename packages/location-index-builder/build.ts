import { isNonNull } from "@tzr/utils/utils-array";
import { load as CheerioLoad } from "cheerio";
import * as unzipper from "unzipper";
import { limit } from "./options";

export const getTimezoneAbbreviations = async () => {
  const text = await fetch(
    "https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations"
  ).then((res) => res.text());

  const $ = CheerioLoad(text);

  return $(".wikitable.sortable tr")
    .toArray()
    .map((row) => {
      const [abbreviation, name, offsetLiteral] = $(row)
        .find("td")
        .toArray()
        .map((el) =>
          $(el)
            .text()
            .replace(/\[.+\]/g, "")
            .trim()
        );

      if (!name) return undefined;

      const [h, m] = offsetLiteral
        .replace("UTC", "")
        .replace("±", "+")
        .replace("−", "-")
        .split(":");
      const offset = Number.parseInt(h) + Number.parseInt(m ?? "0") / 60;

      return { abbreviation, name, offset };
    })
    .filter(isNonNull);
};

export const getCountries = async () => {
  const text = await fetch(
    "http://download.geonames.org/export/dump/countryInfo.txt"
  ).then((res) => res.text());

  return text
    .split("\n")
    .filter((x) => x[0] !== "#" && x)
    .map((s) => {
      const [countryCode, , , , name, capitalName, , population] =
        s.split("\t");
      return { countryCode, name, capitalName, population: +population };
    })
    .filter(
      (country) =>
        Number.isFinite(country.population) &&
        // those two are included in the list, but no longer exist
        country.name !== "Serbia and Montenegro" &&
        country.name !== "Netherlands Antilles"
    )
    .sort((a, b) => b.population - a.population);
};

export const getAdmins = async () => {
  const text = await fetch(
    "http://download.geonames.org/export/dump/admin1CodesASCII.txt"
  ).then((res) => res.text());

  return text
    .split("\n")
    .filter((x) => x[0] !== "#" && x)
    .map((s) => {
      const [code, name] = s.split("\t");
      const [countryCode, adminCode] = code.split(".");
      return { name, countryCode, adminCode };
    });
};

export const getCities = async () => {
  const arraybuffer = await fetch(
    "http://download.geonames.org/export/dump/cities500.zip"
  ).then((res) => res.arrayBuffer());

  const directory = await unzipper.Open.buffer(Buffer.from(arraybuffer));

  const buffer = await directory.files[0].buffer();

  return buffer
    .toString()
    .split("\n")
    .filter((x) => x[0] !== "#" && x)
    .map((s) => {
      const [
        ,
        name,
        ,
        ,
        latitude,
        longitude,
        ,
        ,
        countryCode,
        ,
        adminCode,
        ,
        ,
        ,
        population,
        ,
        ,
        timezone,
      ] = s.split("\t");

      return {
        name,
        adminCode,
        latitude: +latitude,
        longitude: +longitude,
        countryCode,
        population: +population,
        timezone,
      };
    })
    .filter((city) => Number.isFinite(city.population) && city.population > 0)
    .sort((a, b) => b.population - a.population);
};

export const getTimeZones = async () => {
  const text = await fetch(
    "http://download.geonames.org/export/dump/timeZones.txt"
  ).then((res) => res.text());

  return text
    .split("\n")
    .slice(1)
    .map((s) => {
      const [, timezone, offset, offsetDST] = s.split("\t");
      if (!timezone) return undefined;
      return { timezone, offset: +offset, offsetDST: +offsetDST };
    })
    .filter(isNonNull);
};

export const getLocations = async (limit: number = Infinity) => {
  const [cities, admins, countries, timezoneAbbreviations, timezones] =
    await Promise.all([
      getCities(),
      getAdmins(),
      getCountries(),
      getTimezoneAbbreviations(),
      getTimeZones(),
    ]);

  const locationCountry = countries
    .sort((a, b) => b.population - a.population)
    .map((country) => {
      const mainCity =
        cities.find((c) => c.name === country.capitalName) ||
        cities.find((c) => c.countryCode === country.countryCode)!;

      if (!mainCity) return undefined;

      return {
        type: "country" as const,
        name: country.name,
        countryCode: country.countryCode,
        longitude: mainCity.longitude,
        latitude: mainCity.latitude,
        timezone: mainCity.timezone,
      };
    })
    .filter(isNonNull);

  const locationCity = cities
    .sort((a, b) => b.population - a.population)
    .slice(0, limit)
    .map((c) => ({
      type: "city" as const,
      name: c.name,
      countryCode: c.countryCode,
      longitude: c.longitude,
      latitude: c.latitude,
      timezone: c.timezone,
    }));

  const locationAdmin = locationCountry
    .flatMap((country) => {
      // list the cities in the country
      const countryCities = cities.filter(
        (c) => c.countryCode === country.countryCode
      );

      // list the admin zone in the country
      // ignore the one that don't have a known city
      const countryAdmins = admins
        .filter((a) => a.countryCode === country.countryCode)
        .map((admin) => {
          const mainCity = countryCities.find(
            (city) => city.adminCode === admin.adminCode
          );

          if (mainCity) return { ...mainCity, ...admin };
        })
        .filter(isNonNull);

      // if the country don't span over multiple timezone, don't include the admin level
      if (!countryAdmins.some((a) => a.timezone !== countryAdmins[0].timezone))
        return [];

      // compute the population from the cities population
      return countryAdmins.map((a) => {
        const population = countryCities.reduce(
          (sum, city) =>
            city.adminCode === a.adminCode ? sum : sum + city.population,
          0
        );

        return { ...a, population };
      });
    })
    .flat()
    .sort((a, b) => b.population - a.population)
    .map((admin) => ({
      type: "admin" as const,
      name: admin.name,
      countryCode: admin.countryCode,
      longitude: admin.longitude,
      latitude: admin.latitude,
      timezone: admin.timezone,
    }));

  const getFixedTimezone = (offset: number) =>
    `UTC${offset < 0 ? "-" : "+"}${Math.abs(offset)}`;

  const getFixedTimezonePosition = (offset: number) => ({
    latitude: 0,
    longitude: (offset / 12) * 180,
  });

  const locationTimezoneAbbreviations = timezoneAbbreviations.map((ab) => {
    // find known timezones that matches the offset
    const ts = timezones
      .filter((t) => t.offset === ab.offset || t.offsetDST === ab.offset)
      .map((t) => t.timezone);

    // find a country that match the abbreviation name somehow
    const l = locationCountry.find(
      (l) => ab.name.includes(l.name) && ts.includes(l.timezone)
    ) ??
      locationAdmin.find(
        (l) => ab.name.includes(l.name) && ts.includes(l.timezone)
      ) ??
      locationCity.find(
        (l) => ab.name.includes(l.name) && ts.includes(l.timezone)
      ) ?? {
        countryCode: null,
        timezone: getFixedTimezone(ab.offset),
        ...getFixedTimezonePosition(ab.offset),
      };

    return {
      ...l,
      type: "timezone" as const,
      name: ab.abbreviation + " - " + ab.name,
    };
  });

  const locationTimezoneNumeral = Array.from({ length: 24 }, (_, i) => {
    const offset = i < 12 ? i + 1 : -(i - 12 + 1);

    const l = {
      type: "timezone" as const,
      countryCode: null,
      timezone: getFixedTimezone(offset),
      ...getFixedTimezonePosition(offset),
    };

    return [
      { name: `GMT${offset < 0 ? "-" : "+"}${Math.abs(offset)}`, ...l },
      { name: `UTC${offset < 0 ? "-" : "+"}${Math.abs(offset)}`, ...l },
    ];
  }).flat();

  const locations = [
    ...locationCountry,

    ...locationCity.slice(
      0,
      Math.max(
        0,
        limit -
          locationAdmin.length -
          locationCountry.length -
          locationTimezoneAbbreviations.length
      )
    ),

    ...locationTimezoneAbbreviations,

    ...locationTimezoneNumeral,

    ...locationAdmin,
  ].slice(0, limit);

  return locations;
};

export const build = async () => {
  const content = (await getLocations(limit))
    .map((l) =>
      [
        l.type,
        l.name.replace(/\s*\,\s*/g, " "),
        l.countryCode ?? "",
        Math.round(l.longitude * 100),
        Math.round(l.latitude * 100),
        l.timezone,
      ].join(",")
    )
    .join("\n");

  return content;
};
