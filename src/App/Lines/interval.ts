import { getUtcTimestampAt } from "../../timezone";

export const DAY_HOURS = [0, 23.9999999] as [number, number];
export const AWAKE_HOURS = [7, 21] as [number, number];
export const OFFICE_HOURS = [9, 18] as [number, number];

export const getInterval = (
  timezone: string,
  i: [number, number],
  date: { year: number; month: number; day: number }
) =>
  i.map((x) => getUtcTimestampAt(timezone, { ...date, hour: x })) as [
    number,
    number
  ];
