import { useEffect, useState } from "react";
import { getMatchingLocation } from "../locations";
import type { Location } from "../locations";

export const useSearchResults = (query = "") => {
  const [result, setResult] = useState<{
    query: string;
    locations: Location[];
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
