import { styled } from "@linaria/react";
import React from "react";
import { useStore } from "../../store/store";
import { selectLocations, selectT, selectTWindow } from "../../store/selector";
import { useSubscribe } from "../../store/useSubscribe";
import { getBlocks } from "../../timezone/interval";
import { LocationLabel, update as updateLocationLabel } from "./LocationLabel";
import { FlyingLabel, update as updateFlyingLabel } from "./FlyingLabel";
import { useWidth } from "./useWidth";
import { DateSlider } from "./DateSlider";
import { accentColor } from "../theme";

export const Lines = () => {
  const locations = useStore(selectLocations);
  const tWindow = useStore(selectTWindow);
  const selectLocation = useStore((s) => s.selectLocation);
  const width = useWidth();

  const ref = React.useRef<HTMLElement | null>(null);

  const toScreenSpace = React.useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow, width]
  );

  const blocks = React.useMemo(
    () => locations.map((location) => getBlocks(location.timezone, tWindow)),
    [tWindow, locations]
  );

  useSubscribe(
    (t) => {
      const container = ref.current;

      if (!container) return;

      locations.forEach((location, i) => {
        const x = toScreenSpace(t);

        const cursorArm = container.children[0] as any;
        cursorArm.style.transform = `translateX(${x}px)`;

        const locationLabel = container.children[1 + i * 2];
        updateLocationLabel(locationLabel, { location, t });

        const row = container.children[2 + i * 2];

        const flyingLabel = row.children[0];
        (flyingLabel as any).style.transform = `translateX(${x + 2}px)`;
        updateFlyingLabel(flyingLabel, { location, t });

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
    <>
      <DateSlider />

      <Container ref={ref as any}>
        <CursorArm />

        {locations.map((location, i) => (
          <React.Fragment key={location.key}>
            <LocationLabel location={location} />

            <Row onClick={() => selectLocation(location)}>
              <FlyingLabel />

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
    </>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 220px;
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

  height: 30px;
  top: 1px;

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

export const CursorArm = styled.div`
  position: absolute;
  width: 2px;
  height: calc(100% + 14px);
  background-color: ${accentColor};
  left: -1px;
  top: -4px;
  z-index: 2;
  pointer-events: none;
`;
