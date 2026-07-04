import { DateTime } from "luxon";
import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useExtendedTruthiness } from "../../hooks/useExtendedTruthiness";
import { useStore } from "../../store/store";
import { EditIcon } from "../Icons/EditIcon";
import s from "./DatePicker.module.css";

export const DatePicker = () => {
  const timezone = useStore(
    (s) => s.locations[0]?.timezone ?? "Europe/Stockholm"
  );
  const t = useStore((s) => (s.tWindow[1] + s.tWindow[0]) / 2);
  const tWindow = useStore((s) => s.tWindow);

  const defaultValue = DateTime.fromMillis(t, { zone: timezone }).toISODate();

  const [focus, setFocus] = useState(false);
  const focusDelay = !useExtendedTruthiness(!focus, 100);
  const clickOutsideContainer = useClickOutside(
    useCallback(() => {
      if (focusDelay) {
        setFocus(false);
      }
    }, [focusDelay])
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={s.container}>
      {!focus && (
        <a
          className={s.label}
          href="#"
          aria-label="Open date picker"
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
            setFocus(true);
          }}
        >
          {formatInterval(timezone, tWindow)}
          <EditIcon className={s.icon} color="#fff" />
        </a>
      )}

      <form
        {...clickOutsideContainer}
        className={`${s.form} ${clickOutsideContainer.className}`}
        style={{
          opacity: focus ? 1 : 0,
          pointerEvents: focus ? "auto" : "none",
          visibility: focus ? "visible" : "hidden",
        }}
        onKeyDown={(e) => {
          if (e.code === "Escape") setFocus(false);
        }}
        onSubmit={(e) => {
          e.preventDefault();

          setFocus(false);

          const { value } = (e.target as any).date;

          if (!value) return;

          const d = DateTime.fromISO(value, { zone: timezone })
            .set({ hour: 12 })
            .toMillis();

          useStore.getState().setTWindowOrigin(d);
        }}
      >
        <input
          className={s.formInput}
          ref={inputRef}
          tabIndex={focus ? 0 : -1}
          name="date"
          type="date"
          aria-label="date picker"
          defaultValue={defaultValue ?? undefined}
        />
        <button
          className={s.formButton}
          type="submit"
          tabIndex={focus ? 0 : -1}
        >
          ok
        </button>
        <button
          className={s.formButton}
          type="button"
          tabIndex={focus ? 0 : -1}
          onClick={() => setFocus(false)}
        >
          cancel
        </button>
      </form>
    </div>
  );
};

export const formatInterval = (timezone: string, [a, b]: [number, number]) => {
  const da = DateTime.fromMillis(a, { zone: timezone });
  const db = DateTime.fromMillis(b, { zone: timezone });

  // const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  //   month: "long",
  //   day: "numeric",
  // });
  // return dateTimeFormat.formatRange(da.toJSDate(), db.toJSDate());

  if (da.year !== db.year)
    return (
      da.toLocaleString({ year: "numeric", month: "long", day: "numeric" }) +
      " to " +
      db.toLocaleString({ year: "numeric", month: "long", day: "numeric" })
    );

  if (da.month !== db.month)
    return (
      da.toLocaleString({ month: "long", day: "numeric" }) +
      " to " +
      db.toLocaleString({ month: "long", day: "numeric" }) +
      " " +
      db.toLocaleString({ year: "numeric" })
    );

  if (da.day !== db.day)
    return (
      da.toLocaleString({ day: "numeric" }) +
      " to " +
      db.toLocaleString({ day: "numeric" }) +
      " " +
      db.toLocaleString({ month: "long", year: "numeric" })
    );

  return da.toLocaleString({ year: "numeric", month: "long", day: "numeric" });
};
