import { styled } from "@linaria/react";
import React from "react";
import { PointyHand } from "./PointyHand";
import { TeaCup } from "./TeaCup";
import { Props } from "./type";

export const HandLeft = (props: Props) => (
  <GroupJitter className={props.pose}>
    <GroupPosition className={props.pose}>
      {props.pose === "morning" && <TeaCup {...props} />}
      {(props.pose === "day" || props.pose === "afternoon") && (
        <PointyHand {...props} />
      )}
    </GroupPosition>
  </GroupJitter>
);

const GroupPosition = styled.g`
  transition: transform 0.5s ease-out;

  transform: translate(280px, 295px);

  &.night {
    transform: translate(368px, 156px) rotate(-40deg);
  }

  &.morning {
    transform: translate(280px, 301px);
  }

  &.day {
    transform: translate(320px, 235px) rotate(-70deg);
  }

  &.afternoon {
    transform: translate(390px, 260px) rotate(102deg) scale(1, 0.85);
  }
`;
const GroupJitter = styled.g`
  &.day {
    animation: day 300ms linear infinite;
  }
  &.afternoon {
    animation: afternoon 600ms linear infinite;
  }

  @keyframes day {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-25px, 66px);
    }

    100% {
      transform: translate(0, 0);
    }
  }
  @keyframes afternoon {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(15px, -66px);
    }

    100% {
      transform: translate(0, 0);
    }
  }
`;
