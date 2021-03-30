import * as THREE from "three";
import { getBoxDistance } from "../../math-utils";

const box = new THREE.Vector2(100, 20);

export const computeBestPlacement = (
  positions: (THREE.Vector2 & { front: boolean })[],
  container: THREE.Vector2,
  sphereRadius: number
) => {
  const anchors = positions.map((p) => p.clone());
  for (let i = 100; i--; )
    step(positions, anchors, container, sphereRadius, (i + 5) / 100);
};

const as: THREE.Vector2[] = [];
const m = new THREE.Vector2();
const step = (
  positions: (THREE.Vector2 & { front: boolean })[],
  anchors: THREE.Vector2[],
  container: THREE.Vector2,
  sphereRadius: number,
  dt = 1
) => {
  // prepare
  while (as.length < positions.length) as.push(new THREE.Vector2());

  // reset acceleration
  // + apply spring tension from position to anchor
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const a = as[i];

    a.set(0, 0);
    m.copy(p).sub(anchors[i]).multiplyScalar(-0.12);
    a.add(m);
  }

  // apply repulsion from other boxes
  for (let i = 0; i < positions.length; i++)
    for (let j = i + 1; j < positions.length; j++) {
      m.copy(positions[i]).sub(positions[j]);

      if (m.lengthSq() < 0.0001) m.x += 0.01;

      const d = getBoxDistance(positions[i], positions[j], box, box);

      const f = 10 / Math.max(2, d);
      const l = m.length();

      as[i].addScaledVector(m, f / l);
      as[j].addScaledVector(m, -f / l);
    }

  // apply acceleration
  for (let i = 0; i < positions.length; i++)
    positions[i].addScaledVector(as[i], dt);
};
