import type { ILocation } from "@tzr/location-index";
import { create, StateCreator } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { init } from "./persist";

const t = Date.now();
const day = 24 * 60 * 60 * 1000;
const fifteenMinutes = 15 * 60 * 1000;

const w = Math.max(2.3, Math.min(3, window.innerWidth / 300));

const stateCreator: StateCreator<State & Api> = (set) => ({
  t,
  now: t,
  tWindow: [
    Math.round((t - (day * w) / 2) / fifteenMinutes) * fifteenMinutes,
    Math.round((t + (day * w) / 2) / fifteenMinutes) * fifteenMinutes,
  ] as [number, number],
  locations: [],
  locationStoreReady: false,
  dateCursorDragged: false,
  searchFocused: false,
  earthReady: false,
  selectedLocation: null,

  setTWindowOrigin: (t) =>
    set(({ tWindow: [a, b] }) => ({
      t,
      tWindow: [t - (b - a) / 2, t + (b - a) / 2],
    })),
  setT: (t) => set({ t }),
  initLocations: (locations, t) => {
    if (t)
      set({
        t: t as number,
        tWindow: [t - (day * w) / 2, t + (day * w) / 2],
        locations,
        locationStoreReady: true,
        selectedLocation: [locations[0], 1],
      });
    else
      set({
        locations,
        locationStoreReady: true,
        selectedLocation: [locations[0], 1],
      });
  },
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
    set((s) => ({
      selectedLocation: [selectedLocation, (s.selectedLocation?.[1] ?? 1) + 1],
    })),
  focusSearch: () => set({ searchFocused: true }),
  blurSearch: () => set({ searchFocused: false }),
  startDragDateCursor: () => set({ dateCursorDragged: true }),
  endDragDateCursor: () =>
    set((s) => {
      const r = 15 * 60 * 1000;
      const t = Math.round(s.t / r) * r;
      return { dateCursorDragged: false, t };
    }),
});

export const useStore = create(subscribeWithSelector(stateCreator));

init(useStore);

export type Api = {
  setT: (t: number) => void;
  setTWindowOrigin: (t: number) => void;
  onEarthReady: () => void;
  initLocations: (locations: ILocation[], t: number | undefined) => void;
  addLocation: (location: ILocation) => void;
  removeLocation: (location: ILocation) => void;
  selectLocation: (location: ILocation) => void;
  focusSearch: () => void;
  blurSearch: () => void;
  startDragDateCursor: () => void;
  endDragDateCursor: () => void;
};
export type State = {
  t: number;
  now: number;
  locationStoreReady: boolean;
  searchFocused: boolean;
  dateCursorDragged: boolean;
  earthReady: boolean;
  tWindow: [number, number];
  locations: ILocation[];
  selectedLocation: [ILocation, number] | null;
};
export type Store = typeof useStore;
