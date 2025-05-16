import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import type { ILocation } from "@tzr/location-index";
import React from "react";
import { getFlagEmoji } from "../../flags/emoji";
import { formatOffset } from "../../intl/format";
import { useStore } from "../../store/store";
import { stringify } from "../../store/utils-stringify";
import { getTimezoneOffset } from "../../timezone/timezone";

type Props = { location: ILocation; locations: ILocation[] };
export const LocationLabel = ({ location, locations }: Props) => {
  const selectLocation = useStore((s) => s.selectLocation);
  const selectedLocation = useStore((s) => s.selectedLocation?.[0]);
  const removeLocation = useStore((s) => s.removeLocation);

  return (
    <Container
      onClick={(e) => {
        e.preventDefault();
        selectLocation(location);
      }}
      className={
        selectedLocation === location ? locationLabelSelected : undefined
      }
    >
      <Name htmlFor={`location-item-${location.key}`}>{location.name}</Name>

      <Flag>
        {location.countryCode ? getFlagEmoji(location.countryCode) : ""}
      </Flag>

      <Offset />

      <RemoveButton
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
      </RemoveButton>
    </Container>
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

const Container = styled.div`
  display: inline-block;
  text-shadow: 0 0 2px #000;
  font-size: 1.06em;
  color: #fff;
  padding: 0 16px;
  margin-top: 18px;
  position: relative;
  z-index: 2;
  cursor: pointer;
`;
const locationLabelSelected = css`
  /* color: orange; */
`;
const Flag = styled.span`
  display: inline-block;
  margin-top: auto;
  font-size: 12px;
  margin-left: 8px;
`;
const Name = styled.label`
  display: inline-block;
`;
const Offset = styled.span`
  margin-left: 6px;
  font-family: monospace;
  font-size: 0.85em;
  margin-top: auto;
`;

const RemoveButton = styled.a`
  display: inline-block;
  margin-left: 6px;
  color: inherit;
  text-decoration: none;
  padding: 0 4px;
`;
