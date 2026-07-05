export const createSubscribable = () => {
  const listeners = new Set<() => void>();
  const subscribe = (h: () => void) => {
    listeners.add(h);
    return () => {
      listeners.delete(h);
    };
  };
  const dispatch = () => {
    for (const l of listeners) l();
  };

  return { subscribe, dispatch };
};

export type Subscribable = ReturnType<typeof createSubscribable>;
