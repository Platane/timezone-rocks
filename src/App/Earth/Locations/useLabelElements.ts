import { css } from "@linaria/core";
import { useEffect, useRef } from "react";
import { getFlagEmoji } from "../../../emojiFlagSequence";
import { Location } from "../../../locations";
import { useStore } from "../../store/store";
import { useSubscribe } from "../../store/useSubscribe";
import { getDate } from "../../../timezone/timezone";
import { formatTime } from "../../../intl-utils";
import { getActivity } from "../../Avatar/activity";

/**
 * create and update html element to serve as label
 */
export const useLabelElements = (domElement: HTMLElement) => {
  const locations = useStore((s) => s.locations);
  const ready = useStore((s) => s.earthReady && s.locationStoreReady);
  const elementPool = useRef<HTMLElement[]>([]);
  useSubscribe(
    (t: number) => {
      let i = 0;
      for (; i < locations.length; i++) {
        let el = elementPool.current[i];
        if (!el) {
          el = createLabel();

          if (domElement.parentElement)
            domElement.parentElement.appendChild(el);

          elementPool.current[i] = el;
        }

        renderLabel(el, locations[i], t);

        el.style.opacity = ready ? "1" : "0";
      }

      for (; i < elementPool.current.length; i++) {
        const el = elementPool.current[i];
        if (el.parentElement) el.parentElement.removeChild(el);
      }
      elementPool.current.length = locations.length;
    },
    (s) => s.t,
    [locations, ready]
  );
  useEffect(
    () => () => {
      elementPool.current.forEach((el) => {
        if (el.parentElement) el.parentElement.removeChild(el);
      });
    },
    []
  );

  return elementPool;
};

const createLabel = () => {
  const el = document.createElement("div");
  el.classList.add(labelCss);
  return el;
};

export const labelBox = {
  min: { x: -20, y: -9 },
  max: { x: 90, y: 9 },
};

const labelCss = css`
  position: absolute;

  left: ${labelBox.min.x}px;
  top: ${labelBox.min.y}px;
  height: ${labelBox.max.y - labelBox.min.y}px;
  width: ${labelBox.max.x - labelBox.min.x}px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  color: #fff;
  font-family: monospace;
  font-size: 0.92em;
  text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);

  /* box-shadow: 0 0 0 1px orange; */

  pointer-events: none;
  transition: opacity 200ms;
`;

const renderLabel = (el: HTMLElement, location: Location, t: number) => {
  const flag = getFlagEmoji(location.countryCode);
  const date = getDate(location.timezone, t);
  const hour = formatTime(date.hour);
  const activity = getActivity(date.hour);
  el.innerText = `${activity} ${hour}`;
};
