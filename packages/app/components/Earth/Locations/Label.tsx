import React from "react";
import { getDate } from "../../../timezone/timezone";
import { selectT, selectUseCheapAvatar } from "../../../store/selector";
import { State, useStore } from "../../../store/store";
import { useSubscribe } from "../../../store/useSubscribe";
import { formatTime } from "../../../intl/format";
import { Avatar as AnimatedAvatar } from "@tzr/avatar";
import { getFlagEmoji } from "../../../flags/emoji";
import ParkMiller from "park-miller";
import { CheapAvatar } from "../../CheapAvatar";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ILocation } from "@tzr/location-index";
import { getPoseAtHour } from "./avatarPose";
import s from "./Label.module.css";

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
    <div className={s.container}>
      <Avatar location={location} />
      <div className={s.labelHour} ref={hourLabelRef} />
      {location.countryCode && (
        <div className={s.labelFlag}>{getFlagEmoji(location.countryCode)}</div>
      )}
    </div>
  );
};

const Avatar = ({ location }: { location: ILocation }) => {
  const selectPose = React.useCallback(
    (s: State) => getPoseAtHour(getDate(location.timezone, selectT(s)).hour),
    [location.timezone]
  );

  const { delay, colors } = React.useMemo(() => {
    const n = parseInt(location.key.replace(/\W/g, "").toLowerCase(), 36);
    const delay = ((n % 3) + 0.5) * 90;
    const colors = getColors(n);
    return { delay, colors };
  }, [location.key]);

  const pose = useDebouncedValue(useStore(selectPose), delay);

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

export const getColors = (seed: number) => {
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
