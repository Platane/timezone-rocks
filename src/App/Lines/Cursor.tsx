import { styled } from "@linaria/react";
import React, { useRef } from "react";
import { useSlide } from "./useSlide";
import { useStore } from "../store/store";
import { useSubscribe } from "../store/useSubscribe";
import { projectDate } from "../store/selector";

const setT = (x: number) => {
  const {
    setT,
    tWindow: [a, b],
  } = useStore.getState();
  setT(a + (b - a) * x);
};

export const CursorLine = () => {
  const ref = useRef<HTMLElement | undefined>(undefined);
  useSubscribe(
    (x: number) => {
      if (!ref.current) return;
      ref.current.style.transform = `translateX(${window.innerWidth * x}px)`;
    },
    (s) => projectDate(s, s.t)
  );

  const bind = useSlide(setT);

  return (
    <CursorContainer {...bind}>
      <Cursor ref={ref as any} />
    </CursorContainer>
  );
};

export const CursorArm = () => {
  const ref = useRef<HTMLElement | undefined>(undefined);
  useSubscribe(
    (x: number) => {
      if (!ref.current) return;
      ref.current.style.transform = `translateX(${window.innerWidth * x}px)`;
    },
    (s) => projectDate(s, s.t)
  );

  return <CursorArmContainer ref={ref as any} />;
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
  background-color: lightgreen;
  left: -${32 / 2}px;
  pointer-events: none;
`;

const CursorArmContainer = styled.div`
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: lightgreen;
  left: -1px;
  top: 0;
  z-index: 2;
  pointer-events: none;
`;
