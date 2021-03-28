import { styled } from "@linaria/react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { getDate, getTimezoneOffset } from "../../timezone";
import { AWAKE_HOURS, getBlocks, OFFICE_HOURS } from "./interval";
import { useStore } from "../store/store";
import type { Location } from "../../locations";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { useSubscribe } from "../store/useSubscribe";
import { selectT } from "../store/selector";
import { formatOffset, formatTime } from "../../intl-utils";

type Props = {
  location: Location;
};

export const Line = ({ location }: Props) => {
  const removeLocation = useStore((s) => s.removeLocation);
  const tWindow = useStore((s) => s.tWindow);
  const blocks = useMemo(() => getBlocks(location.timezone, tWindow), [
    tWindow,
    location.timezone,
  ]);
  const [width] = useState(window.innerWidth);

  const flyingLabelRef = useRef<HTMLElement | null>(null);
  const nameLabelRef = useRef<HTMLElement | null>(null);

  const toScreenSpace = useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow, width]
  );

  useSubscribe(
    (t) => {
      const date = getDate(location.timezone, t);

      if (nameLabelRef.current)
        nameLabelRef.current.children[1].innerHTML = formatOffset(
          getTimezoneOffset(location.timezone, t)
        );

      if (flyingLabelRef.current) {
        flyingLabelRef.current.style.left = toScreenSpace(t) + 2 + "px";

        flyingLabelRef.current.children[0].innerHTML = getActivity(date.hour);
        flyingLabelRef.current.children[1].innerHTML = formatTime(date.hour);
      }
    },
    selectT,
    [location.timezone, toScreenSpace]
  );

  return (
    <Container>
      {blocks.map(({ day, awake, office }, i) => (
        <React.Fragment key={i}>
          <DayBlock style={toPosition(toScreenSpace, day, 2)} />
          <AwakeBlock style={toPosition(toScreenSpace, awake)} />
          <OfficeBlock style={toPosition(toScreenSpace, office)} />
        </React.Fragment>
      ))}

      <NameLabel ref={nameLabelRef as any}>
        <div>
          {getFlagEmoji(location.countryCode)}
          {location.name}
        </div>
        <OffsetLabel></OffsetLabel>

        <RemoveButton
          href="#"
          title="remove location"
          onClick={(e) => {
            e.preventDefault();
            removeLocation(location);
          }}
        >
          ×
        </RemoveButton>
      </NameLabel>

      <FlyingLabel ref={flyingLabelRef as any}>
        <Avatar></Avatar>
        <Flag>{getFlagEmoji(location.countryCode)}</Flag>
        <span></span>
      </FlyingLabel>
    </Container>
  );
};

const toPosition = (
  toScreenSpace: (x: number) => number,
  [a, b]: [number, number],
  margin = 0
) => {
  const sa = toScreenSpace(a) + margin;
  const sb = toScreenSpace(b) - margin;

  return { left: sa + "px", right: sb + "px", width: sb - sa + "px" };
};

const Container = styled.div`
  height: 50px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Block = styled.div<{ primary?: boolean }>`
  position: absolute;
  border-radius: 4px;
  filter: ${(props) => (props.primary ? "" : " grayscale(0.9) brightness(1)")};
  transition: filter 100ms;
`;

const DayBlock = styled(Block)`
  height: 20px;
  background-color: #ddd6;
`;
const AwakeBlock = styled(Block)`
  height: 30px;
  background-color: #b6cf5a;
`;
const OfficeBlock = styled(Block)`
  height: 30px;
  border-radius: 0px;
  background-color: #48ac55;
`;

const OffsetLabel = styled.span`
  font-family: monospace;
  font-size: 0.9em;
  margin-left: auto;
`;
const NameLabel = styled.div`
  width: 180px;
  left: 0;
  position: absolute;
  /* background-color: #203b53; */
  z-index: 1;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 14px 0 10px;
`;

const RemoveButton = styled.a`
  display: block;
  position: absolute;
  right: 2px;
  top: 0px;
  color: #fff;
  text-decoration: none;
`;

export const getActivity = (hour: number) =>
  (hour < AWAKE_HOURS[0] && "😴") ||
  (hour < OFFICE_HOURS[0] && `☕️`) ||
  (hour < OFFICE_HOURS[1] && `👨‍💻`) ||
  (hour < AWAKE_HOURS[1] && "🍻") ||
  "😴";

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

const FlyingLabel = styled.div`
  white-space: nowrap;
  position: absolute;
  font-family: monospace;
  font-size: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
