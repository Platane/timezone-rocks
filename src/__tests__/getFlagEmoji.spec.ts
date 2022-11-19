import { getFlagEmoji } from "../utils-emoji";

it("should get flag emoji", () => {
  expect(getFlagEmoji("fr")).toBe(`🇫🇷`);
});
