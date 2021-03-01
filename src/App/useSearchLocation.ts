import { useCallback, useMemo } from "react";
import deburr from "lodash.deburr";
import type { Location } from "./useLocationStore";

export const useSearch = (locations: Location[]) => {
  const normalizedList = useMemo(
    () =>
      locations.map((value) => ({ value, normalized: normalize(value.name) })),
    [locations]
  );

  const search = useCallback(
    (query: string) => {
      const res: Location[] = [];

      if (!query) return res;

      const q = normalize(query);

      for (const { value, normalized } of normalizedList) {
        if (normalized.includes(q)) {
          res.push(value);
          if (res.length >= 16) return res;
        }
      }
      return res;
    },
    [normalizedList]
  );

  return search;
};

const normalize = (s: string) => deburr(s.toLowerCase());

export const useSearchResults = (
  search: ReturnType<typeof useSearch>,
  query = ""
) => useMemo(() => search(query), [query, search]);
