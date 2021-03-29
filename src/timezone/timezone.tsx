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

/**
 * return the offset for the time zone ad the given date
 *
 * @param timezone
 * @param timestamp in ms utc
 * @returns offset in minute
 */
export const getTimezoneOffset = (timezone: string, timestamp: number) => {
  const d = DateTime.fromMillis(timestamp).setZone(timezone);
  return d.offset;
};
