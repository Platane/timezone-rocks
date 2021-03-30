type Vec2 = { x: number; y: number };

/**
 * return distance between boxes
 */
export const getBoxDistance = (c1: Vec2, c2: Vec2, b1: Vec2, b2: Vec2) => {
  if (intervalCollide(c1.x, c1.x + b1.x, c2.x, c2.x + b2.x)) {
    if (c1.y + b1.y * 0.5 < c2.y + b2.y * 0.5) return c2.y - (c1.y + b1.y);
    else return c1.y - (c2.y + b2.y);
  }

  if (intervalCollide(c1.y, c1.y + b1.y, c2.y, c2.y + b2.y)) {
    if (c1.x + b1.x * 0.5 < c2.x + b2.x * 0.5) return c2.x - (c1.x + b1.x);
    else return c1.x - (c2.x + b2.x);
  }

  const hx = c1.x + b1.x * 0.5 < c2.x + b2.x * 0.5;
  const hy = c1.y + b1.y * 0.5 < c2.y + b2.y * 0.5;

  return Math.hypot(
    c1.x + +hx * b1.x - (c2.x + +!hx * b2.x),
    c1.y + +hy * b1.y - (c2.y + +!hy * b2.y)
  );
};

const intervalCollide = (
  aMin: number,
  aMax: number,
  bMin: number,
  bMax: number
) => aMin <= bMax === aMax >= bMin;
