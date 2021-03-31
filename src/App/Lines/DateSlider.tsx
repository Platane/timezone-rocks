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
  const r = 5 * 60 * 1000;
  const {
    setT,
    tWindow: [a, b],
  } = useStore.getState();
  const t = a + (b - a) * x;
  setT(Math.floor(t / r) * r);
};
const resetT = () => {
  const { setT, now } = useStore.getState();
  setT(now);
};

export const DateSlider = () => {
  const tWindow = useStore(selectTWindow);
  const now = useStore((s) => s.now);
  const location = useStore((s) => s.selectedLocation);
  const width = useWidth();

  const days = useMemo(() => {
    if (!location) return [];
    return getDays(location.timezone, tWindow).map(([_, a]) => a);
  }, []);

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

      if (location)
        container.children[1].innerHTML = formatDate(
          getDate(location.timezone, t)
        );
    },
    selectT,
    [toScreenSpace, width, location]
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

        {location &&
          days.map((a) => (
            <DayTick
              key={a}
              style={{
                transform: `translateX(${toScreenSpace(a)}px)`,
              }}
            />
          ))}

        <Caret ref={ref}>
          <Cursor />

          {location && <DateLabel />}
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
  width: 100%;
  left: -${32 / 2}px;
  position: absolute;
`;
const DateLabel = styled.div`
  display: inline-block;
  margin-left: 10px;
  height: 24px;
  vertical-align: middle;
  color: orange;
  text-shadow: 0 0 4px #000a;
`;

const Cursor = styled.div`
  width: 32px;
  height: 24px;
  border-radius: 2px;
  background-color: #e88a28;
  pointer-events: none;
  display: inline-block;
`;

const DayTick = styled.div`
  width: 4px;
  height: 8px;
  border-radius: 2px;
  left: -${4 / 2}px;
  top: 14px;
  background-color: #e88a28;
  pointer-events: none;
  position: absolute;
`;

const NowButton = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 10px 4px 4px 4px;
  left: -${18 / 2}px;
  top: 2px;
  background-color: #e88a28;
  position: absolute;
`;

export const CursorArm = styled.div`
  position: absolute;
  width: 2px;
  height: calc(100% + 14px);
  background-color: #e88a28;
  left: -1px;
  top: 0;
  z-index: 2;
  pointer-events: none;
`;
