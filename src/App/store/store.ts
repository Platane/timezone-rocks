import create from "zustand";

export type Api = {
  setT: (t: number) => void;
};
export type State = {
  t: number;
  tWindow: [number, number];
};

const t = Date.now();
const day = 24 * 60 * 60 * 1000;

export const useStore = create<State & Api>((set) => ({
  t,
  tWindow: [t - day * 1.3, t + day * 1.3],

  setT: (t) => set({ t }),
}));
