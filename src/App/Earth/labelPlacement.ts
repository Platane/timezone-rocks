import * as THREE from "three";

const box = new THREE.Vector2(100, 20);

export const computeBestPlacement = (
  positions: (THREE.Vector2 & { front: boolean })[],
  container: THREE.Vector2,
  sphereRadius: number
) => {
  const anchors = positions.map((p) => p.clone());
  for (let i = 100; i--; ) step(positions, anchors, container, sphereRadius);
};

const as: THREE.Vector2[] = [];
const m = new THREE.Vector2();
const step = (
  positions: (THREE.Vector2 & { front: boolean })[],
  anchors: THREE.Vector2[],
  container: THREE.Vector2,
  sphereRadius: number
) => {
  // prepare
  while (as.length < positions.length) as.push(new THREE.Vector2());

  // reset acceleration
  // + apply spring tension from position to anchor
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const a = as[i];

    a.set(0, 0);
    m.copy(p).sub(anchors[i]).multiplyScalar(-0.2);
    a.add(m);
  }

  // apply repulsion from other boxes
  for (let i = 0; i < positions.length; i++)
    for (let j = i + 1; j < positions.length; j++) {
      m.copy(positions[i]).sub(positions[j]);
      const l = m.length();
      m.multiplyScalar(1 / l);

      const f = 40 / Math.max(4, l);
      as[i].addScaledVector(m, f);
      as[j].addScaledVector(m, -f);
    }

  // apply acceleration
  for (let i = 0; i < positions.length; i++) positions[i].add(as[i]);
};
