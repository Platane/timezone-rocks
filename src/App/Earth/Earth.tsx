import React, { Suspense } from "react";
import { styled } from "@linaria/react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, Html } from "drei";
import * as THREE from "three";
import { EarthGlobe } from "./EarthGlobe";
import { getFlagEmoji } from "../../emojiFlagSequence";
import type { Location } from "../useLocationStore";

type Props = {
  list: Location[];
};

export const Earth = ({ list }: Props) => {
  return (
    <WorldCanvas style={{ height: "400px" }}>
      <OrbitControls />
      <directionalLight position={[10, 8, 6]} intensity={0.1} />
      <ambientLight />

      <Suspense fallback={null}>
        <EarthGlobe />
      </Suspense>

      <axesHelper args={[2]} />

      <mesh>
        <sphereBufferGeometry args={[0.1, 64, 64]} />
        <meshPhysicalMaterial color={"orange"} metalness={0} roughness={0} />
      </mesh>

      {list.map(({ key, name, countryCode, longitude, latitude }) => {
        const s = new THREE.Spherical(
          1.04,
          ((90 - latitude) / 180) * Math.PI,
          (longitude / 180) * Math.PI
        );
        const p = new THREE.Vector3().setFromSpherical(s);

        return (
          <group key={key} position={p.toArray()}>
            <mesh>
              <sphereBufferGeometry args={[0.01, 16, 16]} />
              <meshBasicMaterial color={"red"} />
            </mesh>

            <Html style={{ pointerEvents: "none", whiteSpace: "pre" }}>
              {getFlagEmoji(countryCode)} {name}
            </Html>
          </group>
        );
      })}
    </WorldCanvas>
  );
};

const WorldCanvas = styled(Canvas)`
  width: 100%;
`;
