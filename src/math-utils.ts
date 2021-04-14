type Vec2 = { x: number; y: number };
type Box2 = { min: Vec2; max: Vec2 };

/**
 * return distance between boxes
 */
export const getBoxDistance = (c1: Vec2, c2: Vec2, b1: Box2, b2: Box2) => {
  if (
    intervalCollide(
      c1.x + b1.min.x,
      c1.x + b1.max.x,
      c2.x + b2.min.x,
      c2.x + b2.max.x
    )
  ) {
    if (c1.y + (b1.min.y + b1.max.y) * 0.5 < c2.y + (b2.min.y + b2.max.y) * 0.5)
      return c2.y + b2.min.y - (c1.y + b1.max.y);
    else return c1.y + b1.min.y - (c2.y + b2.max.y);
  }

  if (
    intervalCollide(
      c1.y + b1.min.y,
      c1.y + b1.max.y,
      c2.y + b2.min.y,
      c2.y + b2.max.y
    )
  ) {
    if (c1.x + (b1.min.x + b1.max.x) * 0.5 < c2.x + (b2.min.x + b2.max.x) * 0.5)
      return c2.x + b2.min.x - (c1.x + b1.max.x);
    else return c1.x + b1.min.x - (c2.x + b2.max.x);
  }

  const hx =
    c1.x + (b1.min.x + b1.max.x) * 0.5 < c2.x + (b2.min.x + b2.max.x) * 0.5;
  const hy =
    c1.y + (b1.min.y + b1.max.y) * 0.5 < c2.y + (b2.min.y + b2.max.y) * 0.5;

  return Math.hypot(
    c1.x + (hx ? b1.max.x : b1.min.x) - (c2.x + (hx ? b2.min.x : b2.max.x)),
    c1.y + (hy ? b1.max.y : b1.min.y) - (c2.y + (hy ? b2.min.y : b2.max.y))
  );
};

const intervalCollide = (
  aMin: number,
  aMax: number,
  bMin: number,
  bMax: number
) => aMin <= bMax === aMax >= bMin;
