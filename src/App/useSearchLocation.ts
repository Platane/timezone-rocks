import { getMatchingLocation } from "../locations";
import { useAsyncMemo } from "../hooks/useAsyncMemo";

export const useSearchResults = (query = "") =>
  useAsyncMemo(
    () => (query.trim().length ? getMatchingLocation(query) : []),
    [query]
  );
