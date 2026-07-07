import React from "react";
import { getDate } from "../../../timezone/timezone";
import { useValue } from "../../../store/hooks";
import {
  subscribeToValue,
  type Pin,
  type State,
  type Store,
} from "../../../store/store";
import { formatTime } from "../../../intl/format";
import { Avatar as AnimatedAvatar } from "@tzr/avatar";
import { getFlagEmoji } from "../../../flags/emoji";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ILocation } from "@tzr/location-index";
import { getColors } from "./getColors";
import { getPoseAtHour } from "./avatarPose";
import s from "./Label.module.css";

export const Label = ({ store, pin }: { store: Store; pin: Pin }) => {
  const { location } = pin;
  const hourLabelRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    // diff on the formatted hour so the DOM only updates when it changes
    const selectHour = (s: State) =>
      formatTime(getDate(location.timezone, s.t).hour);
    const update = (hour: string) => {
      if (hourLabelRef.current) hourLabelRef.current.innerText = hour;
    };
    update(selectHour(store.getState()));
    return subscribeToValue(store, selectHour, update);
  }, [store, location.timezone]);

  return (
    <div className={s.container}>
      <Avatar store={store} location={location} />
      <div className={s.labelHour} ref={hourLabelRef} />
      <div className={s.labelFooter}>
        {pin.label && <span className={s.labelCustom}>{" " + pin.label}</span>}
        {location.countryCode && (
          <span className={s.labelFlag}>
            {getFlagEmoji(location.countryCode)}
          </span>
        )}
      </div>
    </div>
  );
};

const Avatar = ({ store, location }: { store: Store; location: ILocation }) => {
  const selectPose = React.useCallback(
    (s: State) => getPoseAtHour(getDate(location.timezone, s.t).hour),
    [location.timezone]
  );

  const { delay, colors } = React.useMemo(() => {
    const n = parseInt(location.key.replace(/\W/g, "").toLowerCase(), 36);
    const delay = ((n % 3) + 0.5) * 90;
    const colors = getColors(n);
    return { delay, colors };
  }, [location.key]);

  const pose = useDebouncedValue(useValue(store, selectPose), delay);

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

export const labelBox = {
  min: { x: -30, y: -24 },
  max: { x: 74, y: 32 },
};
