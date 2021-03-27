import React, { Suspense } from "react";
import { styled } from "@linaria/react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "drei";
import * as THREE from "three";
import { EarthGlobe } from "./EarthGlobe";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { Lights } from "./Lights";
import { Html } from "../../Html";
import type { Location } from "../../locations";

type Props = {
  list: Location[];
};

export const Earth = ({ list }: Props) => (
  <WorldCanvas
    style={{ height: "400px" }}
    camera={{ near: 0.1, far: 20, position: [0, 0, 1.95] }}
  >
    <OrbitControls
      minDistance={1.95}
      maxDistance={10}
      enableZoom={false}
      enablePan={false}
    />

    <Lights />

    <Suspense fallback={null}>
      <EarthGlobe />
    </Suspense>

    {false && <axesHelper args={[2]} />}

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

const WorldCanvas = styled(Canvas)`
  width: 100%;
`;
