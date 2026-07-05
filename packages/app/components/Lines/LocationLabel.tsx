import { getFlagEmoji } from "../../flags/emoji";
import { formatOffset } from "../../intl/format";
import { removePin, selectPin } from "../../store/mutators";
import { useValue } from "../../store/hooks";
import type { Pin, State, Store } from "../../store/store";
import { stringify } from "../../store/utils-stringify";
import { getTimezoneOffset } from "../../timezone/timezone";
import s from "./LocationLabel.module.css";

const selectSelectedPin = (state: State) => state.selectedPin;

type Props = { store: Store; pin: Pin; pins: Pin[]; t: number; itemId: string };
export const LocationLabel = ({ store, pin, pins, t, itemId }: Props) => {
  const { location } = pin;
  const selected = useValue(store, selectSelectedPin)?.pin === pin;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        store.setState(selectPin(pin));
      }}
      className={
        selected ? `${s.container} ${s.locationLabelSelected}` : s.container
      }
    >
      <label className={s.name} htmlFor={itemId}>
        {location.name}
      </label>

      <span className={s.flag}>
        {location.countryCode ? getFlagEmoji(location.countryCode) : ""}
      </span>

      <span className={s.offset}>
        {formatOffset(getTimezoneOffset(location.timezone, t))}
      </span>

      <a
        className={s.removeButton}
        role="button"
        aria-label="remove location"
        href={"#" + stringify({ pins: pins.filter((p) => p !== pin) })}
        title="remove location"
        onClick={(e) => {
          e.preventDefault();
          store.setState(removePin(pin));
        }}
      >
        ×
      </a>
    </div>
  );
};
