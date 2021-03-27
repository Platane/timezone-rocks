import create from "zustand";
import type { Location } from "../../locations/getLocations";
import { init } from "./persist";

export type Api = {
  setT: (t: number) => void;
  initLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  removeLocation: (location: Location) => void;
};
export type State = {
  t: number;
  locationStoreReady: boolean;
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

  setT: (t) => set({ t }),
  initLocations: (locations) => set({ locations, locationStoreReady: true }),
  addLocation: (location) =>
    set((s) => ({
      locations: [
        ...s.locations.filter((l) => l.key !== location.key),
        location,
      ],
    })),
  removeLocation: (location) =>
    set((s) => ({
      locations: s.locations.filter((l) => l.key === location.key),
    })),
}));

init(useStore);
