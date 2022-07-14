export const arrayEquals = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((_, i) => a[i] === b[i]);

/**
 * pick a random element in the array
 */
export const pickRandom = <T>(arr: T[], rand = Math.random) =>
  arr[Math.floor(rand() * arr.length)];

/**
 * shuffle an array in place
 */
export const shuffle = <T>(arr: T[]) => {
  for (let i = arr.length; i--; ) {
    const j = Math.floor(Math.random() * i);

    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};

/**
 * create a array of size n, which contains a subset of arr elements, in the same order uniformly picked
 */
export const createSampleArray = <T>(arr: T[], n: number) =>
  Array.from(
    { length: n },
    (_, i) => arr[Math.floor((i / n) * arr.length) % arr.length]
  );
