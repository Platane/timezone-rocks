import { useCallback, useMemo, useRef } from "react";
import type { Location } from "../../../locations";
import { getDate } from "../../../timezone/timezone";
import { getPoseAtHour } from "../../Avatar/pose";
import { selectT } from "../../store/selector";
import { useStore } from "../../store/store";
import { formatTime } from "../../../intl-utils";
import { useSubscribe } from "../../store/useSubscribe";
import { Avatar } from "../../Avatar/Avatar";
import { getFlagEmoji } from "../../../emojiFlagSequence";
import ParkMiller from "park-miller";
import { styled } from "@linaria/react";

export const Label = ({ location }: { location: Location }) => {
  const hourLabelRef = useRef<HTMLDivElement | null>(null);
  const selectHour = useCallback(
    (s) => formatTime(getDate(location.timezone, selectT(s)).hour),
    [location.timezone]
  );
  useSubscribe((hour) => {
    if (hourLabelRef.current) hourLabelRef.current.innerText = hour;
  }, selectHour);

  const selectPose = useCallback(
    (s) => getPoseAtHour(getDate(location.timezone, selectT(s)).hour),
    [location.timezone]
  );
  const pose = useStore(selectPose);

  const colors = useMemo(() => {
    const pm = new ParkMiller(28113299 + location.key ** 7);
    pm.float();
    const h = pm.float() * 130 + 160;
    const s = pm.float() * 28 + 50;

    return {
      color: `hsl(${h},${s}%,45%)`,
      colorDark: `hsl(${h},${s - 5}%,38%)`,
    };
  }, [location.key]);

  return (
    <Container>
      <Avatar
        {...colors}
        pose={pose}
        style={{
          width: "80px",
          position: "absolute",
          left: "-18px",
          top: "-10px",
        }}
      />
      <LabelHour ref={hourLabelRef} />
      <LabelFlag>{getFlagEmoji(location.countryCode)}</LabelFlag>
    </Container>
  );
};

const getPseudoRandom = (x: number) => {
  const pm = new ParkMiller(x ** 7);
  for (let k = x % 10; k--; ) pm.float();
  return pm.float();
};

export const labelBox = {
  min: { x: -26, y: -24 },
  max: { x: 64, y: 28 },
};

const LabelHour = styled.div`
  position: absolute;

  color: #fff;
  font-family: monospace;
  font-size: 0.92em;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);

  left: 56px;
  top: 10px;
`;
const LabelFlag = styled.div`
  position: absolute;

  font-size: 20px;
  /* text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1); */

  left: 48px;
  bottom: 0px;
`;

const Container = styled.div`
  position: absolute;

  left: ${labelBox.min.x}px;
  top: ${labelBox.min.y}px;
  height: ${labelBox.max.y - labelBox.min.y}px;
  width: ${labelBox.max.x - labelBox.min.x}px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  /* box-shadow: 0 0 0 1px orange; */

  pointer-events: none;
  transition: opacity 200ms;
`;

// const style = {
//   position: "absolute",

//   left: `${labelBox.min.x}px`,
//   top: `${labelBox.min.y}px`,
//   height: `${labelBox.max.y - labelBox.min.y}px`,
//   width: `${labelBox.max.x - labelBox.min.x}px`,

//   color: "#fff",
//   fontFamily: "monospace",
//   fontSize: "0.92em",
//   textShadow: "0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1)",
//   //   boxShadow: "0 0 0 1px orange",
//   pointerEvents: "none",
//   transition: "opacity 200ms",
// };
