import React from "react";
import { DateTime } from "luxon";
import type { ILocation } from "@tzr/location-index";
import s from "./FlyingLabel.module.css";

type Props = { location: ILocation; t: number };
export const FlyingLabel = (props: React.ComponentProps<"div">) => (
  <div {...props} className={`${s.container} ${props.className ?? ""}`}>
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
  </div>
);

/**
 * format the date as string
 * split into date / time / literal blocks
 */
const formatDateTime = (timezone: string, t: number) => {
  const date = DateTime.fromMillis(t, { zone: timezone });

  const parts = date.toLocaleParts({
    minute: "2-digit",
    hour: "2-digit",
    month: "long",
    day: "numeric",
  });

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

    el.classList.remove(s.date);
    el.classList.remove(s.time);
    el.classList.remove(s.literal);

    if (parts[i]?.type === "literal") el.classList.add(s.literal);
    if (parts[i]?.type === "date") el.classList.add(s.date);
    if (parts[i]?.type === "time") el.classList.add(s.time);
  }
};
