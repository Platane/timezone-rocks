import { useEffect, useState } from "react";

export const useDecayedValue = <T>(value: T, delay: number) => {
  const [decayed, setDecayed] = useState<T>();

  useEffect(() => {
    const timeout = setTimeout(() => setDecayed(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return decayed === value ? null : value;
};
