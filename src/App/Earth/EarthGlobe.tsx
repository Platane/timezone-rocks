import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/store";

import modelPath from "../../assets/earth/scene.glb";
import React from "react";

export const EarthGlobe = (props: any) => {
  const gltf = useGLTF(modelPath);

  const {
    nodes: {
      land: { geometry },
    },
  } = gltf as any;

  const gradientMap = React.useMemo(createGradientMap, []);
  const outlineSphereGeometry = React.useMemo(createOutlineSphereGeometry, []);

  const outLineRef = React.useRef<THREE.Mesh | null>(null);
  const { camera } = useThree();
  useFrame(() => {
    const d = camera.position.length();
    outLineRef.current?.scale.setScalar(1 + d * 0.01);
  });

  React.useEffect(() => useStore.getState().onEarthReady(), []);

  return (
    <group {...props} dispose={null}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshToonMaterial color={"#97ceff"} gradientMap={gradientMap} />
      </mesh>

      <mesh ref={outLineRef} geometry={outlineSphereGeometry}>
        <meshToonMaterial
          color={"#ceff97"}
          gradientMap={gradientMap}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh geometry={geometry}>
        <meshToonMaterial color={"#ceff97"} gradientMap={gradientMap} />
      </mesh>
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
