import React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { useStore } from "../store/store";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { Location } from "../../locations";

type Props = { location: Location };
export const LocationLabel = ({ location }: Props) => {
  const selectLocation = useStore((s) => s.selectLocation);
  const selectedLocation = useStore((s) => s.selectedLocation);
  const removeLocation = useStore((s) => s.removeLocation);

  return (
    <Container
      onClick={() => selectLocation(location)}
      className={
        selectedLocation === location ? locationLabelSelected : undefined
      }
    >
      <Name>{location.name}</Name>
      <Flag>{getFlagEmoji(location.countryCode)}</Flag>
      <Offset></Offset>

      <RemoveButton
        href="#"
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

const Container = styled.div`
  text-shadow: 0 0 2px #000;
  font-size: 1.06em;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  margin-top: 14px;
  position: relative;
  z-index: 2;
  cursor: pointer;
`;
const locationLabelSelected = css`
  color: orange;
`;
const Flag = styled.span`
  display: inline-block;
  margin-top: auto;
  font-size: 12px;
  margin-left: 8px;
`;
const Name = styled.span`
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
