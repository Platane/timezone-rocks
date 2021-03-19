import { styled } from "@linaria/react";
import { useState } from "react";
import { Label } from "./Label";
import { getDate } from "../../timezone";
import { AWAKE_HOURS, DAY_HOURS, getInterval, OFFICE_HOURS } from "./interval";
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

        const o = getInterval(l.timezone, OFFICE_HOURS, date).map(
          toScreenSpace
        );
        const a = getInterval(l.timezone, AWAKE_HOURS, date).map(toScreenSpace);
        const d = getInterval(l.timezone, DAY_HOURS, date).map(toScreenSpace);

        return (
          <Row key={l.key} onClick={() => onSelectLocation?.(l)}>
            <DayBlock
              style={{
                left: d[0] - 5 + "px",
                right: d[1] + 5 + "px",
                width: d[1] - d[0] + "px",
              }}
            />
            <AwakeBlock
              style={{
                left: a[0] + "px",
                right: a[1] + "px",
                width: a[1] - a[0] + "px",
              }}
            />
            <OfficeBlock
              style={{
                left: o[0] + "px",
                right: o[1] + "px",
                width: o[1] - o[0] + "px",
              }}
            />
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

const Row = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const Block = styled.div`
  position: absolute;
  border-radius: 4px;
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
