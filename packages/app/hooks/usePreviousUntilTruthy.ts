import React from "react";

export const usePreviousUntilTruthy = <T>(
  x: T,
  initialValue?: T | undefined
) => {
  const ref = React.useRef(x || initialValue);

  if (x) ref.current = x;

  return ref.current;
};
