import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EarthGlobe } from "./EarthGlobe";
import { Sun } from "./Sun/Sun";
import { Locations } from "./Locations/Locations";
import { stepSpring } from "../../spring-utils";
import { useStore } from "../store/store";
import { Controls } from "./Controls/Controls";

export const Earth = () => {
  const ready = useStore((s) => s.earthReady);

  return (
    <Canvas
      camera={{ near: 0.1, far: 20, position: [0, 0, 1.95] }}
      dpr={[1, 2]}
    >
      <Controls />

      {/* <Gizmo /> */}

      <ambientLight intensity={0.1} />

      <AppearScaleNode scale={ready ? 1 : 0.001}>
        <Suspense fallback={null}>
          <EarthGlobe />
          <Locations />
          <Sun />
        </Suspense>
      </AppearScaleNode>
    </Canvas>
  );
};

const Gizmo = () => {
  const [object] = useState(new THREE.AxesHelper(2));

  return <primitive object={object} />;
};

const springConfig = { tension: 80, friction: 12 };
const AppearScaleNode = ({
  children,
  scale,
}: {
  children: any;
  scale: number;
}) => {
  const ref = useRef<THREE.Group>();
  const spring = useRef({ x: 0, target: 0, v: 0 });
  spring.current.target = scale;

  useFrame((_, dt) => {
    stepSpring(spring.current, springConfig, dt);
    ref.current?.scale.setScalar(spring.current.x);
  });

  return <group ref={ref}>{children}</group>;
};

export default Earth;
