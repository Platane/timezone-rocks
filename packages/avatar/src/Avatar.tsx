import React from "react";
import { Face } from "./Face";
import { Props } from "./type";
import { Laptop } from "./Laptop";
import { HandLeft } from "./HandLeft";
import { HandRight } from "./HandRight";

export const Avatar = ({ className, style, ...props }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      style={style}
      viewBox="28 25 420 335"
      className={className}
      role="img"
      aria-label={`avatar in the pose ${props.pose}`}
    >
      {/* <rect
        x="28"
        y="25"
        width="420"
        height="335"
        fill="none"
        strokeWidth="10"
        stroke="yellow"
      /> */}

      {/* <circle cx={268} cy={200} r={150} fill="#999" />
      <circle cx={268} cy={200} r={138} fill="#ccc" /> */}

      <Face {...props} />
      <HandRight {...props} />
      <Laptop {...props} />
      <HandLeft {...props} />
    </svg>
  );
};
