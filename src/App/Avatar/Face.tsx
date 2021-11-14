import { styled } from "@linaria/react";
import React from "react";
import { Mouth } from "./Mouth";
import { Pillow } from "./Pillow";
import { Props } from "./type";

export const Face = (props: Props) => (
  <>
    <g transform="translate(280,200)">
      <GroupJitter className={props.pose}>
        <GroupPosition className={props.pose}>
          <GroupPillowPosition className={props.pose}>
            <Pillow {...props} />
          </GroupPillowPosition>

          <GroupFaceShape className={props.pose}>
            <path
              transform="matrix( 1.48944091796875, 0, 0, 1.48944091796875, -110,-110)"
              fill={props.color}
              stroke={"#333"}
              strokeWidth={2}
              d="M 117.55 22.45Q 107.9 28.35 102.3 35.3 97.95 40.7 79.05 35.9 72 34.05 65.65 31.5 59.65 29.05 58.4 27.6 57.55 26.6 55.8 22.1 53.45 16.05 52.25 13.45 46.65 1.7 38.85 0 32.05 4.05 26.25 12.45 20.55 20.7 17.95 29.95 16.6 34.8 8.9 53.05 1.55 73.3 0.05 93.1 -0.95 106.6 12.65 111.15 29.85 119.65 63.1 131.65 91.6 141.95 96.5 142.8 99.45 143.35 110.55 137.25 121.7 131 133.6 122.25 146.9 112.4 154.65 103.95 163.7 94 162.7 88.25 160.9 77.55 153 55.95 143.8 30.65 134.45 15.25 127 16.5 117.55 22.45 Z"
            />
          </GroupFaceShape>

          <Eye {...props} transform="translate(-60,-10)" side="eye-right" />
          <Eye
            {...props}
            transform="translate(40,12) scale(-1,1) rotate(-18)"
            side="eye-left"
          />
          <Mouth {...props} transform="translate(-24,52)" />
        </GroupPosition>
      </GroupJitter>
    </g>
  </>
);

const Eye = ({
  className,
  side,
  pose,
  transform,
  color,
  colorDark,
}: Props & { side: "eye-left" | "eye-right" }) => (
  <g transform={transform}>
    <circle cx={0} cy={0} r={26} fill="#E4E1C3" />

    <GroupCheek className={pose + " " + side}>
      <path
        transform="scale(1.4)"
        fill={color}
        // fill={"#333"}
        d="M1.4 5.85Q-4.6 4.5 -14.15 4.9Q-22.7 5.1 -28.9 8.15Q-28.05 16.25 -25.5 24.4Q-22.9 24.45 -21 23.9Q-18.2 23.35 -9.2 24.05Q-1.1 24.6 4.45 26.45Q4.95 26.55 5.5 26.8Q6.35 27.1 7.2 27.25Q8.3 27.55 9.25 27.6Q10.25 27.7 11.35 27.65Q11.6 27.15 11.95 26.6Q15.75 20.15 18.4 13.35Q16.85 12 14.45 10.75Q14.15 10.6 13.95 10.55Q12.5 9.75 11.1 9.1Q5.85 6.85 1.4 5.85Z"
      />
    </GroupCheek>

    <GroupBrow className={pose}>
      <path
        transform="scale(1.4)"
        fill={colorDark}
        d="M25.2 -16.55Q21.7516 -19.5021 15.1 -21.4Q8.4 -23.45 -2.7 -24.3Q-13.9543 -25.2996 -19.4 -23.45Q-24.8371 -21.6018 -25.1 -14.7Q-25.3629 -7.7484 -21 -6.85Q-16.5957 -5.9506 -13.3 -6.25Q-10 -6.45 0.25 -4.65Q10.55 -2.95 16.9 -0.2Q23.1482 2.5521 25.8 -0.55Q28.5049 -3.6564 28.55 -8.6Q28.6449 -13.5436 25.2 -16.55Z"
      />
    </GroupBrow>

    {/* <path
      stroke="#0c3f72"
      strokeWidth="3.54673"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
      d="m 85.600701,51.221414 q 11.656877,-8.165563 21.181869,4.315189"
    /> */}
  </g>
);

const GroupFaceShape = styled.g``;

const GroupPillowPosition = styled.g`
  visibility: hidden;
  opacity: 0;
  animation: disappear 0.2s ease-out;
  transition: transform 0.4s ease-out;
  transform: translate(-240px, 0) rotate(-45deg);
  &.night {
    visibility: visible;
    opacity: 1;
    animation: appear 0.4s ease-in-out;
    display: block;
    transform: translate(-118px, 0);
  }

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
`;

const GroupCheek = styled.g`
  transform: translate(0, 0);

  &.night {
    transform: translate(10px, -22px) scale(1, 1.5);
  }

  &.day {
    transform: translate(0, 24px) scale(1, 0.4);
  }

  &.afternoon {
    &.eye-right {
      transform: translate(5px, -10px) scale(1.05, 1.1);
    }
    &.eye-left {
      transform: translate(5px, -10px) scale(1.05, 1.1);
      animation: afternoon-left 2.6s linear infinite;
    }
  }

  &.morning {
    transform: translate(0, -5.5px);
    animation: morning 3.1s linear infinite;
  }

  @keyframes morning {
    0% {
      transform: translate(0, -5.5px);
    }
    36% {
      transform: translate(0, -5.5px);
    }
    40% {
      transform: translate(0, 5.5px);
    }
    60% {
      transform: translate(0, -5.5px);
    }
    100% {
      transform: translate(0, -5.5px);
    }
  }

  @keyframes afternoon-left {
    0% {
      transform: translate(0, 0);
    }
    70% {
      transform: translate(0, 0);
    }
    75% {
      transform: translate(5px, -10px) scale(1.05, 1.1);
    }
    77% {
      transform: translate(5px, -10px) scale(1.05, 1.1);
    }
    81% {
      transform: translate(0, -3px);
    }
    86% {
      transform: translate(0, -3px);
    }
    89% {
      transform: translate(5px, -10px) scale(1.05, 1.1);
    }
    92% {
      transform: translate(5px, -10px) scale(1.05, 1.1);
    }
    96% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  transition: transform 400ms linear;
`;

const GroupBrow = styled.g`
  transform: translate(0, 0);

  &.night {
    transform: translate(0, 5px);
  }

  &.day {
    transform: translate(0, -22px) scale(0.9, 0.7);
  }

  &.morning {
    transform: translate(0, 12.5px) scale(1.1, 1.15);
    animation: morning 3.1s linear infinite;
  }

  @keyframes morning {
    0% {
      transform: translate(0, 0);
    }
    36% {
      transform: translate(0, 12.5px) scale(1.1, 1.15);
    }
    40% {
      transform: translate(0, -8px) scale(1, 0.98);
    }
    43% {
      transform: translate(0, -8px) scale(1, 0.98);
    }
    49% {
      transform: translate(0, 5px);
    }
    52% {
      transform: translate(0, -4.5px);
    }
    55% {
      transform: translate(0, 3px);
    }
    58% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  transition: transform 300ms linear;
`;

const GroupPosition = styled.g`
  &.night {
    transform: translate(0, -30px) rotate(-75deg) scale(0.9, 1);
  }

  transition: transform 400ms linear;
`;
const GroupJitter = styled.g`
  &.day {
    animation: day 800ms linear infinite;
  }

  &.afternoon {
    animation: afternoon 800ms linear infinite;
  }

  &.night {
    animation: night 2.5s linear infinite;
    transform: translate(-118px, 0);
  }

  &.morning {
    animation: morning 3.1s linear infinite;
  }

  @keyframes morning {
    0% {
      transform: scale(1);
    }
    36% {
      transform: translate(-10px, 0) rotate(-9deg) skewX(9deg) scale(1, 0.95);
    }
    40% {
      transform: translate(2px, 0) rotate(2deg) skewX(-6deg) scale(1, 0.98);
    }
    45% {
      transform: translate(-2px, 0) rotate(-4deg) skewX(7deg) scale(1, 0.98);
    }
    49% {
      transform: translate(2px, 0) rotate(1deg) skewX(-4deg) scale(1, 0.99);
    }
    53% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes night {
    0% {
      transform: translate(0, 0);
    }
    35% {
      transform: translate(0, -10px);
    }
    42% {
      transform: translate(0, 0px);
    }
    48% {
      transform: translate(0, -3px);
    }
    55% {
      transform: translate(0, 0px);
    }
    100% {
      transform: translate(0, 0px);
    }
  }

  @keyframes day {
    0% {
      transform: translate(0, 0);
    }
    66% {
      transform: translate(0, -2px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes afternoon {
    0% {
      transform: translate(0, 0);
    }
    66% {
      transform: translate(0, -2px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;
