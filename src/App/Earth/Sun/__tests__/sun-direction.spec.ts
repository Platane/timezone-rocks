import * as fs from "fs";
import * as path from "path";
import { DateTime } from "luxon";
import { parseLocations } from "../../../../locations/getLocations";
import { setLatLng } from "../../Locations/utils";
import * as THREE from "three";
import { getSunDirection } from "../utils";
import { stringify } from "../../../store/stringify-utils";
import { getSunRiseTime } from "./sun-rise";

const locationListPath = path.join(
  __dirname,
  "../../../../assets/locations.csv"
);

jest.setTimeout(60 * 1000);

it("locations.csv should exists", () => {
  expect(fs.existsSync(locationListPath)).toBeTruthy();
});

it("should position the sun light", async () => {
  const locations = parseLocations(
    fs.readFileSync(locationListPath).toString()
  );

  const locationNames = [
    // cities on equator
    "Quito",
    "Libreville",
    "Mogadishu",
    "Pontianak",

    // other cities
    // "Stockholm",
    // "San Francisco",
  ];

  await Promise.all(
    locationNames.map(async (locationName) => {
      // find location data
      const location = locations.find((l) => l.name === locationName)!;

      // position on the unit sphere
      const spherical = new THREE.Spherical(1);
      setLatLng(spherical, location);
      const p = new THREE.Vector3().setFromSpherical(spherical);
      const n = p;

      const { timezone, points } = await getSunRiseTime(location);

      for (const [date, { sunRise, sunSet }] of points as any) {
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

        return;

        const sunDirection = new THREE.Vector3();

        // at sun rise sun direction should be orthogonal to the normal (n) of the sphere on the position (p)
        getSunDirection(tSunRise, sunDirection);
        expect(sunDirection.dot(n)).toBeCloseTo(0, 2);

        // an hour after sun rise, the sun direction should be facing the normal
        getSunDirection(tSunRise + 1000 * 60 * 60, sunDirection);
        expect(sunDirection.dot(n)).toBeGreaterThan(0);

        // an hour before sun rise, the sun direction should be facing the normal opposite
        getSunDirection(tSunRise - 1000 * 60 * 60, sunDirection);
        expect(sunDirection.dot(n)).toBeGreaterThan(0);
      }
    })
  );
});
