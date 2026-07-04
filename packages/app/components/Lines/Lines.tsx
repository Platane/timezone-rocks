import React from "react";
import { selectLocations, selectT, selectTWindow } from "../../store/selector";
import { useStore } from "../../store/store";
import { useSubscribe } from "../../store/useSubscribe";
import { getBlocks } from "../../timezone/interval";
import { DateSliderRange } from "./DateSliderRange";
import { FlyingLabel, update as updateFlyingLabel } from "./FlyingLabel";
import { LocationLabel, update as updateLocationLabel } from "./LocationLabel";
import { useWidth } from "./useWidth";
import s from "./Lines.module.css";

export const Lines = () => {
  const locations = useStore(selectLocations);
  const tWindow = useStore(selectTWindow);
  const selectLocation = useStore((s) => s.selectLocation);
  const width = useWidth();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const toScreenSpace = React.useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow[0], tWindow[1], width]
  );

  const blocks = React.useMemo(
    () => locations.map((location) => getBlocks(location.timezone, tWindow)),
    [tWindow, locations]
  );

  useSubscribe(
    (t) => {
      const container = ref.current;

      if (!container) return;

      const x = toScreenSpace(t);

      const cursorArm = container.children[0] as HTMLElement;
      cursorArm.style.transform = `translateX(${x}px)`;

      locations.forEach((location, i) => {
        const locationLabel = container.children[1 + i * 2] as HTMLElement;
        updateLocationLabel(locationLabel, { location, t });

        const row = container.children[2 + i * 2] as HTMLElement;

        const flyingLabel = row.children[0] as HTMLElement;
        flyingLabel.style.transform = `translateX(${x + 2}px)`;
        updateFlyingLabel(flyingLabel, { location, t });

        for (let j = 0; j < blocks[i].length; j++) {
          const primary = blocks[i][j].day[0] <= t && t <= blocks[i][j].day[1];

          for (let k = 3; k--; )
            row.children[1 + j * 3 + k].classList[primary ? "add" : "remove"](
              s.primary
            );
        }
      });
    },
    selectT,
    [locations, toScreenSpace, blocks]
  );

  return (
    <>
      <DateSliderRange />

      <div className={s.container} role="list" ref={ref}>
        <div className={s.cursorArm} />

        {locations.map((location, i) => (
          <React.Fragment key={location.key}>
            <LocationLabel location={location} locations={locations} />

            <div
              className={s.row}
              role="listitem"
              id={`location-item-${location.key}`}
              onClick={() => selectLocation(location)}
            >
              <FlyingLabel data-test-id="flying-date" />

              {blocks[i].map(({ day, awake, office }, i) => (
                <React.Fragment key={i}>
                  <div
                    className={`${s.block} ${s.dayBlock}`}
                    style={toPosition(toScreenSpace, day, 2)}
                  />
                  <div
                    className={`${s.block} ${s.awakeBlock}`}
                    style={toPosition(toScreenSpace, awake)}
                  />
                  <div
                    className={`${s.block} ${s.officeBlock}`}
                    style={toPosition(toScreenSpace, office)}
                  />
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const toPosition = (
  toScreenSpace: (x: number) => number,
  [a, b]: [number, number],
  margin = 0
) => {
  const sa = toScreenSpace(a) + margin;
  const sb = toScreenSpace(b) - margin;

  return { left: sa + "px", right: sb + "px", width: sb - sa + "px" };
};
