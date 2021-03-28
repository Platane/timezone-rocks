import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { OrbitControls } from "drei";
import { EarthGlobe } from "./EarthGlobe";
import { Lights } from "./Lights";
import { Locations } from "./Locations";
import { stepSpring } from "../../spring";
import { useStore } from "../store/store";

export const Earth = () => {
  const ready = useStore((s) => s.earthReady);

  return (
    <Canvas camera={{ near: 0.1, far: 20, position: [0, 0, 1.95] }}>
      <OrbitControls
        minDistance={1.95}
        maxDistance={10}
        enableZoom={false}
        enablePan={false}
      />

      <Suspense fallback={null}>
        <AppearScaleNode scale={ready ? 1 : 0.001}>
          <EarthGlobe />
          <Locations />
          <Lights />
        </AppearScaleNode>
      </Suspense>

      {false && <axesHelper args={[2]} />}
    </Canvas>
  );
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
