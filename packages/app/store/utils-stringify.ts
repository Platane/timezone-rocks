import { DateTime } from "luxon";

export const stringify = ({
  t,
  pins,
}: {
  t?: number;
  pins: { location: { key: string }; label?: string }[];
}) => {
  let s = "";
  if (pins.length)
    s += pins
      .map(
        ({ location, label }) =>
          location.key + (label ? "=" + encodeURIComponent(label) : "")
      )
      .join("-");

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
  const [lpins, dateLiteral] = hash.replace(/^#/, "").split("--");

  const pins = lpins.split("-").map((p) => {
    const [key, label] = p.split("=");
    return { key, label: label ? decodeURIComponent(label) : undefined };
  });

  try {
    const t = DateTime.fromISO(dateLiteral).toMillis();
    if (Number.isFinite(t)) return { pins, t };
  } catch (err) {}

  return { pins };
};
