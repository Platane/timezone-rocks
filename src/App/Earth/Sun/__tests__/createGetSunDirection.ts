import * as THREE from "three";

export const createGetSunDirection = ([
  // rotationOffset = 0,
  // revolutionOffset = 0,

  rotationAxisPhi,
  rotationAxisTheta,
]: number[]) => {
  const earth = new THREE.Object3D();
  const earthTilted = new THREE.Object3D();
  const sun = new THREE.Object3D();
  const solarSystem = new THREE.Object3D();
  solarSystem.add(sun);
  solarSystem.add(earth);
  earth.add(earthTilted);
  // r.quaternion.setFromEuler(new THREE.Euler(earthAxisAngle, 0, 0));
  // h.quaternion.setFromAxisAngle(y, Math.PI);

  const earthAxisAngle = (23.5 / 180) * Math.PI;
  // const rotationDuration = (23 * 60 * 60 + 56 * 60 + 4) * 1000;
  // const revolutionDuration = 365.256363004 * 24 * 60 * 60 * 1000;

  const rotationAxis = new THREE.Vector3();
  // rotationAxis.applyAxisAngle(new THREE.Vector3(1, 0, 0), earthAxisAngle);
  // rotationAxis.applyAxisAngle(
  //   new THREE.Vector3(0, 1, 0),
  //   rotationAxisPhi * Math.PI * 2
  // );
  // rotationAxis.setFromSphericalCoords(
  //   1,
  //   rotationAxisPhi * Math.PI * 2,
  //   rotationAxisTheta * Math.PI * 2
  // );
  rotationAxis.set(0, 1, 0);
  rotationAxis.applyQuaternion(
    new THREE.Quaternion().setFromEuler(new THREE.Euler(earthAxisAngle, 0, 0))
  );
  rotationAxis.applyQuaternion(
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 5.5, 0))
  );

  const rotationOffset = 0;
  const revolutionOffset = 0;

  const getSunDirection = (timestamp: number, target: THREE.Vector3) => {
    {
      const a = (timestamp / (24 * 60 * 60 * 1000) + 0.56) * Math.PI * 2;

      target.set(Math.sin(a), 0, Math.cos(a));

      // return;
    }

    const rotationDuration = (23 * 60 * 60 + 56 * 60 + 4) * 1000;
    // const rotationDuration = 24 * 60 * 60 * 1000;
    const rotationOffset = -0.2;
    const rotationAngle =
      (timestamp / rotationDuration + rotationOffset) * Math.PI * 2;

    const revolutionDuration = 365.256363004 * 24 * 60 * 60 * 1000;
    const revolutionOffset = -1.34;
    const revolutionAngle =
      (timestamp / revolutionDuration + revolutionOffset) * -Math.PI * 2;

    earth.position.set(Math.cos(revolutionAngle), 0, Math.sin(revolutionAngle));
    earthTilted.quaternion.setFromAxisAngle(rotationAxis, rotationAngle);

    earthTilted.updateWorldMatrix(true, false);

    target.set(0, 0, 0);
    earthTilted.worldToLocal(target);

    // o.updateWorldMatrix(true, true);
    // o.worldToLocal(target);

    // target.set(Math.sin(rotationAngle), 0, Math.cos(rotationAngle));
    // target.set(Math.sin(rotationAngle), 0, Math.cos(rotationAngle));

    // o.updateWorldMatrix(true, true);
    // o.matrixWorld.invert();

    // target.set(0, 0, 1);
    // target.applyAxisAngle(y, (0.5 - h) * 2 * Math.PI);
    // target.applyAxisAngle(x, Math.sin((r - 0.25) * Math.PI * 2) * earthAxisAngle);
  };

  return getSunDirection;
};
