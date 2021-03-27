import { styled } from "@linaria/react";
import React, { useState } from "react";
import { Label as FlyingLabel } from "./Label";
import { getDate, getTimezoneOffset } from "../../timezone";
import { getBlocks } from "./interval";
import { useStore } from "../store/store";
import type { Location } from "../../locations";
import { CursorArm, CursorLine } from "./Cursor";
import { getFlagEmoji } from "../../emojiFlagSequence";

type Props = {
  onSelectLocation?: (l: Location) => void;
};

export const Lines = ({ onSelectLocation }: Props) => {
  const { t } = useStore();
  // const t = Date.now();
  const removeLocation = useStore((s) => s.removeLocation);

  const locations = useStore((s) => s.locations);
  const [a, b] = useStore((s) => s.tWindow);

  const [width] = useState(window.innerWidth);

  const toScreenSpace = (t: number) => ((t - a) / (b - a)) * width;

  return (
    <Container>
      <CursorLine />

      {locations.map((l) => {
        const date = getDate(l.timezone, t);

        const blocks = getBlocks(l.timezone, date, [a, b]);

        return (
          <Row key={l.key} onClick={() => onSelectLocation?.(l)}>
            {blocks.map(({ day, awake, office, primary }, i) => (
              <React.Fragment key={i}>
                <DayBlock
                  style={toPosition(toScreenSpace, day, 2)}
                  primary={primary}
                />
                <AwakeBlock
                  style={toPosition(toScreenSpace, awake)}
                  primary={primary}
                />
                <OfficeBlock
                  style={toPosition(toScreenSpace, office)}
                  primary={primary}
                />
              </React.Fragment>
            ))}

            <LocationLabel>
              <div>
                {getFlagEmoji(l.countryCode)}
                {l.name}
              </div>
              <OffsetLabel>
                {formatOffset(getTimezoneOffset(l.timezone, t))}
              </OffsetLabel>

              <RemoveButton
                onClick={(e) => {
                  e.preventDefault();
                  removeLocation(l);
                }}
              >
                ×
              </RemoveButton>
            </LocationLabel>

            <FlyingLabel
              style={{ left: toScreenSpace(t) + 2 + "px" }}
              hour={date.hour}
              countryCode={l.countryCode}
            />
          </Row>
        );
      })}

      <CursorArm />
    </Container>
  );
};

const formatOffset = (minute: number) => {
  const sign = minute > 0;
  const hour = 0 | (Math.abs(minute) / 60);
  const min = 0 | Math.abs(minute) % 60;

  return (
    "GMT " +
    ((sign ? "+" : "-") + hour).padStart(3, " ") +
    ":" +
    min.toString().padStart(2, "0")
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

const Row = styled.div`
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

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const OffsetLabel = styled.span`
  font-family: monospace;
  font-size: 0.9em;
  margin-left: auto;
`;
const LocationLabel = styled.div`
  width: 180px;
  left: 0;
  position: absolute;
  background-color: #203b53;
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
`;
