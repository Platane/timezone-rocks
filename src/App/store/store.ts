import create from "zustand";
import type { Location } from "../../locations/getLocations";
import { init } from "./persist";

export type Api = {
  setT: (t: number) => void;
  onEarthReady: () => void;
  initLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  removeLocation: (location: Location) => void;
  focusSearch: () => void;
  blurSearch: () => void;
};
export type State = {
  t: number;
  locationStoreReady: boolean;
  searchFocused: boolean;
  earthReady: boolean;
  tWindow: [number, number];
  locations: Location[];
};

const t = Date.now();
const day = 24 * 60 * 60 * 1000;

export const useStore = create<State & Api>((set) => ({
  t,
  tWindow: [t - day * 1.3, t + day * 1.3],
  locations: [],
  locationStoreReady: false,
  searchFocused: false,
  earthReady: false,

  setT: (t) => set({ t }),
  initLocations: (locations) => set({ locations, locationStoreReady: true }),
  onEarthReady: () => set({ earthReady: true }),
  addLocation: (location) =>
    set((s) => ({
      locations: [
        location,
        ...s.locations.filter((l) => l.key !== location.key),
      ],
    })),
  removeLocation: (location) =>
    set((s) => ({
      locations: s.locations.filter((l) => l.key !== location.key),
    })),

  focusSearch: () => set({ searchFocused: true }),
  blurSearch: () => set({ searchFocused: false }),
}));

init(useStore);
