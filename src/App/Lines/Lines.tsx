import { styled } from "@linaria/react";
import React, { useCallback, useRef, useState } from "react";
import { useStore } from "../store/store";
import type { Location } from "../../locations";
import { CursorArm, CursorLine } from "./Cursor";
import { getActivity, Line } from "./Line";
import { useSubscribe } from "../store/useSubscribe";
import { getDate, getTimezoneOffset } from "../../timezone";
import { formatOffset, formatTime } from "../../intl-utils";
import { selectT } from "../store/selector";

type Props = {
  onSelectLocation?: (l: Location) => void;
};

export const Lines = ({ onSelectLocation }: Props) => {
  const locations = useStore((s) => s.locations);

  const tWindow = useStore((s) => s.tWindow);
  const [width] = useState(window.innerWidth);

  const ref = useRef<HTMLElement | null>(null);

  const toScreenSpace = useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow, width]
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

        const line = container.children[2 + i];

        line.children[0].children[1].innerHTML = formatOffset(
          getTimezoneOffset(location.timezone, t)
        );

        line.children[1].children[0].innerHTML = getActivity(date.hour);
        line.children[1].children[2].innerHTML = formatTime(date.hour);

        (line.children[1] as any).style.transform = `translateX(${x + 2}px)`;
      });
    },
    selectT,
    [locations, toScreenSpace]
  );

  return (
    <Container ref={ref as any}>
      <CursorLine />
      <CursorArm />

      {locations.map((location) => (
        <Line key={location.key} location={location} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;
