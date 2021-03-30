import { styled } from "@linaria/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStore } from "../store/store";
import { selectT } from "../store/selector";
import { useSubscribe } from "../store/useSubscribe";
import { getDate, getTimezoneOffset } from "../../timezone/timezone";
import { getBlocks } from "../../timezone/interval";
import { formatOffset, formatTime } from "../../intl-utils";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { CursorArm, CursorLine } from "./Cursor";
import { getActivity } from "../Avatar/activity";
import { LocationLabel } from "./LocationLabel";

export const Lines = () => {
  const locations = useStore((s) => s.locations);
  const tWindow = useStore((s) => s.tWindow);

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setWidth]);

  const ref = useRef<HTMLElement | null>(null);

  const toScreenSpace = useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow, width]
  );

  const blocks = useMemo(
    () => locations.map((location) => getBlocks(location.timezone, tWindow)),
    [tWindow, locations]
  );

  useSubscribe(
    (t) => {
      const container = ref.current;

      if (!container) return;

      locations.forEach((location, i) => {
        const date = getDate(location.timezone, t);

        const x = toScreenSpace(t);

        (container.children[0]
          .children[0] as any).style.transform = `translateX(${x}px)`;
        (container.children[1] as any).style.transform = `translateX(${x}px)`;

        const locationLabel = container.children[2 + i * 2];
        locationLabel.children[2].innerHTML = formatOffset(
          getTimezoneOffset(location.timezone, t)
        );

        const row = container.children[3 + i * 2];

        const flyingLabel = row.children[0];
        flyingLabel.children[0].innerHTML = getActivity(date.hour);
        flyingLabel.children[2].innerHTML = formatTime(date.hour);

        (flyingLabel as any).style.transform = `translateX(${x + 2}px)`;

        for (let j = 0; j < blocks[i].length; j++) {
          const primary = blocks[i][j].day[0] <= t && t <= blocks[i][j].day[1];

          for (let k = 3; k--; )
            row.children[1 + j * 3 + k].classList[primary ? "add" : "remove"](
              "primary"
            );
        }
      });
    },
    selectT,
    [locations, toScreenSpace, blocks]
  );

  return (
    <Container ref={ref as any}>
      <CursorLine />
      <CursorArm />

      {locations.map((location, i) => (
        <React.Fragment key={location.key}>
          <LocationLabel location={location} />

          <Row>
            <FlyingLabel>
              <Avatar></Avatar>
              <Flag>{getFlagEmoji(location.countryCode)}</Flag>
              <HourLabel></HourLabel>
            </FlyingLabel>

            {blocks[i].map(({ day, awake, office }, i) => (
              <React.Fragment key={i}>
                <DayBlock style={toPosition(toScreenSpace, day, 2)} />
                <AwakeBlock style={toPosition(toScreenSpace, awake)} />
                <OfficeBlock style={toPosition(toScreenSpace, office)} />
              </React.Fragment>
            ))}
          </Row>
        </React.Fragment>
      ))}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 200px;
  padding-bottom: 24px;
`;

const toPosition = (
  toScreenSpace: (x: number) => number,
  [a, b]: [number, number],
  margin = 0
) => {
  const sa = toScreenSpace(a) + margin;
  const sb = toScreenSpace(b) - margin;

  return { left: sa + "px", right: sb + "px", width: sb - sa + "px" };
};

const Row = styled.div`
  height: 32px;
  overflow: hidden;
  position: relative;
`;

const Block = styled.div`
  position: absolute;
  border-radius: 4px;
  transition: filter 100ms;
`;

const DayBlock = styled(Block)`
  height: 24px;
  top: 4px;
  background-color: #aaa6;
  margin-bottom: 4px;
`;
const AwakeBlock = styled(Block)`
  height: 30px;
  top: 1px;
  transition: background-color 200ms;
  background-color: #8e928b;
  &.primary {
    background-color: #86a45d;
    /* box-shadow: 0 0 0 1px orange; */
  }
`;
const OfficeBlock = styled(Block)`
  height: 30px;
  top: 1px;
  border-radius: 0px;
  transition: background-color 200ms;
  background-color: #848881;
  &.primary {
    background-color: #7d9c56;
  }
`;

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
  left: 0;
  font-size: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  height: 100%;
`;

const HourLabel = styled.div`
  font-size: 1.4em;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);
`;
