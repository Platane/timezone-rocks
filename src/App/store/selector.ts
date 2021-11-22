import type { State } from "./store";

export const selectT = (s: State) => s.t;

export const selectTWindow = (s: State) => s.tWindow;

export const selectUseCheapAvatar = () => false;
