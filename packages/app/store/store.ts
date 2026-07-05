import type { ILocation, LocationSearcher } from "@tzr/location-index";
import { parse, stringify } from "./utils-stringify";
import {
  getClientLocaleCountryCode,
  getClientTimezone,
} from "../intl/getClientTimezone";
import { createSubscribable } from "./subscribable";

const day = 24 * 60 * 60 * 1000;

export type Pin = { id: number; label?: string; location: ILocation };

export type State = {
  t: number;
  tOrigin: number;
  tWindowWidth: number;
  pins: Pin[];
  selectedPin: { pin: Pin; generation: number } | null;
};

export const createStore = (state0: State) => {
  let state = state0;
  const { subscribe, dispatch } = createSubscribable();

  const setState = (s: Partial<State> | ((s: State) => Partial<State>)) => {
    state = { ...state, ...(typeof s === "function" ? s(state) : s) };
    dispatch();
  };
  const getState = () => state;

  return { subscribe, getState, setState };
};

export type Store = ReturnType<typeof createStore>;

/**
 * Fire `listener` whenever the selected slice changes (Object.is). Returns an
 * unsubscribe. Plain function — the caller owns the initial call / lifecycle.
 */
export const subscribeToValue = <T>(
  store: Store,
  selector: (s: State) => T,
  listener: (value: T) => void
) => {
  let prev = selector(store.getState());
  return store.subscribe(() => {
    const next = selector(store.getState());
    if (!Object.is(next, prev)) {
      prev = next;
      listener(next);
    }
  });
};

export const createInitialState = async (searcher: LocationSearcher) => {
  const { pins: rawPins, t = Date.now() } = parse(window.location.hash);
  let pins: Pin[] = [];

  if (rawPins?.length) {
    const locations = await searcher.getLocationsByKey(
      rawPins.map((p) => p.key)
    );
    pins = rawPins
      .map(({ label }, i) => ({ id: i, label, location: locations[i]! }))
      .filter((p) => p.location !== undefined);
  }

  if (!pins.length) {
    const location = await searcher.getLocationByTimezoneAndCountryCode(
      getClientTimezone(),
      getClientLocaleCountryCode()
    );
    pins.push({ id: 0, location });
  }

  const tWindowWidth =
    Math.max(2.3, Math.min(3, window.innerWidth / 300)) * day;

  return {
    t,
    tOrigin: t,
    tWindowWidth,
    pins,
    selectedPin: null,
  } satisfies State;
};

export const subscribeHashUpdate = (store: Store) => {
  const update = () => {
    const hash = stringify({ pins: store.getState().pins });
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + "#" + hash
    );
  };
  update();
  // the hash only tracks pins, so only wake on pin changes
  return subscribeToValue(store, (s) => s.pins, update);
};
