import { useEffect, useState } from "react";

export const useDecayedValue = <T>(value: T, delay: number) => {
  const [decayed, setDecayed] = useState<T>();

  useEffect(() => {
    const timeout = setTimeout(() => setDecayed(value), delay);
    return () => clearTimeout(timeout);
  });

  return decayed === value ? value : null;
};
