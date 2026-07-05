import ParkMiller from "park-miller";

export const getColors = (seed: number) => {
  const pm = new ParkMiller(28113299 + seed ** 7 + seed);
  pm.float();
  pm.float();
  pm.float();
  pm.float();
  const h = pm.float() * 130 + 160;
  const s = pm.float() * 28 + 50;

  return {
    color: `hsl(${h},${s}%,56%)`,
    colorDark: `hsl(${h - 3},${s - 9}%,38%)`,
  };
};
