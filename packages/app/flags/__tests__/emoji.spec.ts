import { getFlagEmoji } from "../emoji";

it("should get flag emoji", () => {
  expect(getFlagEmoji("fr")).toBe(`🇫🇷`);
});
