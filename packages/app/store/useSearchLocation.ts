import type { LocationSearcher } from "@tzr/location-index";
import { useAsyncMemo } from "../hooks/useAsyncMemo";

export const useSearchResults = (searcher: LocationSearcher, query = "") =>
  useAsyncMemo(
    () => (query.trim().length ? searcher.getMatchingLocation(query) : []),
    [query]
  );
