import { useLayoutEffect, useRef, useState } from "react";

/**
 * same as useMemo, but the handler is asynchronous
 * returns null while the handler is pending
 */
export const useAsyncMemo = <T, D>(
  transform: (signal: AbortSignal) => T | Promise<T>,
  dependencies: D[]
) => {
  const [result, setResult] = useState<{
    output?: T;
    error?: Error;
    dependencies: D[];
  }>();

  const transformRef = useRef(transform);
  transformRef.current = transform;

  useLayoutEffect(() => {
    const abortController = new AbortController();

    Promise.resolve(abortController.signal)
      .then(transform)
      .then((output) => {
        if (!abortController.signal.aborted)
          setResult({ output, dependencies });
      })
      .catch((error) => {
        if (!abortController.signal.aborted) setResult({ error, dependencies });
      });

    return () => abortController.abort();
  }, dependencies);

  const res =
    result && arrayEquals(result.dependencies, dependencies) ? result : null;

  if (res?.error) throw res.error;

  return res?.output ?? null;
};

const arrayEquals = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((_, i) => a[i] === b[i]);
