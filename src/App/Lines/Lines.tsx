import { styled } from "@linaria/react";
import React, { useCallback, useMemo, useRef } from "react";
import { useStore } from "../store/store";
import { selectLocations, selectT, selectTWindow } from "../store/selector";
import { useSubscribe } from "../store/useSubscribe";
import { getBlocks } from "../../timezone/interval";
import { LocationLabel, update as updateLocationLabel } from "./LocationLabel";
import { FlyingLabel, update as updateFlyingLabel } from "./FlyingLabel";
import { useWidth } from "./useWidth";
import { DateSlider } from "./DateSlider";
import { accentColor } from "../theme";

export const Lines = () => {
  return (
    <>
      <DateSlider />
    </>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 220px;
  padding-bottom: 24px;
`;

const toPosition = (
  toScreenSpace: (x: number) => number,
  [a, b]: [number, number],
  margin = 0
) => {
  const sa = toScreenSpace(a) + margin;
  const sb = toScreenSpace(b) - margin;

  return { left: sa + "px", right: sb + "px", width: sb - sa + "px" };
};

const Row = styled.div`
  height: 32px;
  overflow: hidden;
  position: relative;
`;

const Block = styled.div`
  position: absolute;
  border-radius: 4px;
  transition: filter 100ms;
`;

const DayBlock = styled(Block)`
  height: 24px;
  top: 4px;

  height: 30px;
  top: 1px;

  background-color: #aaa6;
  margin-bottom: 4px;
`;
const AwakeBlock = styled(Block)`
  height: 30px;
  top: 1px;
  transition: background-color 200ms;
  background-color: #8e928b;
  &.primary {
    background-color: #86a45d;
    /* box-shadow: 0 0 0 1px orange; */
  }
`;
const OfficeBlock = styled(Block)`
  height: 30px;
  top: 1px;
  border-radius: 0px;
  transition: background-color 200ms;
  background-color: #848881;
  &.primary {
    background-color: #7d9c56;
  }
`;

export const CursorArm = styled.div`
  position: absolute;
  width: 2px;
  height: calc(100% + 14px);
  background-color: ${accentColor};
  left: -1px;
  top: -4px;
  z-index: 2;
  pointer-events: none;
`;
