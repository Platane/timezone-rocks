import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/store";
import { computeBestPlacement } from "./labelPlacement";
import { useLabelElements } from "./useLabelElements";
import { latLngToWorld } from "./utils";

export const Locations = () => {
  const locations = useStore((s) => s.locations);
  const ref = useRef<THREE.Group>();
  const { gl } = useThree();

  const elementPool = useLabelElements(gl.domElement);

  useFrame(({ camera, size }) => {
    if (!ref.current) return;

    camera.updateMatrixWorld();

    gl.domElement.style.zIndex = zIndexRange + "";
    gl.domElement.style.position = "relative";

    const positions = ref.current.children.map((node, i) => {
      node.getWorldPosition(position);

      const front = a.subVectors(position, camera.position).dot(position) < 0;

      position.project(camera);

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
        <group key={location.key} position={latLngToWorld(location)}>
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
