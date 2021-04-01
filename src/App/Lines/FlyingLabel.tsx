import { styled } from "@linaria/react";
import React, { useState } from "react";
import { DateTime } from "luxon";
import { Location } from "../../locations";
import { useStore } from "../store/store";
import { useExtendedTruthiness } from "../../hooks/useExtendedTruthiness";

type Props = { location: Location };
export const FlyingLabel = ({ location }: Props) => {
  const [focus, setFocus] = useState(false);
  const focusPlus = useExtendedTruthiness(focus, 50);

  return (
    <Container>
      <span />
      <div
        style={{ pointerEvents: "auto", position: "relative" }}
        onClick={(e) => {
          e.stopPropagation();
          setFocus(true);
          (e.currentTarget.children[1].children[0] as any).focus();
        }}
      >
        <DateLabel />
        <Form
          style={{
            opacity: focus ? 1 : 0,
            pointerEvents: focusPlus ? "auto" : "none",
          }}
          onSubmit={(e) => {
            e.preventDefault();

            setFocus(false);

            const { value } = (e.target as any).children[0];

            if (!value) return;

            const d = DateTime.fromISO(value, { zone: location.timezone })
              .set({ hour: 12 })
              .toMillis();

            useStore.getState().setTWindowOrigin(d);
          }}
        >
          <FormInput type="date" onBlur={() => setFocus(false)} />
          <FormButton type="submit">ok</FormButton>
        </Form>
      </div>
      <span />
    </Container>
  );
};
const formatDateTime = (timezone: string, t: number) => {
  const parts = DateTime.fromMillis(t, { zone: timezone }).toLocaleParts({
    minute: "numeric",
    hour: "numeric",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const values = parts.map((x) => x.value);

  const a = parts.findIndex(
    ({ type }) => type === "month" || type === "year" || type === "day"
  );
  const b =
    parts.length -
    parts
      .reverse()
      .findIndex(
        ({ type }) => type === "month" || type === "year" || type === "day"
      );

  return [
    values.slice(0, a).join(""),
    values.slice(a, b).join(""),
    values.slice(b).join(""),
  ];
};

export const update = (
  domElement: Element,
  { location, t }: Props & { t: number }
) => {
  const [before, date, after] = formatDateTime(location.timezone, t);

  const value = DateTime.fromMillis(t, {
    zone: location.timezone,
  }).toISODate();

  domElement.children[0].innerHTML = before;
  domElement.children[1].children[0].innerHTML = date;
  (domElement.children[1].children[1].children[0] as any).value = value;
  domElement.children[2].innerHTML = after;
};

const Form = styled.form`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;
const FormButton = styled.button``;
const FormInput = styled.input``;

const Container = styled.div`
  padding-left: 4px;
  white-space: nowrap;
  position: absolute;
  left: 0;
  font-size: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  height: 100%;
  pointer-events: none;
  font-size: 1.4em;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);
`;

const DateLabel = styled.span`
  font-size: 0.72em;
`;
