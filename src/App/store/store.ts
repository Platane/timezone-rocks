import create from "zustand";
import type { Location } from "../../locations/getLocations";
import { init } from "./persist";

export type Api = {
  setT: (t: number) => void;
  setTWindowOrigin: (t: number) => void;
  onEarthReady: () => void;
  initLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  removeLocation: (location: Location) => void;
  selectLocation: (location: Location) => void;
  focusSearch: () => void;
  blurSearch: () => void;
};
export type State = {
  t: number;
  now: number;
  locationStoreReady: boolean;
  searchFocused: boolean;
  earthReady: boolean;
  tWindow: [number, number];
  locations: Location[];
  selectedLocation: [Location, number] | null;
};

const t = Date.now();
const day = 24 * 60 * 60 * 1000;

const w = Math.max(2.3, Math.min(3, window.innerWidth / 300));

export const useStore = create<State & Api>((set) => ({
  t,
  now: t,
  tWindow: [t - (day * w) / 2, t + (day * w) / 2],
  locations: [],
  locationStoreReady: false,
  searchFocused: false,
  earthReady: false,
  selectedLocation: null,

  setTWindowOrigin: (t) =>
    set(({ tWindow: [a, b] }) => ({
      t,
      tWindow: [t - (b - a) / 2, t + (b - a) / 2],
    })),
  setT: (t) => set({ t }),
  initLocations: (locations) =>
    set({
      locations,
      locationStoreReady: true,
      selectedLocation: [locations[0], 1],
    }),
  onEarthReady: () => set({ earthReady: true }),
  addLocation: (location) =>
    set((s) => ({
      selectedLocation: [location, (s.selectedLocation?.[1] ?? 1) + 1],
      locations: [
        location,
        ...s.locations.filter((l) => l.key !== location.key),
      ],
    })),
  removeLocation: (location) =>
    set((s) => ({
      selectedLocation:
        s.selectedLocation?.[0] === location ? null : s.selectedLocation,
      locations: s.locations.filter((l) => l.key !== location.key),
    })),

  selectLocation: (selectedLocation) =>
    set((t) => ({
      selectedLocation: [selectedLocation, (t.selectedLocation?.[1] ?? 1) + 1],
    })),
  focusSearch: () => set({ searchFocused: true }),
  blurSearch: () => set({ searchFocused: false }),
}));

init(useStore);
