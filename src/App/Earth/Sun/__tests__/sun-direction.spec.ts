import * as path from "path";
import * as fs from "fs";
import { DateTime } from "luxon";
import { parseLocations } from "../../../../locations/parseLocations";
import { setLatLng } from "../../Locations/utils";
import * as THREE from "three";
import { getSunDirection } from "../utils";
import { stringify } from "../../../store/stringify-utils";
import { getSunRiseTime } from "./sun-rise-cached";

const locations = parseLocations(
  fs
    .readFileSync(path.join(__dirname, "../../../../assets/locations.csv"))
    .toString()
);

const locationNames = [
  // cities on equator
  "Quito",
  "Libreville",
  "Mogadishu",
  "Pontianak",

  // // other cities
  "Stockholm",
  // "San Francisco",
  // "Antananarivo",
  // "Osaka",
  // "Madrid",
  // ...locations.map((l) => l.name).slice(0, 30),
];

locationNames.forEach((locationName) =>
  test.concurrent(
    `should position the sun reflecting sun set/rise at ${locationName}`,
    async () => {
      // find location data
      const location = locations.find((l) => l.name === locationName)!;

      // position on the unit sphere
      const spherical = new THREE.Spherical(1);
      setLatLng(spherical, location);
      const p = new THREE.Vector3().setFromSpherical(spherical);
      const n = p;

      const { timezone, points } = await getSunRiseTime(location);

      const interestingPoints = pickN(points, 4, -10);

      for (const { date, sunRise, sunSet } of interestingPoints) {
        const tSunRise = DateTime.fromISO(date + "T" + sunRise, {
          zone: timezone,
        }).toMillis();
        const tSunSet = DateTime.fromISO(date + "T" + sunSet, {
          zone: timezone,
        }).toMillis();

        console.log(
          locationName,
          "\n",
          date,
          "\n",
          timezone,
          sunRise,
          sunSet,
          "\n",

          tSunSet - tSunRise,
          24 * 60 * 60 * 1000 - (tSunSet - tSunRise),
          ((tSunSet - tSunRise) / (12 * 60 * 60 * 1000)).toFixed(3),

          "\n",
          "https://localhost:8080/#" +
            stringify({
              listVersion: "Bkb",
              locations: [location],
              t: tSunRise,
            }),
          "\n",
          "https://localhost:8080/#" +
            stringify({ listVersion: "Bkb", locations: [location], t: tSunSet })
        );

        continue;

        const sunDirection = new THREE.Vector3();

        // at sun rise sun direction should be orthogonal to the normal (n) of the sphere on the position (p)
        getSunDirection(tSunRise, sunDirection);
        expect(sunDirection.dot(n)).toBeCloseTo(0, 0.5);

        // an hour after sun rise, the sun direction should be facing the normal
        getSunDirection(tSunRise + 1000 * 60 * 60, sunDirection);
        expect(sunDirection.dot(n)).toBeGreaterThan(0);

        // an hour before sun rise, the sun direction should be facing the normal opposite
        getSunDirection(tSunRise - 1000 * 60 * 60, sunDirection);
        expect(sunDirection.dot(n)).toBeGreaterThan(0);
      }
    }
  )
);

const pickN = <T>(arr: T[], n: number, offset: number = 0) => {
  return Array.from(
    { length: n },
    (_, i) => arr[mod(Math.floor((i / n) * arr.length) + offset, arr.length)]
  );
};

const mod = (x: number, n: number) => ((x % n) + n) % n;
