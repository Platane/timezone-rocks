import * as THREE from "three";

import fragmentShader from "./shader.frag?raw";
import vertexShader from "./shader.vert?raw";

export const createEarthMaterial = () => {
  const mat: THREE.Material = new THREE.ShaderMaterial({
    lights: true,
    fragmentShader,
    vertexShader,

    uniforms: {
      ambientLightColor: { value: null },
      lightProbe: { value: null },
      directionalLights: { value: null },
      directionalLightShadows: { value: null },
      spotLights: { value: null },
      spotLightShadows: { value: null },
      rectAreaLights: { value: null },
      ltc_1: { value: null },
      ltc_2: { value: null },
      pointLights: { value: null },
      pointLightShadows: { value: null },
      hemisphereLights: { value: null },
      directionalShadowMap: { value: null },
      directionalShadowMatrix: { value: null },
      spotShadowMap: { value: null },
      spotLightMatrix: { value: null },
      spotLightMap: { value: null },
      pointShadowMap: { value: null },
      pointShadowMatrix: { value: null },
    },
  });

  (mat as THREE.MeshPhongMaterial).flatShading = true;

  return mat;
};
