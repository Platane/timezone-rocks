import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// @ts-ignore
import modelPath from "../../assets/earth/scene.glb";
import { getSunDirection } from "../utils";

const EarthGlobe = (props: any) => {
  const gltf = useGLTF(modelPath);

  const {
    nodes: {
      land: { geometry },
    },
  } = gltf as any;

  const gradientMap = useMemo(createGradientMap, []);
  const outlineSphereGeometry = useMemo(createOutlineSphereGeometry, []);

  const outLineRef = useRef<THREE.Object3D>();
  const { camera } = useThree();
  useFrame(() => {
    const d = camera.position.length();
    outLineRef.current?.scale.setScalar(1 + d * 0.01);
  });

  return (
    <group {...props} dispose={null}>
      <mesh>
        <sphereBufferGeometry args={[1, 32, 32]} />
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

export const Globe = ({ t, style }: any) => (
  <Canvas
    camera={{ near: 0.1, far: 20, position: [0, 0, 1.95] }}
    dpr={[1, 2]}
    style={style}
  >
    <ambientLight intensity={0.1} />

    <Suspense fallback={null}>
      <EarthGlobe />
    </Suspense>

    <Sun />
  </Canvas>
);

const Sun = ({ t }: any) => {
  const refLight = useRef<THREE.DirectionalLight>();

  useEffect(() => {
    if (refLight.current?.position)
      getSunDirection(t, refLight.current.position);
  }, [t]);

  return <directionalLight intensity={0.2} ref={refLight} />;
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
  const geo = new THREE.SphereBufferGeometry(1, 32, 32);
  const normal = geo.getAttribute("normal");
  for (let i = normal.array.length / normal.itemSize; i--; ) {
    normal.setX(i, -normal.getX(i));
    normal.setY(i, -normal.getY(i));
    normal.setZ(i, -normal.getZ(i));
  }
  return geo;
};
