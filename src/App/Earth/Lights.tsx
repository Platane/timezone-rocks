import React, { useRef } from "react";
import * as THREE from "three";
import { useStore } from "../store/store";
import { selectHour } from "../store/selector";

export const Lights = () => {
  const refLight = useRef<THREE.DirectionalLight>();
  const refSun = useRef<THREE.Object3D>();
  const refMoon = useRef<THREE.Object3D>();

  useStore.subscribe((h) => {
    const a = (h / 24) * (Math.PI * 2) + Math.PI;
    refLight.current?.position.set(Math.sin(a), 0, Math.cos(a));

    const A = 2.4;
    refSun.current?.position.set(Math.sin(a) * A, 0, Math.cos(a) * A);
    refMoon.current?.position.set(
      Math.sin(a + Math.PI) * A,
      0,
      Math.cos(a + Math.PI) * A
    );
  }, selectHour);

  return (
    <>
      <directionalLight position={[1, 0, 0]} intensity={0.2} ref={refLight} />
      <ambientLight intensity={0.1} />

      <mesh ref={refSun}>
        <sphereBufferGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={"orange"} />
      </mesh>

      <mesh ref={refMoon}>
        <sphereBufferGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={"#eee"} />
      </mesh>
    </>
  );
};
