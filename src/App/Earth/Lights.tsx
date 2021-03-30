import React, { useRef } from "react";
import * as THREE from "three";
import { selectHour } from "../store/selector";
import { useSubscribe } from "../store/useSubscribe";

export const Lights = () => {
  const refLight = useRef<THREE.DirectionalLight>();

  useSubscribe((h) => {
    const a = (h / 24) * (Math.PI * 2) + Math.PI;
    refLight.current?.position.set(Math.sin(a), 0, Math.cos(a));
  }, selectHour);

  return (
    <>
      <directionalLight position={[1, 0, 0]} intensity={0.2} ref={refLight} />
      <ambientLight intensity={0.1} />
    </>
  );
};
