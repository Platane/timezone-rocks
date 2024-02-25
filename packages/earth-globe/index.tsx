import React from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createEarthMaterial } from "./materials/earthMaterial/material";

import modelPath from "./assets/scene.glb";

export const EarthGlobe = (props: React.ComponentProps<"group">) => {
  const gltf = useGLTF(modelPath);

  const {
    nodes: { land },
  } = gltf;
  const { geometry } = land as THREE.Mesh;

  const gradientMap = React.useMemo(createGradientMap, []);
  const outlineSphereGeometry = React.useMemo(createOutlineSphereGeometry, []);

  const outLineRef = React.useRef<THREE.Mesh | null>(null);
  const { camera } = useThree();
  useFrame(() => {
    const d = camera.position.length();
    outLineRef.current?.scale.setScalar(1 + d * 0.01);
  });

  const earthMaterial = React.useMemo(createEarthMaterial, []);

  return (
    <group {...props} dispose={null}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshToonMaterial color={"#97ceff"} gradientMap={gradientMap} />
      </mesh>

      <mesh ref={outLineRef} geometry={outlineSphereGeometry}>
        <meshToonMaterial
          color={"rgb(206, 255, 151)"}
          gradientMap={gradientMap}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={geometry} material={earthMaterial} />
    </group>
  );
};

const createGradientMap = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 18;
  canvas.height = 1;

  const context = canvas.getContext("2d")!;
  context.fillStyle = "#888";
  context.fillRect(0, 0, 100, 1);

  context.fillStyle = "#444";
  context.fillRect(0, 0, 10, 1);

  context.fillStyle = "#000";
  context.fillRect(0, 0, 8, 1);

  const gradientMap = new THREE.Texture(canvas);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.needsUpdate = true;

  return gradientMap;
};

const createOutlineSphereGeometry = () => {
  const geo = new THREE.SphereGeometry(1, 32, 32);
  const normal = geo.getAttribute("normal");
  for (let i = normal.array.length / normal.itemSize; i--; ) {
    normal.setX(i, -normal.getX(i));
    normal.setY(i, -normal.getY(i));
    normal.setZ(i, -normal.getZ(i));
  }
  return geo;
};
