import * as path from "path";
import * as fs from "fs";
import { DateTime } from "luxon";
import * as THREE from "three";
import { parseLocations } from "../../../../locations/parseLocations";
import { getSunRiseTime } from "./sun-rise-cached";
import { setLatLng } from "../../Locations/utils";
import { createGetSunDirection } from "./createGetSunDirection";

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
  //   "Stockholm",
  // "San Francisco",
  // "Antananarivo",
  // "Osaka",
  // "Madrid",
  // ...locations.map((l) => l.name).slice(0, 30),
];

const getFitness = async () => {
  const years = [2020];
  const n_locations = 3;
  const n_points = 70;

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

    return errorSquareSum / (samples.length * samples[0].ts.length);
  };
};

const pickN = <T>(arr: T[], n: number, offset: number = 0) => {
  return Array.from(
    { length: n },
    (_, i) => arr[mod(Math.floor((i / n) * arr.length) + offset, arr.length)]
  );
};

const mod = (x: number, n: number) => ((x % n) + n) % n;

const makeRandomUnitVector = (v: number[]) => {
  v.forEach((_, i) => (v[i] = Math.random() - 0.5));
  const l = Math.hypot(...v);
  v.forEach((_, i) => (v[i] = v[i] / l));
};

const copy = (target: number[], v: number[]) =>
  v.forEach((_, i) => (target[i] = v[i]));

const copyAndAddScaledVector = (
  target: number[],
  origin: number[],
  v: number[],
  l: number
) => v.forEach((_, i) => (target[i] = origin[i] + v[i] * l));

(async () => {
  // to minimize
  const fitness = await getFitness();

  console.log("ready");

  const r = Array.from({ length: 3 }, Math.random);
  const r_ = r.slice();
  const v = r.slice();

  let f = fitness(createGetSunDirection(r));

  {
    const a = performance.now();
    const n = 200;
    for (let k = n; k--; ) fitness(createGetSunDirection(r));
    console.log((performance.now() - a) / n, "ms");
  }

  let a;
  const dt = 0.00001;

  const n = 300 * 1000;
  for (let k = n; k--; ) {
    // random vector
    makeRandomUnitVector(v);

    // compute a = df/dt along this vector
    {
      copyAndAddScaledVector(r_, r, v, dt);
      const f_ = fitness(createGetSunDirection(r_));
      a = (f - f_) / dt;
    }

    // move r along the vector
    {
      const step0 = (k / n) * a * 0.05;
      let step = step0;

      while (Math.abs(step) > 0.001) {
        copyAndAddScaledVector(r_, r, v, step);
        const f_ = fitness(createGetSunDirection(r_));

        if (f_ < f) {
          copy(r, r_);
          f = f_;
        } else {
          step = step / 2;
        }
      }
    }
  }

  console.log(f, JSON.stringify(r.map((x) => mod(x, 1))));
})();
