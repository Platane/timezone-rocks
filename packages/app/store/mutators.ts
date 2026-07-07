import type { ILocation } from "@tzr/location-index";
import type { Pin, State } from "./store";

export const selectPin =
  (pinId: number) =>
  (s: State): Partial<State> => ({
    selectedPin: { pinId, generation: (s.selectedPin?.generation ?? 0) + 1 },
  });

export const setPinLabel =
  (pinId: number, label?: string) =>
  (s: State): Partial<State> => ({
    pins: s.pins.map((p) =>
      p.id === pinId
        ? { ...p, label: label?.trim().replaceAll(/-/g, "") || undefined }
        : p
    ),
  });

export const removePin =
  (pinId: number) =>
  (s: State): Partial<State> => ({
    pins: s.pins.filter((p) => p.id !== pinId),
    selectedPin: s.selectedPin?.pinId === pinId ? null : s.selectedPin,
  });

export const addPin =
  (location: ILocation, label?: string) =>
  (s: State): Partial<State> => {
    const id = Math.max(0, ...s.pins.map((p) => p.id)) + 1;
    const pin: Pin = { id, location, label };
    return {
      pins: [pin, ...s.pins],
      selectedPin: { pinId: id, generation: 0 },
    };
  };
