import { DateTime } from "luxon";
import { pack, unpack } from "./pack-utils";

export const stringify = ({
  t,
  locations,
  listVersion,
}: {
  t?: number;
  locations: { key: number }[];
  listVersion: string;
}) => {
  let s = "";
  if (locations.length)
    s += listVersion + pack(locations.map(({ key }) => key));

  if (Number.isFinite(t) && t !== undefined) {
    const dateLiteral = DateTime.fromMillis(t)
      // .set({ millisecond: 0, second: 0 })
      .toISO({
        includeOffset: false,
        suppressMilliseconds: true,
        suppressSeconds: true,
        format: "basic",
      });
    s += "__" + dateLiteral;
  }

  return s;
};

export const parse = (hash: string) => {
  const [lkeys, dateLiteral] = hash.replace(/^#/, "").split("__");

  const listVersion = lkeys.slice(0, 3);
  const keys = unpack(lkeys.slice(3));

  try {
    const t = DateTime.fromISO(dateLiteral).toMillis();
    if (Number.isFinite(t)) return { keys, listVersion, t };
  } catch (err) {}

  return { keys, listVersion };
};
