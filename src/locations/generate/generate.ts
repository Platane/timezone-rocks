import * as path from "path";
import * as fs from "fs";
import fetch from "node-fetch";
import * as unzipper from "unzipper";

export const getCountries = async () => {
  const text = await fetch(
    `http://download.geonames.org/export/dump/countryInfo.txt`
  ).then((res) => res.text());

  return text
    .split("\n")
    .filter((x) => x[0] !== "#")
    .map((s) => {
      const [countryCode, , , , name, capitalName, , population] = s.split(
        "\t"
      );
      return { countryCode, name, capitalName, population: +population };
    })
    .sort((a, b) => b.population - a.population);
};
export const getAdmins = async () => {
  const text = await fetch(
    `http://download.geonames.org/export/dump/admin1CodesASCII.txt`
  ).then((res) => res.text());

  return text.split("\n").map((s) => {
    const [code, name] = s.split("\t");
    const [countryCode, adminCode] = code.split(".");
    return { name, countryCode, adminCode };
  });
};

export const getCities = async () => {
  const arraybuffer = await fetch(
    `http://download.geonames.org/export/dump/cities1000.zip`
  ).then((res) => res.arrayBuffer());

  const directory = await unzipper.Open.buffer(Buffer.from(arraybuffer));

  const buffer = await directory.files[0].buffer();

  return buffer
    .toString()
    .split("\n")
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
  const [cities, countries, admins] = await Promise.all([
    getCities(),
    getCountries(),
    getAdmins(),
  ]);

  const locations = [
    ...countries
      .sort((a, b) => b.population - a.population)
      .map((cc) => {
        const city =
          cities.find((c) => c.name === cc.capitalName) ||
          cities.find((c) => c.countryCode === cc.countryCode)!;

        if (!city) return null;

        return [
          "country",
          cc.name,
          cc.countryCode,
          city.longitude,
          city.latitude,
          city.timezone,
        ];
      })
      .filter(Boolean),

    ...cities
      .sort((a, b) => b.population - a.population)
      .map((c) => [
        "city",
        c.name,
        c.countryCode,
        c.longitude,
        c.latitude,
        c.timezone,
      ])
      .slice(0, limit),

    ,
    ...countries
      .sort((a, b) => b.population - a.population)
      .map((cc) => {
        const zs = admins.filter((z) => z.countryCode === cc.countryCode);
        const zc = zs.map((z) =>
          cities.find(
            (c) =>
              z.countryCode === c.countryCode && z.adminCode === c.adminCode
          )
        );

        const timezones = new Set<string>();
        zc.forEach((c) => {
          if (c) timezones.add(c.timezone);
        });

        if (timezones.size > 1)
          return zs
            .map((z, i) => {
              const c = zc[i];
              if (!c) return null;
              else
                return [
                  "admin",
                  z.name,
                  z.countryCode,
                  c.longitude,
                  c.latitude,
                  c.timezone,
                ];
            })
            .filter(Boolean);
        else return [];
      })
      .flat(),
  ].filter(Boolean);

  const outFilename = path.join(__dirname, "../../assets/locations.csv");
  fs.writeFileSync(outFilename, locations.map((x) => x!.join(",")).join("\n"));
};

const limit = 6000;

run();
