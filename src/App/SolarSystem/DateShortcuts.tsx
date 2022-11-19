import { useStore } from "../store/store";
import { DateTime } from "luxon";
import { location0 } from "./location0";
import { sunRises } from "./location0-sunRises";

export const DateShortcuts = () => {
  const setTWindowOrigin = useStore((s) => s.setTWindowOrigin);
  const currentDate = useStore((s) =>
    DateTime.fromMillis(s.t, { zone: location0.timezone })
      .toISODate()
      .slice(0, 10)
  );

  const currentS = sunRises.find(({ date }) => date === currentDate)!;

  return (
    <>
      <button
        style={{ width: "70px" }}
        onClick={() =>
          setTWindowOrigin(
            DateTime.fromISO(currentDate + "T" + currentS.sunRise, {
              zone: location0.timezone,
            }).toMillis()
          )
        }
      >
        🌅 {currentS?.sunRise}
      </button>
      <button
        onClick={() =>
          setTWindowOrigin(
            (DateTime.fromISO(currentDate + "T" + currentS.sunRise, {
              zone: location0.timezone,
            }).toMillis() +
              DateTime.fromISO(currentDate + "T" + currentS.sunSet, {
                zone: location0.timezone,
              }).toMillis()) /
              2
          )
        }
      >
        ☀️
      </button>
      <button
        style={{ width: "70px" }}
        onClick={() =>
          setTWindowOrigin(
            DateTime.fromISO(currentDate + "T" + currentS.sunSet, {
              zone: location0.timezone,
            }).toMillis()
          )
        }
      >
        🌇 {currentS?.sunSet}
      </button>
      <button
        onClick={() =>
          setTWindowOrigin(DateTime.fromISO("2022-03-20T15:33:23").toMillis())
        }
      >
        march equinox
      </button>
      <button
        onClick={() =>
          setTWindowOrigin(DateTime.fromISO("2022-06-21T09:13:49").toMillis())
        }
      >
        june solstice
      </button>
      <button
        onClick={() =>
          setTWindowOrigin(DateTime.fromISO("2022-09-23T01:03:40").toMillis())
        }
      >
        sept equinox
      </button>
      <button
        onClick={() =>
          setTWindowOrigin(DateTime.fromISO("2022-12-21T21:48:10").toMillis())
        }
      >
        dec solstice
      </button>
      0
      <input
        type="range"
        min={0}
        max={12}
        step={0.05}
        style={{ width: 300 }}
        onChange={(e) => {
          const m = +e.target.value;

          const a = DateTime.fromISO(`2022-01-01T00:00:00`, {
            zone: location0.timezone,
          }).toMillis();
          const b =
            DateTime.fromISO(`2023-01-01T00:00:00`, {
              zone: location0.timezone,
            }).toMillis() - 1000;
          const t = a + (b - a) * (m / 12);

          const date = DateTime.fromMillis(t, { zone: location0.timezone })
            .toISODate()
            .slice(0, 10);
          const { sunRise, sunSet } = sunRises.find((s) => s.date === date)!;

          const midday =
            (DateTime.fromISO(date + "T" + sunRise, {
              zone: location0.timezone,
            }).toMillis() +
              DateTime.fromISO(date + "T" + sunSet, {
                zone: location0.timezone,
              }).toMillis()) /
            2;

          setTWindowOrigin(midday);
          // setTWindowOrigin(
          //   DateTime.fromISO(date + "T" + ss.sunSet, {
          //     zone: location0.timezone,
          //   }).toMillis()
          // );
        }}
      />
    </>
  );
};

const midday = (d: string) => {
  const { sunRise, sunSet } = sunRises.find(({ date }) => date === d)!;

  return (
    (DateTime.fromISO(d + "T" + sunRise, {
      zone: location0.timezone,
    }).toMillis() +
      DateTime.fromISO(d + "T" + sunSet, {
        zone: location0.timezone,
      }).toMillis()) /
    2
  );
};
