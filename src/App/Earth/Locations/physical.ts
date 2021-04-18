import * as THREE from "three";
import { MathUtils } from "three";
import { getBoxDistance, getBoxToPointDistance } from "../../../math-utils";

export type NodeU = {
  p: THREE.Vector2;
  v: THREE.Vector2;
  a: THREE.Vector2;
  anchor: THREE.Vector2;
  box: THREE.Box2;
  z: number;
};

const FRICTION = 10;
const TENSION = 90;
const DISK_OUT = 40;
const NODE_PUSH = 5000;

const pre = document.createElement("pre");
pre.style.position = "fixed";
pre.style.top = "0";
pre.style.left = "0";
pre.style.color = "#fff";
document.body.appendChild(pre);
const print = (o: any) => {
  pre.innerText = JSON.stringify(
    Object.fromEntries(
      Object.entries(o).map(([key, value]) => {
        if (typeof value === "number") return [key, value.toFixed(2)];
        return [key, value];
      })
    ),
    null,
    2
  );
};

export const step = (
  nodes: { userData: NodeU }[],
  diskPosition: THREE.Vector2,
  diskRadius: number,
  world: THREE.Box2,
  dt: number
) => {
  const w = (world.max.x - world.min.x) * 0.3;

  // reset acceleration
  // + apply simple forces
  for (const {
    userData: { a, v, anchor, box, p, z },
  } of nodes) {
    // reset
    a.set(0, 0);

    const depthPressure = z > 0 ? 1 : MathUtils.clamp(1 + z * 2.3, 0, 1) ** 2;

    // friction
    a.addScaledVector(v, -FRICTION);

    // anchor point tension
    {
      t.subVectors(p, anchor);

      const l = t.length();
      const f = MathUtils.lerp(l, Math.min(l, 10), depthPressure);

      a.addScaledVector(t.normalize(), -f * TENSION);
    }

    // disk repulsion
    {
      const d = getBoxToPointDistance(tmp.copy(box).translate(p), diskPosition);

      const f = Math.max(0, diskRadius + 20 - d) ** 1.8 * depthPressure;

      t.subVectors(p, diskPosition);
      a.addScaledVector(t.normalize(), f * DISK_OUT);
    }

    // box repulsion
    // TODO
  }

  // apply repulsion from node to node
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i].userData;
      const b = nodes[j].userData;

      t.subVectors(a.p, b.p);

      if (t.lengthSq() < 0.0001) t.x += 0.01;

      const d = Math.max(
        1,
        getBoxDistance(
          tmp.copy(a.box).translate(a.p),
          tmp2.copy(b.box).translate(b.p)
        )
      );

      const f = NODE_PUSH / d ** 1;
      t.normalize();

      a.a.addScaledVector(t, f);
      b.a.addScaledVector(t, -f);
    }

  // apply acceleration
  for (const {
    userData: { a, v, p },
  } of nodes) {
    const l = a.length();

    const ma = w / dt ** 2;

    if (l > ma) a.multiplyScalar(ma / l);

    v.addScaledVector(a, dt);
    p.addScaledVector(v, dt);
    a.set(0, 0);
  }
};

const t = new THREE.Vector2();
const tmp = new THREE.Box2();
const tmp2 = new THREE.Box2();
