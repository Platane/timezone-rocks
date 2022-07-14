import * as THREE from "three";
import { setLatLng } from "../../Locations/utils";

const solsticeIsoDate = "2022-06-21T12:02:30.000+00:00";

const rotationDuration = (23 * 60 * 60 + 56 * 60 + 4) * 1000;
const revolutionDuration = 365.256363004 * 24 * 60 * 60 * 1000;

const tSolstice = new Date(solsticeIsoDate).getTime();

const revolutionOffset = -tSolstice;

const s = new THREE.Spherical();
setLatLng(s, { longitude: 0, latitude: 0 });
const rotationOffset = (s.theta / (Math.PI * 2)) * rotationDuration;

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
  // rotationAxis.applyQuaternion(
  //   new THREE.Quaternion().setFromEuler(new THREE.Euler(earthAxisAngle, 0, 0))
  // );
  // rotationAxis.applyQuaternion(
  //   new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 5.5, 0))
  // );

  const getSunDirection = (timestamp: number, target: THREE.Vector3) => {
    const rotationAngle =
      (((timestamp + rotationOffset) / rotationDuration) * Math.PI * 2) %
      (Math.PI * 2);

    const revolutionAngle =
      ((timestamp + revolutionOffset) / revolutionDuration) * Math.PI * 2;

    earth.position.set(
      Math.cos(revolutionAngle),
      0,
      -Math.sin(revolutionAngle)
    );
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
