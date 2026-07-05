import type { ILocation } from "@tzr/location-index";
import type { Pin, State } from "./store";

export const selectPin =
  (pin: Pin) =>
  (s: State): Partial<State> => ({
    selectedPin: { pin, generation: (s.selectedPin?.generation ?? 0) + 1 },
  });

export const removePin =
  (pin: Pin) =>
  (s: State): Partial<State> => ({
    pins: s.pins.filter((p) => p !== pin),
    selectedPin: s.selectedPin?.pin === pin ? null : s.selectedPin,
  });

export const addPin =
  (location: ILocation, label?: string) =>
  (s: State): Partial<State> => {
    const id = Math.max(0, ...s.pins.map((p) => p.id)) + 1;
    const pin: Pin = { id, location, label };
    return {
      pins: [pin, ...s.pins],
      selectedPin: { pin, generation: (s.selectedPin?.generation ?? 0) + 1 },
    };
  };
