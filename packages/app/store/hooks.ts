import * as React from "react";
import type { State, Store } from "./store";

export const useValue = <T>(store: Store, selector: (s: State) => T) => {
  const ref = React.useRef<{ value: T; selector: (s: State) => T }>(undefined);

  if (ref.current?.selector !== selector) {
    ref.current = { selector, value: selector(store.getState()) };
  }

  const [, refresh] = React.useReducer((x) => x + 1, 0);

  React.useEffect(
    () =>
      store.subscribe(() => {
        const r = ref.current!;
        const nextValue = r.selector(store.getState());
        if (!Object.is(nextValue, r.value)) {
          r.value = nextValue;
          refresh();
        }
      }),
    [store]
  );

  return ref.current!.value;
};
