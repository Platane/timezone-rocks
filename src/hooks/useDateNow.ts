import { useEffect } from "react";
import { useForceUpdate } from "./useForceUpdate";

/**
 * force render every <delay> ms when running is true
 */
export const useDateNow = (running: boolean, delay = 200) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (!running) return;
    const timeout = setInterval(forceUpdate, delay);

    return () => clearInterval(timeout);
  }, [running, delay, forceUpdate]);

  return Date.now();
};
