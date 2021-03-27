import React from "react";
import * as THREE from "three";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { Html } from "../../Html";
import { Location } from "../../locations";
import { useStore } from "../store/store";

export const Locations = () => {
  const locations = useStore((s) => s.locations);

  return (
    <>
      {locations.map((location) => (
        <group key={location.key} position={toWorld(location).toArray()}>
          <mesh>
            <sphereBufferGeometry args={[0.01, 16, 16]} />
            <meshBasicMaterial color={"red"} />
          </mesh>

          <Html
            style={{
              pointerEvents: "none",
              whiteSpace: "pre",
            }}
          >
            <Label location={location} />
          </Html>
        </group>
      ))}
    </>
  );
};

const Label = ({ location }: { location: Location }) => {
  const ready = useStore((s) => s.earthReady && s.locationStoreReady);

  return (
    <span style={{ transition: "opacity 200ms", opacity: ready ? 1 : 0 }}>
      {getFlagEmoji(location.countryCode)} {location.name}
    </span>
  );
};

const s = new THREE.Spherical();
const toWorld = (
  { longitude, latitude }: { longitude: number; latitude: number },
  target = new THREE.Vector3()
) => {
  s.set(1.04, ((90 - latitude) / 180) * Math.PI, (longitude / 180) * Math.PI);
  return target.setFromSpherical(s);
};
