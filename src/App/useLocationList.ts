import { useEffect, useState } from "react";
import type { Location } from "./useLocationStore";

export const useList = (cities?: Location[]) => {
  const [list, setList] = useState<Location[]>([]);

  useEffect(() => {
    if (!cities) return;

    const list = split(window.location.hash.slice(1), 3)
      .map((key) => cities.find((c) => c.key === key)!)
      .filter(Boolean);

    setList(list);
  }, [cities]);

  useEffect(() => {
    if (!cities) return;

    window.location.hash = list.map((c) => c.key).join("");
  }, [cities, list]);

  return {
    list,
    add: (c: Location) =>
      setList((l) => [...l.filter((cc) => c.key !== cc.key), c]),
    remove: (c: Location | string) =>
      setList((l) => l.filter((cc) => (c as any)?.key || c !== cc.key)),
    clear: () => setList([]),
  };
};

const split = (x: string, n: number) =>
  Array.from({ length: Math.floor(x.length / n) }, (_, i) =>
    x.slice(i * n, (i + 1) * n)
  );
