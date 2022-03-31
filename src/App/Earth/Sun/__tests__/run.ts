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
  "Stockholm",
  "San Francisco",
  "Antananarivo",
  "Osaka",
  "Madrid",
  // ...locations.map((l) => l.name).slice(0, 30),
];

const getFitness = async () => {
  const years = [2020, 2022, 2024];
  const n_locations = 1;
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

const makeRandomUnitVector = (v: number[]) => {
  v.forEach((_, i) => (v[i] = Math.random() - 0.5));
  const l = Math.hypot(...v);
  v.forEach((_, i) => (v[i] = v[i] / l));
};

const copy = (target: number[], v: number[]) => {
  for (let i = target.length; i--; ) target[i] = v[i];
};

const copyAndAddScaledVector = (
  target: number[],
  origin: number[],
  v: number[],
  l: number
) => {
  for (let i = target.length; i--; ) target[i] = origin[i] + v[i] * l;
};

const solve = <V extends number[]>(
  getError: (s: V) => number,
  solution0: V
): V => {
  const solution = solution0;
  const solution2 = solution.slice() as V;
  const partialDerivative = solution.slice();

  let e = getError(solution);

  const n = 2000;
  const dt = 0.001;

  const h = [];

  for (let k = n; k--; ) {
    // compute partial derivative
    {
      for (let i = solution.length; i--; ) {
        for (let j = solution.length; j--; )
          solution2[j] = solution[j] + (i === j ? dt : 0);
        const ePlus = getError(solution2);

        for (let j = solution.length; j--; )
          solution2[j] = solution[j] - (i === j ? dt : 0);
        const eMinus = getError(solution2);

        partialDerivative[i] = (ePlus - eMinus) / (2 * dt);
      }
    }

    // move r along the vector
    {
      const step0 = 1;
      let step = step0;

      let hc = 0;

      while (step > Number.EPSILON) {
        copyAndAddScaledVector(solution2, solution, partialDerivative, -step);
        const e2 = getError(solution2);

        if (e2 < e) {
          copy(solution, solution2);
          e = e2;
          hc++;
        } else {
          step = step / 2;
        }
      }

      h.push(hc);

      if (hc === 0) break;
    }
  }

  const a = new Map();
  h.sort().forEach((x) => a.set(x, a.get(x) + 1 || 1));
  console.log(
    Array.from(a.entries())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")
  );

  return solution;
};

(async () => {
  // to minimize
  const fitness = await getFitness();

  console.log("ready");

  const getError = (s: number[]) => fitness(createGetSunDirection(s));

  const solution0 = Array.from({ length: 4 }, Math.random);
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

  const solution = solve(getError, Array.from({ length: 4 }, Math.random));

  console.log(
    getError(solution),
    JSON.stringify(solution.map((x) => mod(x, 1)))
  );
})();
