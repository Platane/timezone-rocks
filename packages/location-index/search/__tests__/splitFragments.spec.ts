import { splitFragments } from "../splitFragments";
import { it, expect } from "bun:test";

it("should split text fragments", () => {
  const text1 = "Linda Stevenson";
  const text2 = "living Linda Stevenson liable";

  expect(splitFragments("lin", text1.toLowerCase(), text1)).toEqual([
    { match: true, text: "Lin" },
    { match: false, text: "da Stevenson" },
  ]);

  expect(splitFragments("li", text2.toLowerCase(), text2)).toEqual([
    { match: true, text: "li" },
    { match: false, text: "ving " },
    { match: true, text: "Li" },
    { match: false, text: "nda Stevenson " },
    { match: true, text: "li" },
    { match: false, text: "able" },
  ]);

  expect(splitFragments("", text2.toLowerCase(), text2)).toEqual([
    { match: false, text: "living Linda Stevenson liable" },
  ]);
});

it("should avoid repeating adjacents fragments", () => {
  const text2 = "XxXXxxXxX";

  expect(splitFragments("x", "xxxxxxxxx")).toEqual([
    { match: true, text: "x" },
    { match: false, text: "xxxxxxxx" },
  ]);

  expect(splitFragments("x", text2.toLowerCase(), text2)).toEqual([
    { match: true, text: "X" },
    { match: false, text: "xXXxxXxX" },
  ]);
});
