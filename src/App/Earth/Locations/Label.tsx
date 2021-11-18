import { labelBox } from "./useLabelElements";
import type { Location } from "../../../locations";
import { useCallback, useRef } from "react";
import { getDate } from "../../../timezone/timezone";
import { getPoseAtHour } from "../../Avatar/pose";
import { selectT } from "../../store/selector";
import { useStore } from "../../store/store";
import { formatTime } from "../../../intl-utils";
import { useSubscribe } from "../../store/useSubscribe";
import { Avatar } from "../../Avatar/Avatar";

export const Label = ({ location }: { location: Location }) => {
  const selectPose = useCallback(
    (s) => getPoseAtHour(getDate(location.timezone, selectT(s)).hour),
    [location.timezone]
  );
  const selectHour = useCallback(
    (s) => formatTime(getDate(location.timezone, selectT(s)).hour),
    [location.timezone]
  );
  const pose = useStore(selectPose);

  const hourLabelRef = useRef<HTMLElement | null>(null);
  useSubscribe((hour) => {
    if (hourLabelRef.current) hourLabelRef.current.innerText = hour;
  }, selectHour);

  return (
    <div style={style as any}>
      <Avatar
        color="#cc00b1"
        colorDark="#a81094"
        pose={pose}
        style={{ width: "200px", height: "200px" }}
      />
      <span ref={hourLabelRef} />
    </div>
  );
};

const style = {
  position: "absolute",

  left: `${labelBox.min.x}px`,
  top: `${labelBox.min.y}px`,
  height: `${labelBox.max.y - labelBox.min.y}px`,
  width: `${labelBox.max.x - labelBox.min.x}px`,

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  color: "#fff",
  fontFamily: "monospace",
  fontSize: "0.92em",
  textShadow: "0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1)",
  boxShadow: "0 0 0 1px orange",
  pointerEvents: "none",
  transition: "opacity 200ms",
};
