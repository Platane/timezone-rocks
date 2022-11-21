/**
 * prune undefined or null values from the array
 */
export const pruneUndefined = <T>(arr: (T | undefined | null)[]) =>
  arr.filter((a) => a !== undefined && a !== null) as T[];

export const arrayEquals = <T>(a: ArrayLike<T>, b: ArrayLike<T>) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};