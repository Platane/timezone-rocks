import React from "react";
import { useSlide } from "./useSlide";
import { useStore } from "../../store/store";
import { selectT, selectTWindow } from "../../store/selector";
import { useSubscribe } from "../../store/useSubscribe";
import { useWidth } from "./useWidth";
import { Share } from "./Share/Share";
import s from "./DateSlider.module.css";

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

  const cursorRef = React.useRef<HTMLDivElement | null>(null);
  const shareRef = React.useRef<HTMLDivElement | null>(null);

  const toScreenSpace = React.useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow[0], tWindow[1], width]
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
    <div className={s.container}>
      <div
        className={s.nowButton}
        title="Reset to now"
        onClick={resetT}
        style={{
          transform: `translateX(${toScreenSpace(now)}px)`,
        }}
      >
        <div className={s.nowCarret} />
        <div className={s.nowLabel}>now</div>
      </div>

      <div className={s.cursorContainer} {...bind}>
        <div className={s.caret} ref={cursorRef} aria-label="date slider" />
      </div>

      <div className={s.shareContainer} ref={shareRef}>
        <Share />
      </div>
    </div>
  );
};
