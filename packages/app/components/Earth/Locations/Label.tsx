import React from "react";
import { getDate } from "../../../timezone/timezone";
import {
  subscribeToValue,
  type Pin,
  type State,
  type Store,
} from "../../../store/store";
import { formatTime } from "../../../intl/format";
import { Avatar as AnimatedAvatar } from "@tzr/avatar";
import { getFlagEmoji } from "../../../flags/emoji";
import { ILocation } from "@tzr/location-index";
import { getColors } from "./getColors";
import { getPoseAtHour } from "./avatarPose";
import s from "./Label.module.css";

export const Label = ({ store, pin }: { store: Store; pin: Pin }) => {
  const { location } = pin;
  const hourLabelRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    // diff on the formatted hour so the DOM only updates when it changes
    const selectHour = (s: State) =>
      formatTime(getDate(location.timezone, s.t).hour);
    const updateHour = (hour: string) => {
      if (hourLabelRef.current) hourLabelRef.current.innerText = hour;
    };
    updateHour(selectHour(store.getState()));
    const unsubscribeHour = subscribeToValue(store, selectHour, updateHour);

    // update avatar pose
    const delay = Math.floor(Math.random() * 4) * 100;
    let poseTimeout: number | NodeJS.Timeout;
    const selectPose = (s: State) =>
      getPoseAtHour(getDate(location.timezone, s.t).hour);
    const updatePose = () => {
      const pose = selectPose(store.getState());
      const svg = containerRef.current?.querySelector("svg");
      svg?.setAttribute("data-avatar-pose", pose);
    };
    updatePose();
    const unsubscribePose = subscribeToValue(store, selectPose, () => {
      clearTimeout(poseTimeout);
      poseTimeout = setTimeout(updatePose, delay);
    });

    return () => {
      clearTimeout(poseTimeout);
      unsubscribeHour();
      unsubscribePose();
    };
  }, [store, location.timezone]);

  return (
    <div className={s.container} ref={containerRef}>
      <Avatar location={location} />
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

const Avatar = ({ location }: { location: ILocation }) => {
  const { colors } = React.useMemo(() => {
    const n = parseInt(location.key.replace(/\W/g, "").toLowerCase(), 36);
    const colors = getColors(n);
    return { colors };
  }, [location.key]);

  return (
    <AnimatedAvatar
      {...colors}
      pose="morning"
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
