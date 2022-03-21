import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/store";
import { latLngToWorld } from "./utils";
import { NodeU, step } from "./physical";
import { Label, labelBox } from "./Label";
import { selectLocations } from "../../store/selector";

export const Locations = () => {
  const ref = useRef<THREE.Group>();

  //
  // create and attach a dom element along the canvas
  //
  const {
    gl: { domElement },
  } = useThree();
  const [domContainer] = useState(() => document.createElement("div"));
  useEffect(() => {
    domElement.parentElement?.parentElement?.appendChild(domContainer);
    return () => {
      domContainer.parentElement?.removeChild(domContainer);
    };
  }, [domElement]);

  //
  // physics on every frame
  //
  const refDtRest = useRef(0);
  useFrame(({ camera, size }, dt) => {
    if (!ref.current) return;

    camera.updateMatrixWorld();

    // set the anchor point
    const nodes = ref.current.children;
    for (const node of nodes) {
      node.getWorldPosition(a);
      a.project(camera);

      const x = ((a.x + 1) / 2) * size.width;
      const y = ((1 - a.y) / 2) * size.height;

      const u = node.userData as NodeU;

      if (!u.p) {
        u.p = new THREE.Vector2(x, y);
        u.a = new THREE.Vector2();
        u.v = new THREE.Vector2();
        u.anchor = new THREE.Vector2();
        u.box = nodeBox;
      }

      u.anchor.x = x;
      u.anchor.y = y;
      (u.anchor as any).z = a.z;

      {
        node.getWorldPosition(a).normalize();
        b.subVectors(a, camera.position).normalize();

        node.userData.z = a.dot(b);
      }
    }

    // get disk position in screen space
    getSphereScreenSpace(camera, ref.current!, size, sphereScreenSpace);

    const w = domContainer.parentElement!.parentElement!.clientWidth;
    worldBox.min.x = -(w - size.width) / 2;
    worldBox.min.y = 0;
    worldBox.max.x = w - (w - size.width) / 2;
    worldBox.max.y = size.height;

    // step physical world
    const fixedDt = 1 / 120;
    refDtRest.current = Math.min(refDtRest.current + dt, fixedDt * 10);
    while (refDtRest.current >= fixedDt) {
      step(
        nodes as any,
        sphereScreenSpace.center as any,
        sphereScreenSpace.radius,
        worldBox,
        fixedDt
      );
      refDtRest.current -= fixedDt;
    }

    // apply new position to the label
    for (let i = 0; i < domContainer.children.length; i++) {
      const node = nodes[i];
      if (node) {
        const el = domContainer.children[i] as HTMLElement;

        const { p, z } = node.userData as NodeU;
        const x = p.x;
        const y = p.y;
        el.style.transform = `translate(${x}px, ${y}px)`;

        const zIndex =
          z > 0 ? Math.round(z * 998) + 1 : +1001 + Math.round(-z * 998);
        el.style.zIndex = zIndex + "";
      }
    }

    // apply new position of the dashed line
    for (const node of nodes) {
      const { p, anchor } = node.userData as NodeU;

      a.set(
        (p.x / size.width) * 2 - 1,
        1 - (p.y / size.height) * 2,
        (anchor as any).z - 0.02
      );
      a.unproject(camera);
      node.worldToLocal(a);

      const line = node.children[1] as THREE.LineSegments;

      line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), a]);
      line.computeLineDistances();
    }
  });

  return (
    <>
      <group ref={ref}>
        {useStore(selectLocations).map((location) => (
          <group key={location.key} position={latLngToWorld(location)}>
            <mesh>
              <sphereBufferGeometry args={[0.008, 6, 6]} />
              <meshBasicMaterial color={"#000"} />
            </mesh>

            <lineSegments frustumCulled={false}>
              <lineDashedMaterial
                dashSize={0.03}
                gapSize={0.02}
                color={"#000"}
              />
            </lineSegments>
          </group>
        ))}
      </group>
      <LabelContainer domContainer={domContainer} />
    </>
  );
};

const LabelContainer = ({ domContainer }: { domContainer: HTMLDivElement }) => {
  React.useLayoutEffect(() => {
    ReactDOM.render(<Labels />, domContainer);
    return () => {
      ReactDOM.unmountComponentAtNode(domContainer);
    };
  }, [domContainer]);

  return null;
};

const Labels = () => (
  <>
    {useStore(selectLocations).map((location) => (
      <Label key={location.key} location={location} />
    ))}
  </>
);

const sphereScreenSpace = new THREE.Sphere();
const a = new THREE.Vector3();
const b = new THREE.Vector3();
const worldBox = new THREE.Box2();
const nodeBox = new THREE.Box2().copy(labelBox as any);

const getSphereScreenSpace = (() => {
  const e = new THREE.Vector3();
  const n = 45;

  return (
    camera: THREE.Camera,
    group: THREE.Object3D,
    size: { width: number; height: number },
    target: THREE.Sphere
  ) => {
    // center
    group.getWorldPosition(target.center);
    toScreenSpace(target.center, camera, size);

    // radius
    target.radius = 0;
    for (let k = n; k--; ) {
      const u = k / n;

      const phi = Math.PI * u;
      const theta = Math.PI * 2 * u * 8.89;
      const radius = 1;

      e.setFromSphericalCoords(radius, phi, theta);
      group.localToWorld(e);
      toScreenSpace(e, camera, size);

      target.radius = Math.max(
        target.radius,
        Math.hypot(e.x - target.center.x, e.y - target.center.y)
      );
    }
  };
})();

const toScreenSpace = (
  pWorld: THREE.Vector3,
  camera: THREE.Camera,
  { width, height }: { width: number; height: number }
) => {
  pWorld.project(camera);

  pWorld.x = ((pWorld.x + 1) / 2) * width;
  pWorld.y = ((1 - pWorld.y) / 2) * height;
};
