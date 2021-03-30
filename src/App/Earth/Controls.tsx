import React, { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useSelectedLocation } from "./Locations/useSelectedLocation";

export const Controls = () => {
  useSelectedLocation();
  const ref = useRef();

  return (
    <OrbitControls
      ref={ref}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      minDistance={1.95}
      maxDistance={10}
      enableZoom={false}
      enablePan={false}
    />
  );
};
