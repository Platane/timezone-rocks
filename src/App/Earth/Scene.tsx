import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EarthGlobe } from "./EarthGlobe";
import { Sun } from "./Sun/Sun";
import { Locations } from "./Locations/Locations";
import { useStore } from "../store/store";
import { Controls } from "./Controls/Controls";
import { AppearScaleNode } from "./AppearScaleNode";

export const Scene = () => {
  const ready = useStore((s) => s.earthReady);

  return (
    <Canvas camera={{ near: 0.1, far: 20, position: [0, 0, 1.5] }} dpr={[1, 2]}>
      <Controls />

      <ambientLight intensity={0.1} />

      <AppearScaleNode scaleTarget={ready || true ? 1 : 0.001}>
        <Suspense fallback={null}>
          <EarthGlobe />
          <Locations />
          <Sun />
        </Suspense>
      </AppearScaleNode>
    </Canvas>
  );
};

export default Scene;
