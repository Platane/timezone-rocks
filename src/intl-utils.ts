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

export const getClientTimezone = () => {
  const defaultTimeZone = "Europe/Stockholm";
  try {
    return formatter?.resolvedOptions().timeZone ?? defaultTimeZone;
  } catch (err) {
    return defaultTimeZone;
  }
};

export const getClientLocaleCountryCode = () =>
  navigator.language.split("-").slice(-1)[0];

const createFormatter = () => {
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

const formatter = createFormatter();
