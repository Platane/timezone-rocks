export const split = (x: string, n: number) =>
  Array.from({ length: Math.floor(x.length / n) }, (_, i) =>
    x.slice(i * n, (i + 1) * n)
  );
