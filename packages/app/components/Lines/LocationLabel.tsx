import type { ILocation } from "@tzr/location-index";
import { getFlagEmoji } from "../../flags/emoji";
import { formatOffset } from "../../intl/format";
import { useStore } from "../../store/store";
import { stringify } from "../../store/utils-stringify";
import { getTimezoneOffset } from "../../timezone/timezone";
import s from "./LocationLabel.module.css";

type Props = { location: ILocation; locations: ILocation[] };
export const LocationLabel = ({ location, locations }: Props) => {
  const selectLocation = useStore((s) => s.selectLocation);
  const selectedLocation = useStore((s) => s.selectedLocation?.[0]);
  const removeLocation = useStore((s) => s.removeLocation);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        selectLocation(location);
      }}
      className={
        selectedLocation === location
          ? `${s.container} ${s.locationLabelSelected}`
          : s.container
      }
    >
      <label className={s.name} htmlFor={`location-item-${location.key}`}>
        {location.name}
      </label>

      <span className={s.flag}>
        {location.countryCode ? getFlagEmoji(location.countryCode) : ""}
      </span>

      <span className={s.offset} />

      <a
        className={s.removeButton}
        role="button"
        aria-label="remove location"
        href={
          "#" +
          stringify({
            locations: locations.filter((l) => l.key !== location.key),
          })
        }
        title="remove location"
        onClick={(e) => {
          e.preventDefault();
          removeLocation(location);
        }}
      >
        ×
      </a>
    </div>
  );
};

export const update = (
  domElement: Element,
  { location, t }: { location: ILocation; t: number }
) => {
  domElement.children[2].innerHTML = formatOffset(
    getTimezoneOffset(location.timezone, t)
  );
};
