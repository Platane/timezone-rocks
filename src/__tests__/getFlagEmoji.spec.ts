import { getFlagEmoji } from "../emojiFlagSequence";

it("should get flag emoji", () => {
  expect(getFlagEmoji("fr")).toBe(`🇫🇷`);
});
