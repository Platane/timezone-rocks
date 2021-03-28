import { styled } from "@linaria/react";
import React from "react";
import { useSlide } from "./useSlide";
import { useStore } from "../store/store";

const setT = (x: number) => {
  const {
    setT,
    tWindow: [a, b],
  } = useStore.getState();
  const t = a + (b - a) * x;
  setT(t);
};
const setRoundedT = (x: number) => {
  const r = 5 * 60 * 1000;
  const {
    setT,
    tWindow: [a, b],
  } = useStore.getState();
  const t = a + (b - a) * x;
  setT(Math.floor(t / r) * r);
};

export const CursorLine = () => {
  const bind = useSlide(setT, setRoundedT);

  return (
    <CursorContainer {...bind}>
      <Cursor />
    </CursorContainer>
  );
};

const CursorContainer = styled.div`
  background-color: #ddd4;
  height: 24px;
  width: 100%;

  cursor: pointer;
`;

const Cursor = styled.div`
  position: absolute;
  width: 32px;
  height: 24px;
  border-radius: 2px;
  background-color: #e88a28;
  left: -${32 / 2}px;
  pointer-events: none;
`;

export const CursorArm = styled.div`
  position: absolute;
  width: 2px;
  height: calc(100% + 14px);
  background-color: #e88a28;
  left: -1px;
  top: 0;
  z-index: 2;
  pointer-events: none;
`;
