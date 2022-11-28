import { getMatchingLocation } from "@tzr/location-index";
import { useAsyncMemo } from "../hooks/useAsyncMemo";

export const useSearchResults = (query = "") =>
  useAsyncMemo(
    () => (query.trim().length ? getMatchingLocation(query) : []),
    [query]
  );
