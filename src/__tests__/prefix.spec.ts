import { generateUniquePrefixes } from "../locations/utils-prefix";

it("should generate unique prefix", () => {
  expect(generateUniquePrefixes(["aac", "aab0", "a", "a0"])).toEqual([
    "aac",
    "aab",
    "a",
    "a0",
  ]);
});

it("should detect duplicated key", () => {
  expect(() => generateUniquePrefixes(["a0", "a0"])).toThrowError();
});
