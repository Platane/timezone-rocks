import { styled } from "@linaria/react";
import React from "react";
import { useStore } from "../store/store";
import type { Location } from "../../locations";
import { CursorArm, CursorLine } from "./Cursor";
import { Line } from "./Line";

type Props = {
  onSelectLocation?: (l: Location) => void;
};

export const Lines = ({ onSelectLocation }: Props) => {
  const locations = useStore((s) => s.locations);

  return (
    <Container>
      <CursorLine />

      {locations.map((location) => (
        <Line key={location.key} location={location} />
      ))}

      <CursorArm />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;
