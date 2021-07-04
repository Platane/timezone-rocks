import type { State } from "./store";
import { createSelector } from "reselect";

export const currentTimeZone =
  window.Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone ??
  "Europe/Stockholm";

export const selectT = (s: State) => s.t;

export const selectTWindow = (s: State) => s.tWindow;

const hour = 1000 * 60 * 60;
const day = hour * 24;

export const selectHour = createSelector(selectT, (t) => (t % day) / hour);

export const selectTWindowLerp = createSelector(
  selectTWindow,
  ([a, b]) =>
    (x: number) =>
      (x - a) / (b - a)
);
