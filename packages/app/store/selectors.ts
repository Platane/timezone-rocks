import { createSelector } from "reselect";
import type { State } from "./store";

export const selectTOrigin = (state: State) => state.tOrigin;

export const selectTWindow = createSelector(
  selectTOrigin,
  (state: State) => state.tWindowWidth,
  (tOrigin, tWindowWidth) =>
    [tOrigin - tWindowWidth / 2, tOrigin + tWindowWidth / 2] as [number, number]
);

export const selectT = (state: State) => state.t;

export const selectPins = (state: State) => state.pins;
