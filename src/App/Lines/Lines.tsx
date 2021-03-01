import { styled } from "@linaria/react";
import { useState } from "react";
import type { Location } from "../useLocationStore";

type Props = {
  list: Location[];
};

export const Lines = ({ list }: Props) => {
  const [x, setX] = useState(Date.now());
  const [[a, b]] = useState([
    Date.now() - 2 * 24 * 60 * 60 * 1000,
    Date.now() + 2 * 24 * 60 * 60 * 1000,
  ]);

  const [width] = useState(window.innerWidth);

  return (
    <Container>
      <Cursor
        style={{ transform: `translateX(${((x - a) / (b - a)) * width}px)` }}
      />
    </Container>
  );
};

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
