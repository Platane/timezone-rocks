import { styled } from "@linaria/react";
import { useState } from "react";
import { getDate } from "../../timezone";
import type { Location } from "../useLocationStore";
import { AWAKE_HOURS, DAY_HOURS, getInterval, OFFICE_HOURS } from "./interval";

type Props = {
  list: Location[];
  onSelectLocation?: (l: Location) => void;
};

const n = 4;

export const Lines = ({ list, onSelectLocation }: Props) => {
  const [x, setX] = useState(Date.now());
  const [[a, b]] = useState([
    Date.now() - (n / 2) * 24 * 60 * 60 * 1000,
    Date.now() + (n / 2) * 24 * 60 * 60 * 1000,
  ]);

  const [width] = useState(window.innerWidth);

  const toScreenSpace = (t: number) => ((t - a) / (b - a)) * width;

  return (
    <Container>
      {list.map((l) => {
        console.log(l.timezone);

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
                left: d[0] + "px",
                right: d[1] + "px",
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
          </Row>
        );
      })}

      <Cursor style={{ transform: `translateX(${toScreenSpace(x)}px)` }} />
    </Container>
  );
};

const Row = styled.div`
  margin: 10px 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 40px;
`;

const Block = styled.div`
  position: absolute;
  border-radius: 4px;
  display: inline-block;
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
  background-color: #48ac55;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Cursor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background-color: lightgreen;
  position: absolute;
  top: -10px;
`;
