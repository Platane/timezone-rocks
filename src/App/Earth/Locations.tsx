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
import { computeBestPlacement } from "./labelPlacement";

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

    camera.updateMatrixWorld();

    domElement.style.zIndex = zIndexRange + "";
    domElement.style.position = "relative";

    const positions = ref.current.children.map((node, i) => {
      node.getWorldPosition(position);

      const front = a.subVectors(position, camera.position).dot(position) < 0;

      position.project(camera);

      // let width = 100;
      // let height = 20;

      // const el = elementPool.current[i];
      // if (el) {
      //   const r = el.getBoundingClientRect();
      //   width = r.width;
      //   height = r.height;
      // }

      const x = ((position.x + 1) / 2) * size.width;
      const y = ((1 - position.y) / 2) * size.height;

      const p: any = new THREE.Vector2(x, y);

      p.front = front;
      p.z = position.z;

      return p;
    });

    computeBestPlacement(
      positions,
      new THREE.Vector2(size.width, size.height),
      0
    );

    elementPool.current.forEach((el, i) => {
      const { x, y, z, front } = positions[i] ?? {};
      el.style.transform = "translate(" + x + "px," + y + "px)";

      const zIndex = front
        ? zIndexRange + 1 + Math.floor(z * (zIndexRange - 1))
        : Math.floor(z * (zIndexRange - 1));
      el.style.zIndex = zIndex + "";
    });

    ref.current.children.map((node, i) => {
      const { x, y, z, front } = positions[i] ?? {};

      const dx = (x / size.width) * 2 - 1;
      const dy = 1 - (y / size.height) * 2;
      const d = new THREE.Vector3(dx, dy, 0);
      d.z = z + (front ? -0.03 : 0);
      d.unproject(camera);
      d.sub(node.position);

      const line = node.children[1] as THREE.LineSegments;

      line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), d]);
      line.computeLineDistances();
    });
  });

  return (
    <group ref={ref}>
      {locations.map((location) => (
        <group key={location.key} position={toWorld(location).toArray()}>
          (
          <mesh>
            <sphereBufferGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color={"#000"} />
          </mesh>
          )
          <lineSegments>
            <bufferGeometry />
            <lineDashedMaterial dashSize={0.03} gapSize={0.02} color={"#000"} />
          </lineSegments>
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
