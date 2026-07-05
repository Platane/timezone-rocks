import React from "react";
import { useValue } from "../../store/hooks";
import { selectT, selectTWindow } from "../../store/selectors";
import type { Store } from "../../store/store";
import { Share } from "./Share/Share";
import s from "./DateSliderRange.module.css";

// gap between the caret and the share buttons that trail to its right
const shareOffset = 28;

export const DateSliderRange = ({ store }: { store: Store }) => {
  const tWindow = useValue(store, selectTWindow);
  const t = useValue(store, selectT);

  const now = React.useMemo(() => Date.now(), []);
  const [dragging, setDragging] = React.useState(false);

  const toRatio = (x: number) => (x - tWindow[0]) / (tWindow[1] - tWindow[0]);

  const step = 15 * 60 * 1000; // 15 minutes

  // the input is widened so the thumb centre sits at k*100%; trail the share
  // buttons just to the right of it
  const k = toRatio(t);

  return (
    <div className={s.container}>
      <div
        className={s.nowButton}
        title="Reset to now"
        onClick={() => store.setState({ t: now })}
        style={{ left: `${toRatio(now) * 100}%` }}
      >
        <div className={s.nowCaret} />
        <div className={s.nowLabel}>now</div>
      </div>

      <input
        className={s.inputRange}
        type="range"
        step={step}
        min={tWindow[0]}
        max={tWindow[1]}
        value={t}
        aria-label="date slider"
        onFocus={() => setDragging(true)}
        onBlur={() => {
          setDragging(false);
          // snap to the nearest absolute 15-min boundary once dragging ends
          store.setState((s) => ({ t: Math.round(s.t / step) * step }));
        }}
        onChange={(e) => store.setState({ t: +e.target.value })}
      />

      <div
        className={s.shareContainer}
        style={{ left: `calc(${k * 100}% + ${shareOffset}px)` }}
      >
        <Share store={store} visible={!dragging} />
      </div>
    </div>
  );
};
