import { DateTime } from "luxon";

export const stringify = ({
  t,
  locations,
}: {
  t?: number;
  locations: { key: string }[];
}) => {
  let s = "";
  if (locations.length) s += locations.map(({ key }) => key).join("-");

  if (Number.isFinite(t) && t) {
    const dateLiteral = DateTime.fromMillis(t)
      .set({ millisecond: 0, second: 0 })
      .toISO({
        includeOffset: false,
        suppressMilliseconds: true,
        suppressSeconds: true,
        format: "basic",
      });
    s += "--" + dateLiteral;
  }

  return s;
};

export const parse = (hash: string) => {
  const [lkeys, dateLiteral] = hash.replace(/^#/, "").split("--");

  const keys = lkeys.split("-");

  try {
    const t = DateTime.fromISO(dateLiteral).toMillis();
    if (Number.isFinite(t)) return { keys, t };
  } catch (err) {}

  return { keys };
};
