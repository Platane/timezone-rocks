import { styled } from "@linaria/react";
import React, { useState } from "react";
import { Label } from "./Label";
import { getDate } from "../../timezone";
import { getBlocks } from "./interval";
import { useSlide } from "./useSlide";
import type { Location } from "../useLocationStore";

type Props = {
  list: Location[];
  onSelectLocation?: (l: Location) => void;
};

const n = 3;

export const Lines = ({ list, onSelectLocation }: Props) => {
  const [x, setX] = useState(Date.now());
  const [[a, b]] = useState([
    x - (n / 2) * 24 * 60 * 60 * 1000,
    x + (n / 2) * 24 * 60 * 60 * 1000,
  ]);

  const [width] = useState(window.innerWidth);

  const toScreenSpace = (t: number) => ((t - a) / (b - a)) * width;

  const bind = useSlide((x) => setX(a + (b - a) * x));

  return (
    <Container>
      <CursorContainer {...bind}>
        <Cursor style={{ transform: `translateX(${toScreenSpace(x)}px)` }} />
      </CursorContainer>

      {list.map((l) => {
        const date = getDate(l.timezone, x);

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

            <Label
              style={{ left: toScreenSpace(x) + 2 + "px" }}
              hour={date.hour}
              countryCode={l.countryCode}
            />
          </Row>
        );
      })}

      <CursorLine style={{ transform: `translateX(${toScreenSpace(x)}px)` }} />
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

const Row = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
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

const CursorContainer = styled.div`
  background-color: #ddd4;
  height: 24px;
  width: 100%;

  cursor: pointer;
`;

const Cursor = styled.div`
  position: absolute;
  width: 32px;
  height: 24px;
  border-radius: 2px;
  background-color: lightgreen;
  left: -${32 / 2}px;
  pointer-events: none;
`;

const CursorLine = styled.div`
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: lightgreen;
  left: -1px;
  top: 0;
  pointer-events: none;
`;
