import { styled } from "@linaria/react";
import React, { useState } from "react";
import { DateTime } from "luxon";
import { Location } from "../../locations";
import { useStore } from "../store/store";
import { useExtendedTruthiness } from "../../hooks/useExtendedTruthiness";

type Props = { location: Location };
export const FlyingLabel = ({ location }: Props) => (
  <Container>
    <span />
    <div style={{ pointerEvents: "auto", position: "relative" }}>
      <DateLabel />
    </div>
    <span />
  </Container>
);

const formatDateTime = (timezone: string, t: number) => {
  const parts = DateTime.fromMillis(t, { zone: timezone }).toLocaleParts({
    minute: "numeric",
    hour: "numeric",
    // year: "numeric",
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

  domElement.children[0].innerHTML = before;
  domElement.children[1].children[0].innerHTML = date;
  domElement.children[2].innerHTML = after;
};

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
