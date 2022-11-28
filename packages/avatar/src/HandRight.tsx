import { styled } from "@linaria/react";
import React from "react";
import { BeerHand } from "./BeerHand";
import { FistHand } from "./FistHand";
import { PointyHand } from "./PointyHand";
import { TeaCup } from "./TeaCup";
import { Props } from "./type";

export const HandRight = (props: Props) => (
  <GroupJitter className={props.pose}>
    <GroupPosition className={props.pose}>
      {props.pose === "morning" && <FistHand {...props} />}
      {props.pose === "afternoon" && <BeerHand {...props} />}
      {props.pose === "day" && (
        <g transform="scale(1,-1)">
          <PointyHand {...props} />
        </g>
      )}
    </GroupPosition>
  </GroupJitter>
);

const GroupPosition = styled.g`
  transition: transform 0.5s ease-out;

  transform: translate(130px, 270px);

  &.night {
    transform: translate(237px, 273px);
  }
  &.morning {
    transform: translate(130px, 270px);
  }
  &.day {
    transform: translate(120px, 270px) rotate(-108deg);
  }
  &.afternoon {
    transform: translate(150px, 160px) rotate(10deg);
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
    50% {
      transform: translate(-20px, -68px);
    }

    100% {
      transform: translate(0, 0);
    }
  }

  &.afternoon {
    animation: afternoon 1200ms linear infinite;
    /* transform: translate(0px, 0px) rotate(20deg); */
  }
  @keyframes afternoon {
    0% {
      transform: translate(0, 0);
    }
    16% {
      transform: translate(30px, -60px) rotate(13deg);
    }
    30% {
      transform: translate(-20px, 90px) rotate(-10deg);
    }
    /* 46% {
      transform: translate(30px, -60px) rotate(13deg);
    } */

    70% {
      transform: translate(-60px, 210px) rotate(-40deg);
    }
    76% {
      transform: translate(-60px, 210px) rotate(-40deg);
    }

    /* 70% {
      transform: translate(30px, -65px) rotate(13deg);
    }

    85% {
      transform: translate(0, 0);
    } */

    100% {
      transform: translate(0, 0);
    }
  }
`;
0;
