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
  // "San Francisco",
  // "Antananarivo",
  // "Osaka",
  // "Madrid",
  // ...locations.map((l) => l.name).slice(0, 30),
];

const getFitness = async () => {
  const samples = (
    await Promise.all(
      [2002, 2020, 2024]
        .map((year) =>
          locations.slice(0, 25).map(async (l) => {
            const { timezone, points } = await getSunRiseTime(l, year);

            return pickN(points, 10).map(({ date, sunRise, sunSet }) => {
              const tSunRise = DateTime.fromISO(date + "T" + sunRise, {
                zone: timezone,
              }).toMillis();
              const tSunSet = DateTime.fromISO(date + "T" + sunSet, {
                zone: timezone,
              }).toMillis();

              return {
                tSunRise,
                tSunSet,
                latitude: l.latitude,
                longitude: l.longitude,
                name: l.name,
                timezone,
              };
            });
          })
        )
        .flat()
    )
  ).flat();

  const spherical = new THREE.Spherical(1);
  const n = new THREE.Vector3();
  const sunDirection = new THREE.Vector3();

  return (
    getSunDirection: (timestamp: number, target: THREE.Vector3) => void
  ) =>
    samples.reduce((errorSquareSum, { tSunRise, tSunSet, ...latLng }) => {
      setLatLng(spherical, latLng);
      n.setFromSpherical(spherical);

      getSunDirection(tSunRise, sunDirection);
      const errorSunRise = Math.abs(sunDirection.dot(n));

      getSunDirection(tSunSet, sunDirection);
      const errorSunSet = Math.abs(sunDirection.dot(n));

      return errorSquareSum + errorSunRise + errorSunSet;
    }, 0) /
    (samples.length * 2);
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

const addScaledVector = (target: number[], v: number[], l: number) =>
  v.forEach((_, i) => (target[i] = target[i] + v[i] * l));

(async () => {
  // to minimize
  const fitness = await getFitness();

  console.log("ready");

  const r = Array.from({ length: 4 }, Math.random);
  const r_ = r.slice();
  const v = r.slice();

  copy(
    r,
    [
      13.876508774979458, 7.046753690658465, 7.441087446601254,
      -5.26835680561445,
    ]
  );

  let f = fitness(createGetSunDirection(r));

  {
    const a = performance.now();
    const n = 10;
    for (let k = n; k--; ) fitness(createGetSunDirection(r));
    console.log((performance.now() - a) / n, "ms");
  }

  let step = 1;

  const n = 15000;
  for (let k = n; k--; ) {
    //
    makeRandomUnitVector(v);

    const dt = 0.0001;

    copy(r_, r);
    addScaledVector(r_, v, dt);

    const f_ = fitness(createGetSunDirection(r_));

    let a = (f - f_) / dt;
    if (a < 0) continue;

    step = (k / n) * 10;

    copy(r_, r);
    addScaledVector(r_, v, step * a);

    const f2 = fitness(createGetSunDirection(r_));

    if (f2 < f) {
      f = f2;
      copy(r, r_);
      console.log(f, step, JSON.stringify(r));
    } else {
    }
  }

  console.log(step);
})();
