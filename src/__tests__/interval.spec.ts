import { getInterval } from "../App/Lines/interval";

it("should return timestamp intervals", () => {
  expect(
    getInterval("europe/paris", [8, 10], { year: 2021, month: 3, day: 18 }).map(
      (x) => new Date(x)
    )
  ).toEqual([
    new Date("2021-03-18T07:00:00.000Z"),
    new Date("2021-03-18T09:00:00.000Z"),
  ]);

  expect(
    getInterval("europe/london", [8, 10], {
      year: 2021,
      month: 3,
      day: 18,
    }).map((x) => new Date(x))
  ).toEqual([
    new Date("2021-03-18T08:00:00.000Z"),
    new Date("2021-03-18T10:00:00.000Z"),
  ]);
});
