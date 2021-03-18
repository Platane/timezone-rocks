import { DateTime } from "luxon";

/**
 *
 * @param timezone
 * @param timestamp timestamp utc
 */
export const getDate = (timezone: string, timestamp: number) => {
  const d = DateTime.fromMillis(timestamp).setZone(timezone);

  return {
    hour: d.hour + d.minute / 60 + d.second / 3600,
    day: d.day,
    month: d.month,
    year: d.year,
  };
};

type Date = {
  year: number;
  month: number;
  day: number;
  hour: number;
};

export const getUtcTimestampAt = (timezone: string, date: Date) => {
  const hour = 0 | date.hour;
  const minute = (0 | (date.hour * 60)) % 60;
  const second = (0 | (date.hour * 60 * 60)) % 60;
  const millisecond = (0 | (date.hour * 60 * 60 * 1000)) % 1000;

  const d = DateTime.now()
    .setZone(timezone)
    .set({
      ...date,
      hour,
      minute,
      second,
      millisecond,
    });
  return d.toMillis();
};
