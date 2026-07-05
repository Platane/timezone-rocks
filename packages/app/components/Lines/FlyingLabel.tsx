import React from "react";
import { DateTime } from "luxon";
import type { ILocation } from "@tzr/location-index";
import s from "./FlyingLabel.module.css";

type Props = { location: ILocation; t: number } & React.ComponentProps<"div">;
export const FlyingLabel = ({ location, t, className, ...props }: Props) => (
  <div {...props} className={`${s.container} ${className ?? ""}`}>
    {formatDateTime(location.timezone, t).map((part, i) => (
      <span key={i} className={s[part.type]}>
        {part.text}
      </span>
    ))}
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
