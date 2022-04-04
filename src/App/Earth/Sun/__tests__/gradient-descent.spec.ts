import { solve } from "./gradient-descent";
import { toBeDeepCloseTo, toMatchCloseTo } from "jest-matcher-deep-close-to";
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

it("should converge", () => {
  const solution = [0.33, 0.4, 0.3];

  const f =
    ([a, b, c]: number[]) =>
    (x: number) =>
      a * x ** 2 + b * x + c;

  const samples = Array.from({ length: 100 }).map((_, i, { length: n }) => {
    const x = i / n;
    const y = f(solution)(x);

    return { x, y };
  });

  let k = 0;
  const getError = (s: number[]) =>
    void k++ ||
    samples.reduce((sum, { x, y }) => {
      const y2 = f(s)(x);
      const e = y - y2;
      return sum + e ** 2;
    }, 0);

  expect(
    solve(
      getError,
      solution.map(() => 0)
    )
  ).toBeDeepCloseTo(solution, 3);

  console.log(k);
});
