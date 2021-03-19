const formatter =
  (typeof Intl !== "undefined" &&
    Intl?.DateTimeFormat &&
    new Intl.DateTimeFormat(undefined, { timeStyle: "short" } as any)) ??
  undefined;

export const formatTime = (hour: number) => {
  const h = 0 | hour;
  const m = 0 | (hour * 60) % 60;

  if (formatter) {
    const d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    return formatter.format(d);
  } else
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};
