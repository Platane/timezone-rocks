import * as THREE from "three";

const hour = 1000 * 60 * 60;
const day = hour * 24;
const year = day * 365.25;

/**
 * get the sun direction from the earth point of view
 * @param timestamp unix timestamp (in ms)
 *
 * ⚠ likely not astronomically accurate
 */
export const getSunDirection = (timestamp: number, target: THREE.Vector3) => {
  const rotationDuration = (23 * 60 * 60 + 56 * 60 + 4) * 1000;
  const rotationOffset = 0.98 + 0.25;
  const rotationAngle =
    ((timestamp % rotationDuration) / rotationDuration + rotationOffset) *
    Math.PI *
    2;

  const revolutionDuration = 365.25 * 24 * 60 * 60 * 1000;
  const revolutionOffset = 0;
  const revolutionAngle =
    ((timestamp % revolutionDuration) / revolutionDuration + revolutionOffset) *
    Math.PI *
    2;

  const earthAxisAngle = (23.5 / 180) * Math.PI;

  r.position.set(Math.cos(revolutionAngle), 0, Math.sin(revolutionAngle));
  // r.position.set(0, 0, 1);
  o.quaternion.setFromAxisAngle(y, rotationAngle);

  target.set(0, 0, 0);

  o.updateWorldMatrix(true, true);
  o.worldToLocal(target);

  // o.updateWorldMatrix(true, true);
  // o.matrixWorld.invert();

  // target.set(0, 0, 1);
  // target.applyAxisAngle(y, (0.5 - h) * 2 * Math.PI);
  // target.applyAxisAngle(x, Math.sin((r - 0.25) * Math.PI * 2) * earthAxisAngle);
};

const r = new THREE.Object3D();
const o = new THREE.Object3D();
r.add(o);

const y = new THREE.Vector3(0, 1, 0);
const x = new THREE.Vector3(1, 0, 0);
