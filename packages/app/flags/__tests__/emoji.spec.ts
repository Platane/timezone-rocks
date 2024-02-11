import { getFlagEmoji } from "../emoji";
import { it, expect } from "bun:test";

it("should get flag emoji", () => {
  expect(getFlagEmoji("fr")).toBe("🇫🇷");
});
