import React from "react";

export const ShareIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 100 100" {...props}>
    <circle fill="currentColor" cx={25} cy={50} r={18} />
    <circle fill="currentColor" cx={100 - 25} cy={20} r={18} />
    <circle fill="currentColor" cx={100 - 25} cy={100 - 20} r={18} />
    <line
      x1={25}
      x2={100 - 25}
      y1={50}
      y2={20}
      stroke="currentColor"
      fill="none"
      strokeWidth={10}
    />
    <line
      x1={25}
      x2={100 - 25}
      y1={50}
      y2={100 - 20}
      stroke="currentColor"
      fill="none"
      strokeWidth={10}
    />
  </svg>
);
