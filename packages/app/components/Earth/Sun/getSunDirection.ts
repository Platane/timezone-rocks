import * as THREE from "three";

const earthAxisAngle = (23.5 / 180) * Math.PI;

const rotationDuration = 24 * 60 * 60 * 1000 + 4 * 60 * 1000;
const revolutionDuration = 365.256363004 * 24 * 60 * 60 * 1000;

// import { DateTime } from "luxon";
// const decSolstice = DateTime.fromISO("2022-12-21T21:48:10").toMillis();
// const revolutionOffset = -(decSolstice / revolutionDuration) % 1;
const revolutionOffset = 0.02935049978712101;

// empirically
const rotationOffset = 0.845;

const p = new THREE.Object3D();
const o = new THREE.Object3D();

const Y = new THREE.Vector3(0, 1, 0);

p.add(o);
p.quaternion.setFromEuler(new THREE.Euler(0, 0, -earthAxisAngle));

/**
 * get the sun direction from the earth point of view
 */
export const getSunDirection = (t: number, target: THREE.Vector3) => {
  const rev = (t % revolutionDuration) / revolutionDuration + revolutionOffset;

  const rot = (t % rotationDuration) / rotationDuration + rotationOffset;

  const A = 1000;

  p.position.set(
    Math.cos(rev * Math.PI * 2) * A,
    0,
    Math.sin(rev * Math.PI * 2) * A
  );

  o.quaternion.setFromAxisAngle(Y, rot * Math.PI * 2);

  o.updateWorldMatrix(true, false);

  target.set(0, 0, 0);
  o.worldToLocal(target);
  target.normalize();
};
