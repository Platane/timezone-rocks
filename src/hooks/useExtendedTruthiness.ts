import { useEffect, useRef } from "react";
import { useForceUpdate } from "./useForceUpdate";

/**
 * whenever the value is truthy, return the value for x ms after if turns falsy
 *
 */
export const useExtendedTruthiness = <T>(value: T, delay: number) => {
  const forceUpdate = useForceUpdate();
  const extendedTruthyValue = useRef<T | null>(null);

  const truthy = isTruthy(value);

  if (truthy) extendedTruthyValue.current = value;

  useEffect(() => {
    if (truthy) return;

    const timeout = setTimeout(() => {
      extendedTruthyValue.current = null;
      forceUpdate();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, forceUpdate, truthy]);

  return extendedTruthyValue.current || value;
};

export const isTruthy = (x: any) => !!x;
