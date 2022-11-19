import { Canvas, useThree } from "@react-three/fiber";
import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { selectLocations, selectT } from "../store/selector";
import { useSubscribe } from "../store/useSubscribe";
import { EarthGlobe } from "../Earth/EarthGlobe";
import * as THREE from "three";
import { latLngToWorld } from "../Earth/Locations/utils";
import { useStore } from "../store/store";
import { DateTime } from "luxon";

export const SolarSystemScene = () => (
  <Canvas
    camera={{ near: 0.1, far: 50, position: [0, 5, 5] }}
    dpr={[1, 2]}
    style={{ width: "900px", height: "700px" }}
  >
    <ambientLight intensity={0.1} />

    <OrbitControlsX />
    <Suspense fallback={null}>
      <SolarSystem />
    </Suspense>
  </Canvas>
);

const SolarSystem = () => (
  <>
    <Earth />
    <Sun />

    <OrbitPath />
  </>
);

const OrbitControlsX = () => {
  const { camera } = useThree();

  return (
    <OrbitControls
      enableDamping={false}
      makeDefault
      ref={React.useCallback(
        (oc) => {
          (camera as any).orbitcontrol = oc;
        },
        [camera]
      )}
    />
  );
};

const A = 12;

const earthAxisAngle = (23.5 / 180) * Math.PI;

const rotationDuration = 24 * 60 * 60 * 1000 + 4 * 60 * 1000;
// const rotationDuration = (23 * 60 * 60 + 56 * 60 + 4) * 1000;
const revolutionDuration = 365.256363004 * 24 * 60 * 60 * 1000;

//
// at the December solstice
// the angle should be 0
const marchEquinox = DateTime.fromISO("2022-03-20T15:33:23").toMillis();
const JunSolstice = DateTime.fromISO("2022-06-21T09:13:49").toMillis();
const septEquinox = DateTime.fromISO("2022-09-23T01:03:40").toMillis();
const decSolstice = DateTime.fromISO("2022-12-21T21:48:10").toMillis();

const revolutionOffset = -(decSolstice / revolutionDuration) % 1;

const rotationOffset = 0.345 + 0.5;

console.log(
  [marchEquinox, JunSolstice, septEquinox, decSolstice].map(
    (t) => (t % revolutionDuration) / revolutionDuration + revolutionOffset
  )
);
const OrbitPath = () => (
  <>
    {Array.from({ length: 1800 }).map((_, i, { length }) => (
      <mesh
        key={i}
        position={[
          Math.cos((i / length) * Math.PI * 2) * A,
          0,
          Math.sin((i / length) * Math.PI * 2) * A,
        ]}
      >
        <sphereBufferGeometry args={[0.05]} />
        <meshStandardMaterial />
      </mesh>
    ))}
  </>
);

const Earth = () => {
  const ref = React.useRef<THREE.Group | null>(null);
  const { camera } = useThree();

  useSubscribe((t) => {
    const rev =
      (t % revolutionDuration) / revolutionDuration + revolutionOffset;

    const rot = (t % rotationDuration) / rotationDuration + rotationOffset;

    const p = ref.current!;
    const r = p.children[0].children[0];

    p.position.set(
      Math.cos(rev * Math.PI * 2) * A,
      0,
      Math.sin(rev * Math.PI * 2) * A
    );

    r.quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rot * Math.PI * 2
    );

    // update orbit control
    {
      return;
      const oc = (camera as any).orbitcontrol;
      const v = new THREE.Vector3().subVectors(camera.position, oc.target);
      oc.target.copy(p.position);
      camera.position.copy(v.add(p.position));
      camera.lookAt(oc.target);
    }
  }, selectT);

  const locations = useStore(selectLocations);

  console.log(locations);

  return (
    <group
      ref={ref}
      onClick={() => {
        console.log("earth");
      }}
    >
      <group
        //
        //
        rotation={[
          0,
          0,

          //
          -earthAxisAngle,
        ]}
      >
        <group>
          <mesh>
            <sphereBufferGeometry args={[1]} />
            <meshBasicMaterial />
          </mesh>

          <EarthGlobe />

          {locations.map((l) => (
            <mesh key={l.key} position={latLngToWorld(l)}>
              <sphereBufferGeometry args={[0.07]} />
              <meshBasicMaterial color="orange" />
            </mesh>
          ))}

          <mesh>
            <cylinderBufferGeometry args={[0.05, 0.05, 10]} />
            <meshStandardMaterial color={"#789a9a"} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const Sun = () => (
  <group>
    <pointLight />
    <mesh>
      <sphereBufferGeometry args={[1]} />
      <meshBasicMaterial />
    </mesh>
  </group>
);
