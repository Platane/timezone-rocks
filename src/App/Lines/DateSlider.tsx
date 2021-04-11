import { styled } from "@linaria/react";
import React, { useCallback, useRef } from "react";
import { useSlide } from "./useSlide";
import { useStore } from "../store/store";
import { useWidth } from "./useWidth";
import { selectT, selectTWindow } from "../store/selector";
import { useSubscribe } from "../store/useSubscribe";
import { Share } from "./Share";
import { accentColor } from "../theme";

const setT = (x: number) => {
  const {
    setT,
    tWindow: [a, b],
  } = useStore.getState();
  const t = a + (b - a) * x;
  setT(t);
};

const resetT = () => {
  const { setT, now } = useStore.getState();
  setT(now);
};

const { startDragDateCursor, endDragDateCursor } = useStore.getState();

export const DateSlider = () => {
  const tWindow = useStore(selectTWindow);
  const now = useStore((s) => s.now);
  const width = useWidth();

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const shareRef = useRef<HTMLDivElement | null>(null);

  const toScreenSpace = useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow, width]
  );

  useSubscribe(
    (t) => {
      const cursor = cursorRef.current;
      if (cursor) cursor.style.transform = `translateX(${toScreenSpace(t)}px)`;
      const share = shareRef.current;
      if (share) share.style.transform = `translateX(${toScreenSpace(t)}px)`;
    },
    selectT,
    [toScreenSpace, width]
  );

  const bind = useSlide({
    onChange: setT,
    onStart: startDragDateCursor,
    onEnd: endDragDateCursor,
  });

  return (
    <Container>
      <CursorContainer {...bind}>
        <NowButton
          title="Reset to now"
          onClick={resetT}
          style={{
            transform: `translateX(${toScreenSpace(now)}px)`,
          }}
        >
          <NowCarret />
          <NowLabel>now</NowLabel>
        </NowButton>

        <Caret ref={cursorRef} />
      </CursorContainer>

      <ShareContainer ref={shareRef}>
        <Share />
      </ShareContainer>
    </Container>
  );
};

const CursorContainer = styled.div`
  background-color: #ddd4;
  height: 32px;
  width: 100%;
  cursor: pointer;
  user-select: none;
`;
const ShareContainer = styled.div`
  position: absolute;
  top: 22px;
  left: 28px;
  height: 32px;
  user-select: none;
`;

const Container = styled.div`
  overflow: hidden;
  position: relative;
  padding-top: 22px;
  padding-bottom: 0px;
  width: 100%;
  touch-action: pan-y;
`;
const Caret = styled.div`
  left: -${40 / 2}px;
  position: absolute;
  width: 40px;
  height: 32px;
  border-radius: 2px;
  background-color: ${accentColor};
  pointer-events: none;
  display: inline-block;
`;

const nowColor = "#ddd";
const NowButton = styled.div`
  top: 0px;
  position: absolute;
`;

const NowCarret = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 8px 6px 2px 6px;
  left: -${16 / 2}px;
  top: 0px;
  background-color: ${nowColor};
  position: absolute;
  transform: rotate(45deg);
`;

const NowLabel = styled.div`
  color: ${nowColor};
  margin-left: 10px;
`;
