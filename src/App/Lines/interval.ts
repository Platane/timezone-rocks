import { DateTime } from "luxon";

type Interval = [number, number];

export const DAY_HOURS = [0, 23.9999] as Interval;
export const AWAKE_HOURS = [7, 21] as Interval;
export const OFFICE_HOURS = [9, 18] as Interval;

export const getBlocks = (
  timezone: string,
  { year, month, day }: { year: number; month: number; day: number },
  [min, max]: Interval
) => {
  const blocks: ({ primary?: boolean } & Block)[] = [];

  const d = set(DateTime.now().setZone(timezone), year, month, day);

  blocks.push({ primary: true, ...getBlock(d) });

  for (let k = 2; k--; ) {
    const h = 1000 * 60 * 60 * 24 * (k + 1);
    blocks.push(getBlock(set(d, year, month, day).plus(h)));
    blocks.push(getBlock(set(d, year, month, day).minus(h)));
  }

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

const hourToObject = (hour = 0) => ({
  hour: 0 | hour,
  minute: (0 | (hour * 60)) % 60,
  second: (0 | (hour * 60 * 60)) % 60,
  millisecond: (0 | (hour * 60 * 60 * 1000)) % 1000,
});

const setHour = (d: DateTime, hour: number = 0) =>
  d.set({
    year: d.year,
    month: d.month,
    day: d.day,
    ...hourToObject(hour),
  });

const set = (
  d: DateTime,
  year: number,
  month: number,
  day: number,
  hour: number = 0
) =>
  d.set({
    year,
    month,
    day,
    ...hourToObject(hour),
  });
