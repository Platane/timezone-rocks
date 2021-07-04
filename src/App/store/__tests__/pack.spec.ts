import { pack, unpack } from "../pack";

it("pack", () => {
  const value = [1, 2819, 32, 3410, 918, 123, 0, 12];
  expect(value).toEqual(unpack(pack(value)));
});
