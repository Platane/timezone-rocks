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
  const selectedLocation = useStore((s) => s.selectedLocation);
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

        renderLabel(el, locations[i], selectedLocation === locations[i], t);

        el.style.opacity = ready ? "1" : "0";
      }

      for (; i < elementPool.current.length; i++) {
        const el = elementPool.current[i];
        if (el.parentElement) el.parentElement.removeChild(el);
      }
      elementPool.current.length = locations.length;
    },
    (s) => s.t,
    [locations, selectedLocation, ready]
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
  el.style.position = "absolute";
  el.style.left = "-10px";
  el.style.top = "-10px";
  el.style.height = "20px";
  el.style.zIndex = "10";
  el.style.transition = "opacity 200ms";
  el.style.pointerEvents = "none";
  el.style.fontFamily = "monospace";
  el.style.textShadow = "0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1)";

  return el;
};

const renderLabel = (
  el: HTMLElement,
  location: Location,
  selected: boolean,
  t: number
) => {
  const flag = getFlagEmoji(location.countryCode);
  const date = getDate(location.timezone, t);
  const hour = formatTime(date.hour);
  const activity = getActivity(date.hour);
  el.innerText = `${activity} ${hour}`;
  el.style.color = selected ? "orange" : "#fff";
};
