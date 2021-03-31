import { styled } from "@linaria/react";
import React from "react";
import { getDate } from "../../timezone/timezone";
import { formatDateTime, formatTime } from "../../intl-utils";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { getActivity } from "../Avatar/activity";
import { Location } from "../../locations";

type Props = { location: Location };
export const FlyingLabel = ({ location }: Props) => (
  <Container>
    <HourLabel></HourLabel>
  </Container>
);

export const update = (
  domElement: Element,
  { location, t }: Props & { t: number }
) => {
  domElement.children[0].innerHTML = formatDateTime(
    getDate(location.timezone, t)
  );
};

const Avatar = styled.div`
  width: 26px;
  font-size: 20px;
  margin-right: 4px;
`;

const Flag = styled.div`
  font-size: 12px;
  position: absolute;
  left: 16px;
  top: 14px;
`;

const Container = styled.div`
  white-space: nowrap;
  position: absolute;
  left: 0;
  font-size: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  height: 100%;
  pointer-events: none;
`;

const HourLabel = styled.div`
  font-size: 1.4em;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);
`;
