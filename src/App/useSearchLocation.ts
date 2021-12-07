import { useEffect, useState } from "react";
import { getMatchingLocation } from "../locations";
import type { ILocation } from "../locations";

export const useSearchResults = (query = "") => {
  const [result, setResult] = useState<{
    query: string;
    locations: ILocation[];
  }>();

  useEffect(() => {
    if (query.length)
      getMatchingLocation(query).then((locations) =>
        setResult({ query, locations })
      );
  }, [query]);

  if (!query) return [];

  if (result?.query === query) return result.locations;

  return null;
};
