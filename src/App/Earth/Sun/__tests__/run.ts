import * as path from "path";
import * as fs from "fs";
import { DateTime } from "luxon";
import * as THREE from "three";
import { parseLocations } from "../../../../locations/parseLocations";
import { getSunRiseTime } from "./sun-rise-cached";
import { setLatLng } from "../../Locations/utils";
import { createGetSunDirection } from "./createGetSunDirection";
import asciichart from "asciichart";
import { solve } from "./gradient-descent";
import { stringify } from "../../../store/stringify-utils";

const locations = parseLocations(
  fs
    .readFileSync(path.join(__dirname, "../../../../assets/locations.csv"))
    .toString()
);
const getLocationByName = (name: string) =>
  locations.find((x) => x.name === name);

const locationNames = [
  // cities on equator
  "Quito",
  "Libreville",
  "Mogadishu",
  "Pontianak",

  // // other cities
  // "Stockholm",
  // "San Francisco",
  // "Antananarivo",
  // "Osaka",
  // "Madrid",
  // ...locations.map((l) => l.name).slice(0, 30),
];

const getFitness = async () => {
  const years = [2022];
  const n_locations = 1;
  const n_points = 4;

  const samples = await Promise.all(
    locationNames
      .map(getLocationByName)
      // locations
      .slice(0, n_locations)
      .map((l) =>
        Promise.all(
          years.map(async (year) => {
            const { timezone, points } = await getSunRiseTime(l!, year);

            return pickN(points, n_points, -10)
              .map(({ date, sunRise, sunSet }) =>
                [sunRise, sunSet].map((hour) =>
                  DateTime.fromISO(date + "T" + hour, {
                    zone: timezone,
                  }).toMillis()
                )
              )
              .flat();
          })
        ).then((ts) => ({ ...l, ts: ts.flat() }))
      )
  );

  const spherical = new THREE.Spherical(1);
  const n = new THREE.Vector3();
  const sunDirection = new THREE.Vector3();

  return (
    getSunDirection: (timestamp: number, target: THREE.Vector3) => void
  ) => {
    let errorSquareSum = 0;

    for (let is = samples.length; is--; ) {
      const s = samples[is];

      setLatLng(spherical, s);
      n.setFromSpherical(spherical);

      for (let it = s.ts.length; it--; ) {
        const t = s.ts[it];
        getSunDirection(t, sunDirection);
        errorSquareSum += sunDirection.dot(n) ** 2;
      }
    }

    return Math.sqrt(errorSquareSum / (samples.length * samples[0].ts.length));
  };
};

const spherical = new THREE.Spherical(1);
const n = new THREE.Vector3();
const sunDirection = new THREE.Vector3();
const getError = (
  getSunDirection: (timestamp: number, target: THREE.Vector3) => void,
  zone: string,
  latLng: Parameters<typeof setLatLng>[1],
  point: {
    date: string;
    sunRise: string;
    sunSet: string;
  }
) => {
  //
  // hypothesis
  //   at sun rise, the sun rays should be orthogonal to the normal of the point on the globe

  // position in the model world
  setLatLng(spherical, latLng);

  // n is the normal ( which is = to the position on the unit sphere )
  n.setFromSpherical(spherical);

  // parse date

  return [point.sunRise, point.sunSet].reduce((sum, hour) => {
    // get the timestamp for the date / hour
    const t = DateTime.fromISO(point.date + "T" + hour, { zone }).toMillis();

    // get the sun direction at the time
    getSunDirection(t, sunDirection);

    const error = sunDirection.dot(n);

    return sum + error ** 2;
  });
};

const pickN = <T>(arr: T[], n: number, offset: number = 0) => {
  return Array.from(
    { length: n },
    (_, i) => arr[mod(Math.floor((i / n) * arr.length) + offset, arr.length)]
  );
};

const mod = (x: number, n: number) => ((x % n) + n) % n;

(async () => {
  const { timezone, points } = await getSunRiseTime(
    getLocationByName("Quito")!,
    2022
  );

  const getSunDirection = createGetSunDirection([]);
})();
