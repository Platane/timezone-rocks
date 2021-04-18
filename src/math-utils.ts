type Vec2 = { x: number; y: number };
type Box2 = { min: Vec2; max: Vec2 };

/**
 * return distance between a box and a point
 */
export const getBoxToPointDistance = (box: Box2, p: Vec2) => {
  const ex = (box.min.x + box.max.x) / 2;
  const ey = (box.min.y + box.max.y) / 2;

  let mx = ex > p.x ? box.min.x : box.max.x;
  let my = ey > p.y ? box.min.y : box.max.y;

  if (box.min.x < p.x && p.x < box.max.x) mx = p.x;
  else if (box.min.y < p.y && p.y < box.max.y) my = p.y;

  return Math.hypot(mx - p.x, my - p.y);
};

/**
 * return distance between boxes
 */
export const getBoxDistance = (b1: Box2, b2: Box2) => {
  if (intervalCollide(b1.min.x, b1.max.x, b2.min.x, b2.max.x)) {
    if ((b1.min.y + b1.max.y) * 0.5 < (b2.min.y + b2.max.y) * 0.5)
      return b2.min.y - b1.max.y;
    else return b1.min.y - b2.max.y;
  }

  if (intervalCollide(b1.min.y, b1.max.y, b2.min.y, b2.max.y)) {
    if ((b1.min.x + b1.max.x) * 0.5 < (b2.min.x + b2.max.x) * 0.5)
      return b2.min.x - b1.max.x;
    else return b1.min.x - b2.max.x;
  }

  const hx = (b1.min.x + b1.max.x) * 0.5 < (b2.min.x + b2.max.x) * 0.5;
  const hy = (b1.min.y + b1.max.y) * 0.5 < (b2.min.y + b2.max.y) * 0.5;

  return Math.hypot(
    (hx ? b1.max.x : b1.min.x) - (hx ? b2.min.x : b2.max.x),
    (hy ? b1.max.y : b1.min.y) - (hy ? b2.min.y : b2.max.y)
  );
};

const intervalCollide = (
  aMin: number,
  aMax: number,
  bMin: number,
  bMax: number
) => aMin <= bMax === aMax >= bMin;
