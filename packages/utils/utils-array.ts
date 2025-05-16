/**
 * prune undefined or null values from the array
 */
export const pruneUndefined = <T>(arr: (T | undefined | null)[]) =>
  arr.filter(isNonNull) satisfies T[];

export const isNonNull = <T>(x: T): x is NonNullable<T> =>
  x !== null && x !== undefined;

/**
 * shallow equal on each item of the array
 */
export const arrayEquals = <T>(a: ArrayLike<T>, b: ArrayLike<T>) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
