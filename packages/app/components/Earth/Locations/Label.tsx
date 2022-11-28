import React from "react";
import { getDate } from "../../../timezone/timezone";
import { selectT, selectUseCheapAvatar } from "../../../store/selector";
import { State, useStore } from "../../../store/store";
import { useSubscribe } from "../../../store/useSubscribe";
import { formatTime } from "../../../intl/format";
import { Avatar as AnimatedAvatar } from "@tzr/avatar";
import { getFlagEmoji } from "../../../flags/emoji";
import ParkMiller from "park-miller";
import { styled } from "@linaria/react";
import { CheapAvatar } from "../../CheapAvatar";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ILocation } from "@tzr/location-index";
import { getPoseAtHour } from "./avatarPose";

export const Label = ({ location }: { location: ILocation }) => {
  const hourLabelRef = React.useRef<HTMLDivElement | null>(null);
  const selectHour = React.useCallback(
    (s: State) => formatTime(getDate(location.timezone, selectT(s)).hour),
    [location.timezone]
  );
  useSubscribe((hour) => {
    if (hourLabelRef.current) hourLabelRef.current.innerText = hour;
  }, selectHour);

  return (
    <Container>
      <Avatar location={location} />
      <LabelHour ref={hourLabelRef} />
      <LabelFlag>{getFlagEmoji(location.countryCode)}</LabelFlag>
    </Container>
  );
};

const Avatar = ({ location }: { location: ILocation }) => {
  const selectPose = React.useCallback(
    (s: State) => getPoseAtHour(getDate(location.timezone, selectT(s)).hour),
    [location.timezone]
  );

  const n = React.useMemo(
    () => parseInt(location.key.replace(/\W/g, "").toLowerCase(), 36),
    [location.key]
  );
  const delay = ((n % 3) + 0.5) * 90;

  const pose = useDebouncedValue(useStore(selectPose), delay);

  const colors = React.useMemo(() => getColors(n), [location.key]);

  if (useStore(selectUseCheapAvatar))
    return (
      <CheapAvatar
        pose={pose}
        style={{
          fontSize: "32px",
          position: "absolute",
          left: "5px",
          top: "5px",
        }}
      />
    );

  return (
    <AnimatedAvatar
      {...colors}
      pose={pose}
      style={{
        width: "90px",
        position: "absolute",
        left: "-18px",
        top: "-10px",
      }}
    />
  );
};

const getColors = (seed: number) => {
  const pm = new ParkMiller(28113299 + seed ** 7 + seed);
  pm.float();
  pm.float();
  pm.float();
  pm.float();
  const h = pm.float() * 130 + 160;
  const s = pm.float() * 28 + 50;

  return {
    color: `hsl(${h},${s}%,56%)`,
    colorDark: `hsl(${h - 3},${s - 9}%,38%)`,
  };
};

export const labelBox = {
  min: { x: -30, y: -24 },
  max: { x: 74, y: 32 },
};

const LabelHour = styled.div`
  position: absolute;

  color: #fff;
  font-family: monospace;
  font-size: 0.92em;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);

  right: 6px;
  top: 10px;
`;
const LabelFlag = styled.div`
  position: absolute;

  font-size: 22px;
  /* text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1); */

  right: 14px;
  bottom: 0px;
`;

const Container = styled.div`
  position: absolute;

  left: ${labelBox.min.x}px;
  top: ${labelBox.min.y}px;
  height: ${labelBox.max.y - labelBox.min.y}px;
  width: ${labelBox.max.x - labelBox.min.x}px;

  /* opacity: 0.2; */
  /* box-shadow: 0 0 0 1px orange; */

  pointer-events: none;
  transition: opacity 200ms;

  & > * {
    @keyframes appear {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    animation: appear 200ms ease-out;
  }
`;
