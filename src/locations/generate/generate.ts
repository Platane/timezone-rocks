import * as path from "path";
import * as fs from "fs";
import fetch from "node-fetch";
import * as unzipper from "unzipper";
import { limit } from "./options";

export const getCountries = async () => {
  const text = await fetch(
    `http://download.geonames.org/export/dump/countryInfo.txt`
  ).then((res) => res.text());

  return text
    .split("\n")
    .filter((x) => x[0] !== "#" && x)
    .map((s) => {
      const [countryCode, , , , name, capitalName, , population] =
        s.split("\t");
      return { countryCode, name, capitalName, population: +population };
    })
    .filter((country) => Number.isFinite(country.population))
    .sort((a, b) => b.population - a.population);
};

export const getAdmins = async () => {
  const text = await fetch(
    `http://download.geonames.org/export/dump/admin1CodesASCII.txt`
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
    `http://download.geonames.org/export/dump/cities500.zip`
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
    `http://download.geonames.org/export/dump/timeZones.txt`
  ).then((res) => res.text());

  return text
    .split("\n")
    .slice(1)
    .map((s) => {
      const [, timezone, offset, offsetDST] = s.split("\t");
      return { timezone, offset: +offset, offsetDST: +offsetDST };
    });
};

export const run = async () => {
  const [cities, admins, countries] = await Promise.all([
    getCities(),
    getAdmins(),
    getCountries(),
  ]);

  const locationCountry = pruneNull(
    countries
      .sort((a, b) => b.population - a.population)
      .map((country) => {
        const mainCity =
          cities.find((c) => c.name === country.capitalName) ||
          cities.find((c) => c.countryCode === country.countryCode)!;

        if (!mainCity) return null;

        return {
          type: "country" as const,
          name: country.name,
          countryCode: country.countryCode,
          longitude: mainCity.longitude,
          latitude: mainCity.latitude,
          timezone: mainCity.timezone,
        };
      })
  );

  const locationAdmin = countries
    .sort((a, b) => b.population - a.population)
    .map((country) => {
      const as = pruneNull(
        admins
          .filter((a) => a.countryCode === country.countryCode)
          .map((admin) => {
            const mainCity = cities.find(
              (city) =>
                city.adminCode === admin.adminCode &&
                city.countryCode === admin.countryCode
            );

            if (!mainCity) return null;

            const population = cities.reduce(
              (sum, city) =>
                city.adminCode === admin.adminCode &&
                city.countryCode === admin.countryCode
                  ? sum
                  : sum + city.population,
              0
            );

            return { ...mainCity, ...admin, population };
          })
      );

      const timezones: Record<string, { population: number; nAdmin: number }> =
        {};

      as.forEach(({ timezone, population }) => {
        timezones[timezone] = timezones[timezone] || {
          population: 0,
          nAdmin: 0,
          adminNames: [],
        };

        timezones[timezone].nAdmin += 1;
        timezones[timezone].population += population;
      });

      const tzs = Object.values(timezones);

      if (tzs.length > 1) {
        return as;
      } else return [];
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

  const locationCity = cities
    .sort((a, b) => b.population - a.population)
    .map((c) => ({
      type: "city" as const,
      name: c.name,
      countryCode: c.countryCode,
      longitude: c.longitude,
      latitude: c.latitude,
      timezone: c.timezone,
    }));

  const locations = [
    ...locationCountry,

    ...locationCity.slice(
      0,
      limit - locationAdmin.length - locationCountry.length
    ),

    ...locationAdmin,
  ];

  const content = locations
    .map((l) =>
      [
        l.type,
        l.name.replace(/\s+,\s+/g, " "),
        l.countryCode,
        Math.round(l.longitude * 100),
        Math.round(l.latitude * 100),
        l.timezone,
      ].join(",")
    )
    .join("\n");

  const outFilename = path.join(__dirname, "../../assets/locations.csv");
  fs.writeFileSync(outFilename, content);
};

run();

const pruneNull = <T>(arr: (T | null | undefined)[]) =>
  arr.filter(Boolean) as T[];
