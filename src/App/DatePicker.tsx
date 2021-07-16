import React, { useState } from "react";
import { styled } from "@linaria/react";
import { useStore } from "./store/store";
import { DateTime } from "luxon";
import { EditIcon } from "./Icons/EditIcon";

export const DatePicker = () => {
  const timezone = useStore(
    (s) => s.locations[0]?.timezone ?? "Europe/Stockholm"
  );
  const t = useStore((s) => (s.tWindow[1] + s.tWindow[0]) / 2);
  const tWindow = useStore((s) => s.tWindow);

  const defaultValue = DateTime.fromMillis(t, { zone: timezone }).toISODate();

  const [focus, setFocus] = useState(false);

  return (
    <Container>
      {!focus && (
        <Label onClick={() => setFocus(true)}>
          {formatInterval(timezone, tWindow)}
          <Icon color="#fff" />
        </Label>
      )}

      {focus && (
        <Form
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
          <FormInput name="date" type="date" defaultValue={defaultValue} />
          <FormSubmitButton type="submit">ok</FormSubmitButton>
          <FormButton onClick={() => setFocus(false)}>cancel</FormButton>
        </Form>
      )}
    </Container>
  );
};

export const formatInterval = (timezone: string, [a, b]: [number, number]) => {
  const da = DateTime.fromMillis(a, { zone: timezone });
  const db = DateTime.fromMillis(b, { zone: timezone });

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
  display: flex;
  flex-direction: column;
`;
const Label = styled.span`
  font-size: 1.4em;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);
  cursor: pointer;
`;

const Form = styled.form`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  /* z-index: 1000; */
`;
const FormSubmitButton = styled.button`
  height: 100%;
`;
const FormButton = styled.button`
  height: 100%;
`;
const FormInput = styled.input`
  height: 100%;
`;
