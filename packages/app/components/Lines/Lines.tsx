import React from "react";
import { selectPin } from "../../store/mutators";
import { selectPins, selectT, selectTWindow } from "../../store/selectors";
import { useValue } from "../../store/hooks";
import type { Store } from "../../store/store";
import { getBlocks } from "../../timezone/interval";
import { DateSliderRange } from "./DateSliderRange";
import { FlyingLabel } from "./FlyingLabel";
import { LocationLabel } from "./LocationLabel";
import s from "./Lines.module.css";

export const Lines = ({ store }: { store: Store }) => {
  const pins = useValue(store, selectPins);
  const tWindow = useValue(store, selectTWindow);
  const t = useValue(store, selectT);

  const toRatio = (x: number) => (x - tWindow[0]) / (tWindow[1] - tWindow[0]);

  const blocks = React.useMemo(
    () => pins.map((pin) => getBlocks(pin.location.timezone, tWindow)),
    [tWindow, pins]
  );

  return (
    <>
      <DateSliderRange store={store} />

      <div className={s.container} role="list">
        <div
          className={s.cursorArm}
          style={{ left: `calc(${toRatio(t) * 100}% - 1px)` }}
        />

        {pins.map((pin, i) => (
          <React.Fragment key={pin.id}>
            <LocationLabel
              store={store}
              pin={pin}
              pins={pins}
              t={t}
              itemId={`location-item-${pin.id}`}
            />

            <div
              className={s.row}
              role="listitem"
              id={`location-item-${pin.id}`}
              onClick={() => store.setState(selectPin(pin))}
            >
              <FlyingLabel
                data-test-id="flying-date"
                location={pin.location}
                t={t}
                style={{ left: `calc(${toRatio(t) * 100}% + 2px)` }}
              />

              {blocks[i].map(({ day, awake, office }, j) => {
                const primary =
                  day[0] <= t && t <= day[1] ? ` ${s.primary}` : "";
                return (
                  <React.Fragment key={j}>
                    <div
                      className={`${s.block} ${s.dayBlock}`}
                      style={toStyle(toRatio, day, 2)}
                    />
                    <div
                      className={`${s.block} ${s.awakeBlock}${primary}`}
                      style={toStyle(toRatio, awake)}
                    />
                    <div
                      className={`${s.block} ${s.officeBlock}${primary}`}
                      style={toStyle(toRatio, office)}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const toStyle = (
  toRatio: (x: number) => number,
  [a, b]: [number, number],
  margin = 0
) => ({
  left: `calc(${toRatio(a) * 100}% + ${margin}px)`,
  right: `calc(${(1 - toRatio(b)) * 100}% + ${margin}px)`,
});
