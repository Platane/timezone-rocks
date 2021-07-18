import * as THREE from "three";

/**
 * get the earth self axis rotation
 */
const getH = (t: number) => (t % day) / day;

/**
 * get the earth rotation around the sun
 */
const getR = (t: number) => {
  // set to the winter solstice
  d.setTime(t);
  d.setUTCMonth(11);
  d.setUTCDate(21);
  d.setUTCHours(0);
  d.setUTCMinutes(0);
  d.setUTCSeconds(0);

  // distance to the winter solstice
  return mod((t - d.getTime()) / year, 1);
};

const mod = (x: number, n: number) => ((x % n) + n) % n;

const d = new Date();

const hour = 1000 * 60 * 60;
const day = hour * 24;
const year = day * 365.25;

/**
 * get the sun direction from the earth point of view
 * ⚠ likely not astronomically accurate
 */
export const getSunDirection = (t: number, target: THREE.Vector3) => {
  // r=0 at the winter solstice
  const r = getR(t);

  const h = getH(t);

  const earthAxisAngle = (-23.5 / 180) * Math.PI;

  target.set(0, 0, 1);
  target.applyAxisAngle(x, Math.sin((r - 0.25) * Math.PI * 2) * earthAxisAngle);
  target.applyAxisAngle(y, (0.5 + h) * 2 * Math.PI);
};

const y = new THREE.Vector3(0, 1, 0);
const x = new THREE.Vector3(1, 0, 0);
