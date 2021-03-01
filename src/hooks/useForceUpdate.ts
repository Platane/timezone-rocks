import { useCallback, useState } from "react";

/**
 * force component to re-render
 * similar to React.Component.forceUpdate in hook form
 */
export const useForceUpdate = () => {
  const [, setK] = useState(1);
  return useCallback(() => setK((k) => k + 1), [setK]);
};
