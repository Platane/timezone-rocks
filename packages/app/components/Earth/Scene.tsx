import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { EarthGlobe } from "../../../earth-globe";
import type { Store } from "../../store/store";
import { AppearScaleNode } from "./AppearScaleNode";
import { Controls } from "./Controls/Controls";
import { Locations } from "./Locations/Locations";
import { Sun } from "./Sun/Sun";

export const Scene = ({ store }: { store: Store }) => {
  const [ready, setReady] = React.useState(false);

  return (
    <Canvas
      camera={{ near: 0.1, far: 20, position: [0, 0, 1.95] }}
      dpr={[1, 2]}
    >
      <Controls store={store} />

      <ambientLight intensity={0.3} />

      <AppearScaleNode scaleTarget={ready ? 1 : 0.001}>
        <Suspense fallback={null}>
          <EarthGlobe />
          <Locations store={store} />
          <Sun store={store} />
          <ReadySpy onReady={() => setReady(true)} />
        </Suspense>
      </AppearScaleNode>
    </Canvas>
  );
};

/**
 * set the ready flag when the suspense is resolved, and the component mounted
 */
const ReadySpy = ({ onReady }: { onReady: () => void }) => {
  React.useEffect(onReady, []);
  return null;
};

export default Scene;
