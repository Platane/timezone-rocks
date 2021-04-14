import * as THREE from "three";
import { getBoxDistance } from "../../../math-utils";

type NodeU = {
  p: THREE.Vector2;
  v: THREE.Vector2;
  a: THREE.Vector2;
  anchor: THREE.Vector2;
  box: THREE.Box2;
  front: number;
};

const FRICTION = 10;
const TENSION = 90;
const DISK_OUT = 4;
const NODE_PUSH = 500;

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
    userData: { a, v, anchor, box, p, front },
  } of nodes) {
    // reset
    a.set(0, 0);

    // friction
    a.addScaledVector(v, -FRICTION);

    // anchor point tension
    {
      t.subVectors(p, anchor);
      const l = t.length() + 0.001;
      a.addScaledVector(t, -TENSION * (Math.min(l, w) / l));
    }

    // disk repulsion
    {
      t.subVectors(p, diskPosition);
      const l = t.length();

      if (l < diskRadius) {
        const h = Math.min(w, diskRadius - l);
        const f = front * DISK_OUT * h ** 2.2;
        a.addScaledVector(t, f / l);
      }
    }

    // box repulsion
    // {
    //   const l = p.y + box.min.y - world.min.y;
    //   a.y += 1 / l / l;
    // }
    // {
    //   const l = world.max.y - (p.y + box.max.y);
    //   a.y -= 1 / l / l;
    // }
    // {
    //   const l = Math.max(world.max.x - (p.x + box.max.x), 5);
    //   a.x -= WALL_PUSH / l;
    // }
    {
      // const dx = p.x + box.min.x - world.min.x;
      // a.x += WALL_PUSH / Math.max(dx, 1) ** 2;
    }
  }

  // apply repulsion from node to node
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i].userData;
      const b = nodes[j].userData;

      t.subVectors(a.p, b.p);

      if (t.lengthSq() < 0.0001) t.x += 0.01;

      const d = getBoxDistance(a.p, b.p, a.box, b.box);

      const f = NODE_PUSH / Math.max(1, d) ** 1.5;
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
