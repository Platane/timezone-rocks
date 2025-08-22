import { styled } from "@linaria/react";
import { DateTime } from "luxon";
import React, { useCallback, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useExtendedTruthiness } from "../hooks/useExtendedTruthiness";
import { useStore } from "../store/store";
import { EditIcon } from "./Icons/EditIcon";

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
    <Container>
      {!focus && (
        <Label
          href="#"
          aria-label="Open date picker"
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
            setFocus(true);
          }}
        >
          {formatInterval(timezone, tWindow)}
          <Icon color="#fff" />
        </Label>
      )}

      <Form
        {...clickOutsideContainer}
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
        <FormInput
          ref={inputRef}
          tabIndex={focus ? 0 : -1}
          name="date"
          type="date"
          aria-label="date picker"
          defaultValue={defaultValue ?? undefined}
        />
        <FormSubmitButton type="submit" tabIndex={focus ? 0 : -1}>
          ok
        </FormSubmitButton>
        <FormButton
          type="button"
          tabIndex={focus ? 0 : -1}
          onClick={() => setFocus(false)}
        >
          cancel
        </FormButton>
      </Form>
    </Container>
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

const Icon = styled(EditIcon)`
  width: 18px;
  height: 18px;
  margin-left: 10px;
`;

const Container = styled.div`
  position: relative;
  height: 28px;
  margin: 10px;
  /* display: flex;
  flex-direction: column; */
`;
const Label = styled.a`
  font-size: 1.2em;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);
  display: inline-block;

  > svg {
    opacity: 0;
  }
  &:hover > svg {
    transition: opacity 120ms;
    opacity: 1;
  }
  &:focus > svg {
    opacity: 1;
  }
`;

const Form = styled.form`
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  /* z-index: 1000; */
`;
const FormSubmitButton = styled.button`
  height: 100%;
  min-width: 60px;
`;
const FormButton = styled.button`
  height: 100%;
  min-width: 60px;
`;
const FormInput = (styled.input as any)`
  height: 100%;
`;
