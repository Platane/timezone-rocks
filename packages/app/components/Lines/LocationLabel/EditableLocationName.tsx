import { useCallback, useRef, useState } from "react";
import { EditIcon } from "../../Icons/EditIcon";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { selectPin, setPinLabel } from "../../../store/mutators";
import type { Pin, Store } from "../../../store/store";
import s from "./EditableLocationName.module.css";

type Props = {
  store: Store;
  pin: Pin;
  onEditingChange?: (editing: boolean) => void;
};
export const EditableLocationName = ({
  store,
  pin,
  onEditingChange,
}: Props) => {
  const { location } = pin;
  const name = pin.label ?? location.name;

  const [editing, setEditingState] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setEditing = useCallback(
    (value: boolean) => {
      setEditingState(value);
      onEditingChange?.(value);
    },
    [onEditingChange]
  );

  const clickOutside = useClickOutside(
    useCallback(() => {
      if (editing) setEditing(false);
    }, [editing, setEditing])
  );

  const startEditing = () => {
    setEditing(true);
    // focus after the input becomes visible
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const commit = () => {
    if (inputRef.current)
      store.setState(setPinLabel(pin.id, inputRef.current.value));
    setEditing(false);
  };

  if (!editing)
    return (
      <button
        type="button"
        className={s.name + " " + clickOutside.className}
        aria-label="rename location"
        title="rename"
        onClick={() => {
          store.setState(selectPin(pin.id));
          startEditing();
        }}
      >
        <label htmlFor={`pin-` + pin.id}>{name}</label>
        {pin.label && <span className={s.subName}>{location.name}</span>}
        <EditIcon className={s.icon} />
      </button>
    );

  return (
    <form
      {...clickOutside}
      className={`${s.form} ${clickOutside.className}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Escape") setEditing(false);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        commit();
      }}
    >
      <input
        ref={inputRef}
        className={s.input}
        defaultValue={pin.label ?? ""}
        placeholder={location.name}
        aria-label="rename location"
        maxLength={20}
      />
      <button className={s.button} type="submit">
        ok
      </button>
      <button
        className={s.button}
        type="button"
        onClick={() => setEditing(false)}
      >
        cancel
      </button>
    </form>
  );
};
