import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { Location } from "../../locations";
import { useStore } from "../store/store";
import { useSubscribe } from "../store/useSubscribe";
import { getDate } from "../../timezone/timezone";
import { formatTime } from "../../intl-utils";
import { getActivity } from "../Avatar/activity";

export const Locations = () => {
  const locations = useStore((s) => s.locations);
  const ready = useStore((s) => s.earthReady && s.locationStoreReady);
  const ref = useRef<THREE.Group>();

  const elementPool = useRef<HTMLElement[]>([]);
  useSubscribe(
    (t: number) => {
      let i = 0;
      for (; i < locations.length; i++) {
        let el = elementPool.current[i];
        if (!el) {
          el = createLabel();

          if (domElement.parentElement)
            domElement.parentElement.appendChild(el);

          elementPool.current[i] = el;
        }

        renderLabel(el, locations[i], t);

        el.style.opacity = ready ? "1" : "0";
      }

      for (; i < elementPool.current.length; i++) {
        const el = elementPool.current[i];
        if (el.parentElement) el.parentElement.removeChild(el);
      }
      elementPool.current.length = locations.length;
    },
    (s) => s.t,
    [locations, ready]
  );
  useEffect(
    () => () => {
      elementPool.current.forEach((el) => {
        if (el.parentElement) el.parentElement.removeChild(el);
      });
    },
    []
  );

  const {
    gl: { domElement },
  } = useThree();

  useFrame(({ camera, size }) => {
    if (!ref.current) return;

    domElement.style.zIndex = zIndexRange + "";

    for (let i = ref.current.children.length; i--; ) {
      const el = elementPool.current[i];
      const node = ref.current.children[i];

      if (!el) return;

      camera.updateMatrixWorld();

      node.getWorldPosition(position);

      const o = a.subVectors(position, camera.position).dot(position) < 0;

      position.project(camera);

      el.style.zIndex = Math.floor(
        o
          ? zIndexRange + 1 + (1 - position.z) * (zIndexRange - 2)
          : zIndexRange - 1 - position.z * (zIndexRange - 2)
      ).toString();

      const x = (position.x + 1) / 2;
      const y = (1 - position.y) / 2;
      el.style.transform =
        "translate(" + x * size.width + "px," + y * size.height + "px)";
    }
  });

  return (
    <group ref={ref}>
      {locations.map((location) => (
        <group key={location.key} position={toWorld(location).toArray()}>
          <mesh>
            <sphereBufferGeometry args={[0.01, 16, 16]} />
            <meshBasicMaterial color={"red"} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const a = new THREE.Vector3();
const position = new THREE.Vector3();
const zIndexRange = 1000;

const s = new THREE.Spherical();
const toWorld = (
  { longitude, latitude }: { longitude: number; latitude: number },
  target = new THREE.Vector3()
) => {
  s.set(1.04, ((90 - latitude) / 180) * Math.PI, (longitude / 180) * Math.PI);
  return target.setFromSpherical(s);
};

const createLabel = () => {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.left = "-10px";
  el.style.top = "-10px";
  el.style.height = "20px";
  el.style.zIndex = "10";
  el.style.transition = "opacity 200ms";
  el.style.pointerEvents = "none";
  el.style.color = "#fff";
  el.style.fontFamily = "monospace";
  el.style.textShadow = "0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1)";

  return el;
};

const renderLabel = (el: HTMLElement, location: Location, t: number) => {
  const flag = getFlagEmoji(location.countryCode);
  const date = getDate(location.timezone, t);
  const hour = formatTime(date.hour);
  const activity = getActivity(date.hour);
  el.innerText = `${activity} ${hour}`;
};
