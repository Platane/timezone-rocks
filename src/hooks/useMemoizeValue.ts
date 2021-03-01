import deepEqual from "deep-equal";
import React from "react";

/**
 * example:
 * ```
 * const a = { x:0 }
 * const aMemoized = useMemoizeValue(a)
 *
 * useMemo( () => {
 *  // called once because aMemoized === aMemoized
 * },[aMemoized])
 * ```
 */
export const useMemoizeValue = <T>(
  x: T,
  equals: (a: T, b: T) => boolean = deepEqual
) => {
  const ref = React.useRef(x);

  if (equals(ref.current, x)) return ref.current;

  ref.current = x;

  return x;
};
