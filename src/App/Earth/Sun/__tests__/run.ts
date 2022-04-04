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

const locationNames = [
  // cities on equator
  "Quito",
  "Libreville",
  "Mogadishu",
  "Pontianak",

  // // other cities
  "Stockholm",
  "San Francisco",
  "Antananarivo",
  "Osaka",
  "Madrid",
  // ...locations.map((l) => l.name).slice(0, 30),
];

const getFitness = async () => {
  const years = [2022];
  const n_locations = 1;
  const n_points = 4;

  const samples = await Promise.all(
    locationNames
      .map((name) => locations.find((x) => x.name === name)!)
      // locations
      .slice(0, n_locations)
      .map((l) =>
        Promise.all(
          years.map(async (year) => {
            const { timezone, points } = await getSunRiseTime(l, year);

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

  {
    const [{ ts, ...l }] = samples;

    ts.slice(0, 10).forEach((t) =>
      console.log(
        "https://localhost:8080/#" +
          stringify({ listVersion: "Bkb", locations: [l], t })
      )
    );
  }

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

const pickN = <T>(arr: T[], n: number, offset: number = 0) => {
  return Array.from(
    { length: n },
    (_, i) => arr[mod(Math.floor((i / n) * arr.length) + offset, arr.length)]
  );
};

const mod = (x: number, n: number) => ((x % n) + n) % n;

(async () => {
  // to minimize
  const fitness = await getFitness();

  console.log("ready");

  const getError = (s: number[]) => fitness(createGetSunDirection(s));

  const solution0 = Array.from({ length: 2 }, Math.random);
  solution0[1] = 365.256363004 * 24 * 60 * 60 * 1000;
  {
    const a = performance.now();
    let k = 0;
    while (performance.now() - a < 1000)
      for (let u = 50; u--; k++) getError(solution0);
    const d = performance.now() - a;
    console.log(
      `getError runs in ${(d / k).toFixed(2)}ms  (${k} in ${d.toFixed(0)}ms)`
    );
  }

  {
    const s0 = solution0.slice();
    const j = 0;

    console.log(
      asciichart.plot(
        Array.from({ length: 100 }).map((_, i, { length: n }) => {
          const x = i / n;
          s0[j] = x;
          const y = getError(s0);
          return y;
        }),

        { height: 20 }
      ),
      "\n"
    );
  }

  const solution = solve(getError, solution0);

  console.log(
    getError(solution),
    JSON.stringify(solution),
    JSON.stringify(solution.map((x) => mod(x, 1)))
  );
})();
