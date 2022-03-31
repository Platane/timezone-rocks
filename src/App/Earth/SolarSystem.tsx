import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EarthGlobe } from "./EarthGlobe";
import { Sun } from "./Sun/Sun";
import { Locations } from "./Locations/Locations";
import { stepSpring } from "../../spring-utils";
import { useStore } from "../store/store";
import { Controls } from "./Controls/Controls";
import { useSubscribe } from "../store/useSubscribe";
import { selectT } from "../store/selector";
// import { getH, getR } from "./Sun/utils";

export const Scene = () => {
  const ready = useStore((s) => s.earthReady);

  return (
    <Canvas
      id="scene-earth"
      camera={{ near: 0.1, far: 500, position: [0, 6, 10.95] }}
      dpr={[1, 2]}
    >
      <Controls />

      <ambientLight intensity={0.1} />

      <Suspense fallback={null}>
        <SolarSystem />
      </Suspense>

      {/* <AppearScaleNode scale={ready ? 1 : 0.001}>
        <Suspense fallback={null}>
        <EarthGlobe />
          <Locations />
          <Sun />

        </Suspense>
      </AppearScaleNode> */}
    </Canvas>
  );
};

const SolarSystem = () => {
  const earthRef = useRef<THREE.Object3D>();
  const sunRef = useRef<THREE.Object3D>();

  const { camera } = useThree();

  useSubscribe((t) => {
    const r = 0;
    const h = 0;
    // const r = getR(t);
    // const h = getH(t);

    const A = 6;

    const y = new THREE.Vector3(0, 1, 0);

    const object1 = new THREE.Object3D();
    const object2 = new THREE.Object3D();
    {
      // object1.quaternion.setFromEuler(new THREE.Euler(earthAxisAngle, 0, 0));
      object1.add(object2);
    }
    {
      const theta = r * Math.PI * 2;
      object1.position.set(A * Math.cos(theta), 0, A * Math.sin(theta));
      object2.quaternion.setFromAxisAngle(y, h * Math.PI * 2);
    }

    const v = object1.position.clone().normalize();

    object2.updateWorldMatrix(true, true);
    object1.updateMatrixWorld(true);
    object2.updateMatrixWorld(true);

    const inv = object2.matrixWorld.clone().invert();
    const q = new THREE.Quaternion().setFromRotationMatrix(inv);

    v.applyQuaternion(q);

    // {
    //   const sp = object1.position.clone().applyMatrix4(inv);
    //   sunRef.current?.position.copy(sp);
    //   console.log(sp);
    // }

    const earthNode = earthRef.current!;
    object2.getWorldPosition(earthNode.position);
    object2.getWorldQuaternion(earthNode.quaternion);
  }, selectT);

  const earthAxisAngle = (23.5 / 180) * Math.PI;

  return (
    <>
      <group ref={earthRef}>
        <Locations />
        <EarthGlobe />
      </group>
      {/* <mesh ref={earthRef}>
        <sphereGeometry />
        <meshStandardMaterial color={"blue"} />
      </mesh> */}

      <axesHelper args={[2]} />

      <mesh
        quaternion={new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.PI / 2, 0, 0)
        )}
      >
        <planeBufferGeometry args={[10, 10, 10, 10]} />
        <meshBasicMaterial wireframe color="white" />
      </mesh>

      <group ref={sunRef}>
        <pointLight />
        <mesh>
          <sphereGeometry />
          <meshBasicMaterial color="orange" />
        </mesh>
      </group>
    </>
  );
};

const springConfig = { tension: 80, friction: 9 };
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

export default Scene;
