import { useEffect } from "react";
import { State, useStore } from "./store";

export const useSubscribe = <T>(
  listener: (t: T) => void,
  selector: (s: State) => T,
  dependencies: any[] = [],
  equalityFn?: any
) => {
  useEffect(() => {
    listener(selector(useStore.getState()));
    return useStore.subscribe(listener, selector, equalityFn);
  }, dependencies);
};
