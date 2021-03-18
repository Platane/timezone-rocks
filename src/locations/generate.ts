import * as path from "path";
import * as fs from "fs";
import fetch from "node-fetch";
import * as unzipper from "unzipper";

export const getCities = async () => {
  const arraybuffer = await fetch(
    `http://download.geonames.org/export/dump/cities15000.zip`
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
        ,
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
        latitude: +latitude,
        longitude: +longitude,
        countryCode,
        population: +population,
        timezone,
      };
    })
    .sort((a, b) => b.population - a.population)
    .slice(0, 3000);
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
  const cities = await getCities();
  const content = cities
    .map((c) => {
      return [
        //
        c.name,
        c.countryCode,
        c.longitude,
        c.latitude,
        c.timezone,
      ].join(",");
    })
    .join("\n");

  const outFilename = path.join(__dirname, "../assets/locations.csv");
  fs.writeFileSync(outFilename, content);
};

run();
