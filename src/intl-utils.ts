export const formatTime = (hour: number) => {
  const h = 0 | hour;
  const m = 0 | (hour * 60) % 60;

  if (timeFormatter) {
    const d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    return timeFormatter.format(d);
  } else
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export const formatOffset = (minute: number) => {
  const sign = minute > 0;
  const hour = 0 | (Math.abs(minute) / 60);
  const min = 0 | Math.abs(minute) % 60;

  return (
    "GMT " +
    ((sign ? "+" : "-") + hour).padStart(3, " ") +
    ":" +
    min.toString().padStart(2, "0")
  );
};

export const formatDate = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}) => {
  if (dateFormatter) {
    const d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(day);
    d.setHours(0);
    d.setMinutes(0);
    return dateFormatter.format(d);
  } else
    return [
      day.toString().padStart(2, "0"),
      month.toString().padStart(2, "0"),
      year.toString().slice(-2),
    ].join("/");
};

export const formatDateTime = ({
  year,
  month,
  day,
  hour,
}: {
  year: number;
  month: number;
  day: number;
  hour: number;
}) => {
  if (dateTimeFormatter) {
    const d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(day);
    d.setMinutes(0);
    d.setHours(hour);
    return dateTimeFormatter.format(d);
  } else {
    return formatDate({ year, month, day }) + " " + formatTime(hour);
  }
};

export const getClientTimezone = () => {
  const defaultTimeZone = "Europe/Stockholm";
  try {
    return timeFormatter?.resolvedOptions().timeZone ?? defaultTimeZone;
  } catch (err) {
    return defaultTimeZone;
  }
};

export const getClientLocaleCountryCode = () =>
  navigator.language.split("-").slice(-1)[0];

const createTimeFormatter = () => {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    } as any);

    if ((formatter.resolvedOptions() as any).timeStyle === "short")
      return formatter;
    else
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
  } catch (e) {}
};
const createDateFormatter = () => {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    } as any);

    if ((formatter.resolvedOptions() as any).dateStyle === "medium")
      return formatter;
    else
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  } catch (e) {}
};
const createDateTimeFormatter = () => {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
      dateStyle: "medium",
    } as any);

    if ((formatter.resolvedOptions() as any).dateStyle === "medium")
      return formatter;
    else
      return new Intl.DateTimeFormat(undefined, {
        minute: "numeric",
        hour: "numeric",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  } catch (e) {}
};

const dateTimeFormatter = createDateTimeFormatter();
const timeFormatter = createTimeFormatter();
const dateFormatter = createDateFormatter();
