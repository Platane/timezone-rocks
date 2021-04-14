import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/store";
import { useLabelElements } from "./useLabelElements";
import { latLngToWorld } from "./utils";
import { step } from "./physical";
import { MathUtils } from "three";

export const Locations = () => {
  const locations = useStore((s) => s.locations);
  const ref = useRef<THREE.Group>();
  const { gl } = useThree();

  const elementPool = useLabelElements(gl.domElement);

  useFrame(({ camera, size }, dt) => {
    if (!ref.current) return;

    gl.domElement.style.zIndex = "1000";
    gl.domElement.style.position = "relative";

    camera.updateMatrixWorld();

    // set the anchor point
    const nodes = ref.current.children;
    for (const node of nodes) {
      node.getWorldPosition(a);
      a.project(camera);

      const x = ((a.x + 1) / 2) * size.width;
      const y = ((1 - a.y) / 2) * size.height;

      if (!node.userData.p) {
        node.userData.p = new THREE.Vector2(x, y);
        node.userData.a = new THREE.Vector2();
        node.userData.v = new THREE.Vector2();
        node.userData.anchor = new THREE.Vector2();
        node.userData.box = nodeBox;
      }

      node.userData.anchor.x = x;
      node.userData.anchor.y = y;
      node.userData.z = a.z;

      {
        node.getWorldPosition(a).normalize();
        b.subVectors(a, camera.position).normalize();

        const dot = a.dot(b);

        node.userData.front = dot < 0 ? 0 : dot ** 0.5;
      }
    }

    // nodes[0].userData.anchor.copy(mouse);

    // step physical world

    worldBox.min.x = 0;
    worldBox.min.y = 0;
    worldBox.max.x = size.width;
    worldBox.max.y = size.height;

    a.set(0, 0, 0);
    a.project(camera);
    diskPosition.set(
      ((a.x + 1) / 2) * size.width,
      ((1 - a.y) / 2) * size.height
    );

    step(
      ref.current.children as any,
      diskPosition,
      size.height * 0.5,
      worldBox,
      Math.min(dt, 1 / 30)
    );

    //

    // apply new position to the label
    elementPool.current.forEach((el, i) => {
      const { p, z, front } = nodes[i].userData;
      const x = p.x;
      const y = p.y;
      el.style.transform = `translate(${x}px, ${y}px)`;

      const uz = MathUtils.clamp(1 - z, 0, 1);
      const zIndex =
        front === 0 ? Math.round(uz * 1000) + 1001 : 1 + Math.round(uz * 998);
      el.style.zIndex = zIndex + "";
    });

    // apply new position of the dashed line
    for (const node of nodes) {
      const { p, z } = node.userData;

      a.set((p.x / size.width) * 2 - 1, 1 - (p.y / size.height) * 2, z);
      a.unproject(camera);
      a.sub(node.position);

      const line = node.children[1] as THREE.LineSegments;

      line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), a]);
      line.computeLineDistances();
    }
  });

  return (
    <group ref={ref}>
      {locations.map((location) => (
        <group key={location.key} position={latLngToWorld(location)}>
          <mesh>
            <sphereBufferGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color={"#000"} />
          </mesh>

          <lineSegments frustumCulled={false}>
            <lineDashedMaterial dashSize={0.03} gapSize={0.02} color={"#000"} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
};

const a = new THREE.Vector3();
const b = new THREE.Vector3();
const worldBox = new THREE.Box2();
const nodeBox = new THREE.Box2();
nodeBox.min.y = -10;
nodeBox.max.y = 10;
nodeBox.min.x = -10;
nodeBox.max.x = 65;
const diskPosition = new THREE.Vector2();
