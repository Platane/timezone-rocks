import { getDate } from "../timezone/timezone";

describe("getDate", () => {
  it("should get the time for different timezone", () => {
    const d = new Date("2021-03-18T08:17:22.259Z").getTime();

    expect(getDate("europe/paris", d)).toEqual({
      year: 2021,
      month: 3,
      day: 18,
      hour: 9 + 17 / 60 + 22 / 3600,
    });

    expect(getDate("europe/london", d)).toEqual({
      year: 2021,
      month: 3,
      day: 18,
      hour: 8 + 17 / 60 + 22 / 3600,
    });
  });

  it("should get the time before and after dst", () => {
    // for paris timezone, Sunday, 28 March 2021 — 1 hour forward
    // at 01:00 +0.0001 it jumps to 02:00 +0.0001

    // before dts leap
    const d1 = new Date("2021-03-28T00:50:00.000Z").getTime();
    expect(getDate("europe/paris", d1)).toEqual({
      year: 2021,
      month: 3,
      day: 28,
      hour: 1 + 50 / 60,
    });

    // after dts leap
    const d2 = new Date("2021-03-28T02:10:00.000Z").getTime();
    expect(getDate("europe/paris", d2)).toEqual({
      year: 2021,
      month: 3,
      day: 28,
      hour: 4 + 10 / 60,
    });
  });
});
