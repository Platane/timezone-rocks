import { styled } from "@linaria/react";
import React from "react";
import { DateTime } from "luxon";
import type { ILocation } from "@tzr/location-index";
import { css } from "@linaria/core";

type Props = { location: ILocation; t: number };
export const FlyingLabel = (props: React.ComponentProps<typeof Container>) => (
  <Container {...props}>
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
  </Container>
);

/**
 * format the date as string
 * split into date / time / literal blocks
 */
const formatDateTime = (timezone: string, t: number) => {
  const date = DateTime.fromMillis(t, { zone: timezone }).toJSDate();

  const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    minute: "2-digit",
    hour: "2-digit",
    month: "long",
    day: "numeric",
  });

  const parts = dateTimeFormat.formatToParts(date);

  const getLooseType = (type: Intl.DateTimeFormatPart["type"]) =>
    ((type === "day" || type === "month" || type === "year") && "date") ||
    ((type === "hour" || type === "minute" || type === "dayPeriod") &&
      "time") ||
    "literal";

  const looseParts: { type: "date" | "time" | "literal"; text: string }[] = [];

  let i = 0;
  while (i < parts.length) {
    const type = getLooseType(parts[i].type);

    let j = i;
    for (; j < parts.length; j++) {
      const t = getLooseType(parts[j].type);
      if (t !== "literal" && t !== type) break;
    }

    j--;

    if (type !== "literal")
      while (parts[j] && getLooseType(parts[j].type) === "literal") j--;

    let text = "";
    for (let k = i; k <= j; k++) text += parts[k].value;

    looseParts.push({ type, text });

    i = j + 1;
  }

  return looseParts;
};

export const update = (domElement: Element, { location, t }: Props) => {
  const parts = formatDateTime(location.timezone, t);

  for (let i = 0; i < domElement.children.length; i++) {
    const el = domElement.children[i] as HTMLElement;
    el.innerText = parts[i]?.text ?? "";

    el.classList.remove(dateClassName);
    el.classList.remove(timeClassName);
    el.classList.remove(literalClassName);

    if (parts[i]?.type === "literal") el.classList.add(literalClassName);
    if (parts[i]?.type === "date") el.classList.add(dateClassName);
    if (parts[i]?.type === "time") el.classList.add(timeClassName);
  }
};

const dateClassName = css`
  white-space: pre;
  font-size: 0.72em;
`;
const timeClassName = css`
  white-space: pre;
`;
const literalClassName = css`
  font-size: 0.72em;
  white-space: pre;
`;

const Container = styled.div`
  padding-left: 4px;
  white-space: nowrap;
  position: absolute;
  left: 0;
  font-size: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding-bottom:2px ;
  z-index: 2;
  height: 100%;
  pointer-events: none;
  font-size: 1.4em;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1), 0 0 8px rgba(0, 0, 0, 1);
`;
