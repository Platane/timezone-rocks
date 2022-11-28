import { styled } from "@linaria/react";
import React from "react";
import { Props } from "./type";

export const Laptop = (props: Props) => (
  <GroupJitter className={props.pose}>
    <GroupPosition className={props.pose}>
      <g transform="scale(3.5) translate( -80, -95 )">
        <path
          fill="#9baac6"
          d="m 96.481025,98.176181 20.597815,-4.669896 q -16.36939,-1.736845 -32.504065,0 L 58.963109,98.176181 H 96.481025 M 110.91405,93.942848 95.872483,96.720973 H 73.462275 l 13.348229,-2.434167 q 8.426979,-0.899583 24.103546,-0.343958 z"
        />
        <path
          fill="#3a5384"
          d="M 95.872483,96.720973 110.91405,93.942848 Q 95.237483,93.387223 86.810504,94.286806 l -13.348229,2.434167 h 22.410208 m 0.608542,8.810627 V 98.176181 H 58.963109 l 3.042708,4.643439 z"
        />
        <path
          fill="#5c78ad"
          d="m 96.481025,98.176181 v 7.355419 l 17.568335,-6.892398 3.02948,-5.132917 z"
        />
        <path
          fill="#45629a"
          d="m 88.9404,72.577744 q -18.966904,-1.913165 -37.517916,0 2.904267,9.589285 3.95552,26.590624 18.758959,1.609462 37.517917,0 Q 92.032511,86.015321 88.9404,72.577744 Z"
        />
        <path
          fill="#5c78ad"
          d="m 92.895921,99.168368 2.619375,-3.743854 Q 94.276352,77.444785 91.308421,68.952952 L 88.9404,72.577744 q 3.092111,13.437577 3.955521,26.590624 z"
        />
        <path
          fill="#9baac6"
          d="m 91.308421,68.952952 q -18.997083,-1.403377 -37.994167,0 l -1.89177,3.624792 q 18.551012,-1.913165 37.517916,0 z"
        />
      </g>
    </GroupPosition>
  </GroupJitter>
);

const GroupPosition = styled.g`
  /* display: none; */

  @keyframes disappear {
    0% {
      visibility: visible;
      opacity: 1;
    }

    100% {
      visibility: visible;
      opacity: 0;
    }
  }
  @keyframes appear {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  visibility: hidden;
  opacity: 0;
  animation: disappear 0.2s ease-out;
  transition: transform 0.3s ease-out;
  transform: translate(190px, 460px) scale(0.75) rotate(45deg);
  &.day {
    visibility: visible;
    opacity: 1;
    animation: appear 0.2s ease-in-out;
    display: block;
    transform: translate(190px, 320px);
  }
`;
const GroupJitter = styled.g`
  &.day {
    animation: day 300ms linear infinite;
  }

  @keyframes day {
    0% {
      transform: translate(0, 0);
    }
    70% {
      transform: translate(0, -2px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;
