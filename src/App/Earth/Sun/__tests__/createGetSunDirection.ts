import * as THREE from "three";

export const createGetSunDirection = ([
  rotationOffset,
  revolutionOffset,

  rotationAxisPhi,
  rotationAxisTheta,
]: number[]) => {
  const r = new THREE.Object3D();
  const o = new THREE.Object3D();
  r.add(o);
  // r.quaternion.setFromEuler(new THREE.Euler(earthAxisAngle, 0, 0));
  // h.quaternion.setFromAxisAngle(y, Math.PI);

  const earthAxisAngle = (23.5 / 180) * Math.PI;
  const rotationDuration = (23 * 60 * 60 + 56 * 60 + 4) * 1000;
  const revolutionDuration = 365.256363004 * 24 * 60 * 60 * 1000;

  const rotationAxis = new THREE.Vector3(0, 1, 0);
  // rotationAxis.applyAxisAngle(new THREE.Vector3(1, 0, 0), earthAxisAngle);
  // rotationAxis.applyAxisAngle(
  //   new THREE.Vector3(0, 1, 0),
  //   rotationAxisPhi * Math.PI * 2
  // );

  const getSunDirection = (timestamp: number, target: THREE.Vector3) => {
    const rotationAngle =
      ((timestamp % rotationDuration) / rotationDuration + rotationOffset) *
      Math.PI *
      2;

    const revolutionAngle =
      ((timestamp % revolutionDuration) / revolutionDuration +
        revolutionOffset) *
      Math.PI *
      2;

    r.position.set(Math.cos(revolutionAngle), 0, Math.sin(revolutionAngle));
    o.quaternion.setFromAxisAngle(rotationAxis, rotationAngle);

    target.set(0, 0, 0);

    o.updateWorldMatrix(true, true);
    o.worldToLocal(target);

    // o.updateWorldMatrix(true, true);
    // o.matrixWorld.invert();

    // target.set(0, 0, 1);
    // target.applyAxisAngle(y, (0.5 - h) * 2 * Math.PI);
    // target.applyAxisAngle(x, Math.sin((r - 0.25) * Math.PI * 2) * earthAxisAngle);
  };

  return getSunDirection;
};
