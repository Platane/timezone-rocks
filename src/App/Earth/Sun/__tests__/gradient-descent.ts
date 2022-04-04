import asciichart from "asciichart";

/**
 * find the best solution s
 * so that getError( s ) is minimal
 */
export const solve = <V extends number[]>(
  getError: (s: V) => number,
  solution0: V
): V => {
  const solution = solution0;
  const solution2 = solution.slice() as V;
  const partialDerivative = solution.slice() as V;

  let e = getError(solution);

  const n = 2000;
  const dt = 0.0001;
  const step0 = 1;

  const h = [];

  for (let k = n; k--; ) {
    //
    computePartialDerivative(getError, solution, partialDerivative, dt);

    // move r along the vector
    {
      let step = step0;

      let hc = 0;

      let e_ = e;
      while (step > 0.000001) {
        copyAndAddScaledVector(solution2, solution, partialDerivative, -step);
        const e2 = getError(solution2);

        if (e2 < e) {
          copy(solution, solution2);
          e = e2;
          hc++;
        } else {
          step = step / 2;
        }
      }

      h.push(hc);

      // did not move, it's the best solution
      if (e_ === e) break;
    }
  }

  {
    const a = new Map();
    h.sort((a, b) => a - b).forEach((x) => a.set(x, (a.get(x) ?? 0) + 1));
    const arr = Array.from(
      { length: Math.min(80, Math.max(...a.keys())) },
      (_, i) => a.get(i) ?? 0
    );
    // console.log(asciichart.plot(arr, { height: 16 }), a);
  }

  return solution;
};

const copy = (target: number[], v: number[]) => {
  for (let i = target.length; i--; ) target[i] = v[i];
};

const copyAndAddScaledVector = (
  target: number[],
  origin: number[],
  v: number[],
  l: number
) => {
  for (let i = target.length; i--; ) target[i] = origin[i] + v[i] * l;
};

const computePartialDerivative = <V extends number[]>(
  fn: (x: V) => number,
  x: V,
  target: V,
  dx: number
) => {
  for (let i = x.length; i--; ) {
    const xi = x[i];

    x[i] = xi - dx;
    const y1 = fn(x);

    x[i] = xi + dx;
    const y2 = fn(x);

    target[i] = (y2 - y1) / (2 * dx);

    x[i] = xi;
  }
};
