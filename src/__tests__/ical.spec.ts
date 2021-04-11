import { generateICal } from "../ical-utils";
// @ts-ignore
import ICAL from "ical.js";

it("should", () => {
  const ical = generateICal({
    summary: "hello",
    startDate: new Date().getTime(),
    url: "http://a.com",
  });

  const ical2 = ICAL.stringify(ICAL.parse(ical));

  expect(ical).toBeDefined();

  console.log(`${ical}\n--\n${ical2}`);
});
