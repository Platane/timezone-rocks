import { useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, delay: number) => {
  const [next, setNext] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setNext(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return next;
};
