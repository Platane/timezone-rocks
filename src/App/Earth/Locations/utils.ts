import * as THREE from "three";

/**
 * convert the ( latitude , longitude ) coord into spherical point
 */
export const setLatLng = (
  spherical: { phi: number; theta: number },
  { longitude, latitude }: { longitude: number; latitude: number }
) => {
  spherical.phi = ((90 - latitude) / 180) * Math.PI;
  spherical.theta = (longitude / 180) * Math.PI;
};

const s = new THREE.Spherical(1.04);
const p = new THREE.Vector3();
export const latLngToWorld = (latlng: {
  longitude: number;
  latitude: number;
}) => {
  setLatLng(s, latlng);
  return p.setFromSpherical(s).toArray();
};
