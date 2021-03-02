import { styled } from "@linaria/react";
import { useState } from "react";
import type { Location } from "../useLocationStore";

type Props = {
  list: Location[];
};

const n = 4;

export const Lines = ({ list }: Props) => {
  const [x, setX] = useState(Date.now());
  const [[a, b]] = useState([
    Date.now() - (n / 2) * 24 * 60 * 60 * 1000,
    Date.now() + (n / 2) * 24 * 60 * 60 * 1000,
  ]);

  const [width] = useState(window.innerWidth);

  return (
    <Container>
      <Cursor
        style={{ transform: `translateX(${((x - a) / (b - a)) * width}px)` }}
      />

      {list.map((l) => {
        return (
          <Row key={l.key}>
            {Array.from({ length: n + 2 }, (_, i) => (
              <Block key={i} />
            ))}
          </Row>
        );
      })}
    </Container>
  );
};

const Row = styled.div`
  margin: 10px 0;
  overflow: hidden;
  display: flex;
`;

const Block = styled.div`
  background-color: #ddd;
  border-radius: 4px;
  width: ${100 / n}%;
  height: 40px;
  display: inline-block;
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
