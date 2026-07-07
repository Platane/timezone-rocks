import { getFlagEmoji } from "../../flags/emoji";
import { formatOffset } from "../../intl/format";
import { removePin, selectPin } from "../../store/mutators";
import { useValue } from "../../store/hooks";
import type { Pin, Store } from "../../store/store";
import { stringify } from "../../store/utils-stringify";
import { getTimezoneOffset } from "../../timezone/timezone";
import s from "./LocationLabel.module.css";
import React from "react";

type Props = { store: Store; pin: Pin; pins: Pin[]; t: number };
export const LocationLabel = ({ store, pin, pins, t }: Props) => {
  const selected = useValue(
    store,
    React.useCallback((state) => state.selectedPin?.pinId === pin.id, [pin.id])
  );

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        store.setState(selectPin(pin.id));
      }}
      className={
        selected ? `${s.container} ${s.locationLabelSelected}` : s.container
      }
    >
      <label className={s.name} htmlFor={"pin-" + pin.id}>
        {pin.location.name}
      </label>

      <span className={s.flag}>
        {pin.location.countryCode ? getFlagEmoji(pin.location.countryCode) : ""}
      </span>

      <span className={s.offset}>
        {formatOffset(getTimezoneOffset(pin.location.timezone, t))}
      </span>

      <a
        className={s.removeButton}
        role="button"
        aria-label="remove location"
        href={"#" + stringify({ pins: pins.filter((p) => p !== pin) })}
        title="remove location"
        onClick={(e) => {
          e.preventDefault();
          store.setState(removePin(pin.id));
        }}
      >
        ×
      </a>
    </div>
  );
};
