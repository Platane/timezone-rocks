import { styled } from "@linaria/react";
import React, { useCallback, useMemo, useRef } from "react";
import { useSlide } from "./useSlide";
import { useStore } from "../store/store";
import { useWidth } from "./useWidth";
import { selectT, selectTWindow } from "../store/selector";
import { useSubscribe } from "../store/useSubscribe";
import { formatDate } from "../../intl-utils";
import { getDate } from "../../timezone/timezone";
import { getDays } from "../../timezone/interval";

const setT = (x: number) => {
  const {
    setT,
    tWindow: [a, b],
  } = useStore.getState();
  const t = a + (b - a) * x;
  setT(t);
};
const setRoundedT = (x: number) => {
  const r = 15 * 60 * 1000;
  const {
    setT,
    tWindow: [a, b],
  } = useStore.getState();
  const t = a + (b - a) * x;
  setT(Math.round(t / r) * r);
};
const resetT = () => {
  const { setT, now } = useStore.getState();
  setT(now);
};

export const DateSlider = () => {
  const tWindow = useStore(selectTWindow);
  const now = useStore((s) => s.now);
  const width = useWidth();

  const ref = useRef<HTMLDivElement | null>(null);

  const toScreenSpace = useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow, width]
  );

  useSubscribe(
    (t) => {
      const container = ref.current;
      if (!container) return;
      container.style.transform = `translateX(${toScreenSpace(t)}px)`;
    },
    selectT,
    [toScreenSpace, width]
  );

  const bind = useSlide(setT, setRoundedT);

  return (
    <Container>
      <CursorContainer {...bind}>
        <NowButton
          title="Reset to now"
          onClick={resetT}
          style={{
            transform: `translateX(${toScreenSpace(now)}px) rotate(45deg)`,
          }}
        />

        <Caret ref={ref}>
          <Cursor />
        </Caret>
      </CursorContainer>
    </Container>
  );
};

const CursorContainer = styled.div`
  background-color: #ddd4;
  height: 24px;
  width: 100%;
  cursor: pointer;
  user-select: none;
`;

const Container = styled.div`
  overflow: hidden;
  position: relative;
  padding-top: 22px;
  padding-bottom: 0px;
  width: 100%;
`;
const Caret = styled.div`
  left: -${32 / 2}px;
  position: absolute;
`;

const Cursor = styled.div`
  width: 32px;
  height: 24px;
  border-radius: 2px;
  background-color: #e88a28;
  pointer-events: none;
  display: inline-block;
`;

const NowButton = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 8px 6px 2px 6px;
  left: -${16 / 2}px;
  top: 0px;
  background-color: #e88a28;
  position: absolute;
`;
