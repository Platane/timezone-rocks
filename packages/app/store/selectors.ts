import { createSelector } from "reselect";
import type { State } from "./store";

export const selectTOrigin = (state: State) => state.tOrigin;

export const selectTWindow = createSelector(
  selectTOrigin,
  (state: State) => state.tWindowWidth,
  (tOrigin, tWindowWidth) => {
    const a = new Date(tOrigin - tWindowWidth / 2);
    a.setMilliseconds(0);
    a.setSeconds(0);
    a.setMinutes(Math.round(a.getMinutes() / 15) * 15);

    const b = new Date(tOrigin + tWindowWidth / 2);
    b.setMilliseconds(0);
    b.setSeconds(0);
    b.setMinutes(Math.round(b.getMinutes() / 15) * 15);

    return [a.getTime(), b.getTime()] as [number, number];
  }
);

export const selectT = (state: State) => state.t;

export const selectPins = (state: State) => state.pins;
