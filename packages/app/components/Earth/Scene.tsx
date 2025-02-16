import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sun } from "./Sun/Sun";
import { Locations } from "./Locations/Locations";
import { useStore } from "../../store/store";
import { Controls } from "./Controls/Controls";
import { AppearScaleNode } from "./AppearScaleNode";
import { EarthGlobe } from "../../../earth-globe";

export const Scene = () => {
  const ready = useStore((s) => s.earthReady);

  return (
    <Canvas
      camera={{ near: 0.1, far: 20, position: [0, 0, 1.95] }}
      dpr={[1, 2]}
    >
      <Controls />

      <ambientLight intensity={0.3} />

      <AppearScaleNode scaleTarget={ready ? 1 : 0.001}>
        <Suspense fallback={null}>
          <EarthGlobe />
          <Locations />
          <Sun />
          <ReadySpy />
        </Suspense>
      </AppearScaleNode>
    </Canvas>
  );
};

/**
 * set the ready flag when the suspense is resolved, and the component mounted
 */
const ReadySpy = () => {
  React.useEffect(() => useStore.getState().onEarthReady(), []);
  return null;
};

export default Scene;
