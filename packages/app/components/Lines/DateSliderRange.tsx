import React from "react";
import { selectT, selectTWindow } from "../../store/selector";
import { useStore } from "../../store/store";
import { useSubscribe } from "../../store/useSubscribe";
import { Share } from "./Share/Share";
import { useWidth } from "./useWidth";
import s from "./DateSliderRange.module.css";

const caretWidth = 40;

const { startDragDateCursor, endDragDateCursor } = useStore.getState();

export const DateSliderRange = () => {
  const tWindow = useStore(selectTWindow);
  const now = useStore((s) => s.now);

  const width = useWidth();

  const toScreenSpace = React.useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow[0], tWindow[1], width]
  );

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const shareRef = React.useRef<HTMLDivElement | null>(null);

  useSubscribe(
    (t) => {
      const input = inputRef.current;
      if (!input) return;

      input.value = t + "";

      //
      const k = (+input.value - +input.min) / (+input.max - +input.min);
      const x = input.clientLeft + (input.clientWidth - caretWidth) * k;

      if (shareRef.current)
        shareRef.current.style.setProperty("transform", `translateX(${x}px)`);
    },
    selectT,
    [tWindow]
  );

  const step = 15 * 60 * 1000; // 15 minutes

  return (
    <div className={s.container}>
      <div
        className={s.nowButton}
        title="Reset to now"
        onClick={() => useStore.setState({ t: now })}
        style={{ transform: `translateX(${toScreenSpace(now)}px)` }}
      >
        <div className={s.nowCaret} />
        <div className={s.nowLabel}>now</div>
      </div>

      <input
        className={s.inputRange}
        ref={inputRef}
        type="range"
        step={step}
        min={tWindow[0]}
        max={tWindow[1]}
        defaultValue={now}
        aria-label="date slider"
        onFocus={() => startDragDateCursor()}
        onBlur={() => endDragDateCursor()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          useStore.setState({ t: +e.target.value });
        }}
      />

      <div className={s.shareContainer} ref={shareRef}>
        <Share />
      </div>
    </div>
  );
};
