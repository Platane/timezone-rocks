import { useEffect, useState } from "react";
import type { Location } from "./useLocationStore";

export const useList = (locations?: Location[]) => {
  const [list, setList] = useState<Location[]>([]);

  useEffect(() => {
    if (!locations) return;

    const list = split(window.location.hash.slice(1), 3)
      .map((key) => locations.find((c) => c.key === key)!)
      .filter(Boolean);

    setList(list);
  }, [locations]);

  useEffect(() => {
    if (!locations) return;

    window.location.hash = list.map((c) => c.key).join("");
  }, [locations, list]);

  return {
    list,
    add: (c: Location) =>
      setList((l) => [...l.filter((cc) => c.key !== cc.key), c]),
    remove: (c: Location) => setList((l) => l.filter((cc) => c !== cc)),
    clear: () => setList([]),
  };
};

const split = (x: string, n: number) =>
  Array.from({ length: Math.floor(x.length / n) }, (_, i) =>
    x.slice(i * n, (i + 1) * n)
  );
