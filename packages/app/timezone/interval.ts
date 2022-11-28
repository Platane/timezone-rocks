import { DateTime } from "luxon";

type Interval = [number, number];

export const DAY_HOURS = [0, 23.9999] as Interval;
export const AWAKE_HOURS = [7, 21] as Interval;
export const OFFICE_HOURS = [9, 18] as Interval;

export const getDays = (timezone: string, [min, max]: Interval) => {
  const days: Interval[] = [];

  let d = DateTime.fromMillis(min).setZone(timezone);
  d = setHour(d, 0);

  do {
    days.push(getInterval(d, DAY_HOURS));

    const h = 1000 * 60 * 60 * 12;
    d = setHour(d, 23.99).plus(h);
    d = setHour(d, 0);
  } while (d.toMillis() < max);

  days.push(getInterval(d, DAY_HOURS));

  return days;
};

export const getBlocks = (timezone: string, [min, max]: Interval) => {
  const blocks: Block[] = [];

  let d = DateTime.fromMillis(min).setZone(timezone);
  d = setHour(d, 0);

  do {
    blocks.push(getBlock(d));

    const h = 1000 * 60 * 60 * 12;
    d = setHour(d, 23.99).plus(h);
    d = setHour(d, 0);
  } while (d.toMillis() < max);

  blocks.push(getBlock(d));

  return blocks;
};

const getInterval = (d: DateTime, [a, b]: Interval) => {
  const u = setHour(d, a).toMillis();
  const v = setHour(d, b).toMillis();
  return [u, v] as Interval;
};

const getBlock = (d: DateTime) => ({
  day: getInterval(d, DAY_HOURS),
  awake: getInterval(d, AWAKE_HOURS),
  office: getInterval(d, OFFICE_HOURS),
});

type Block = ReturnType<typeof getBlock>;

const setHour = (d: DateTime, hour: number = 0) =>
  d.set({
    year: d.year,
    month: d.month,
    day: d.day,
    hour: 0 | hour,
    minute: (0 | (hour * 60)) % 60,
    second: (0 | (hour * 60 * 60)) % 60,
    millisecond: (0 | (hour * 60 * 60 * 1000)) % 1000,
  });
