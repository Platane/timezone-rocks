import { styled } from "@linaria/react";
import React from "react";
import { selectT, selectTWindow } from "../../store/selector";
import { useStore } from "../../store/store";
import { useSubscribe } from "../../store/useSubscribe";
import { accentColor } from "../theme";
import { Share } from "./Share/Share";
import { useWidth } from "./useWidth";

const { startDragDateCursor, endDragDateCursor } = useStore.getState();

export const DateSliderRange = () => {
  const tWindow = useStore(selectTWindow);
  const now = useStore((s) => s.now);

  const width = useWidth();

  const toScreenSpace = React.useCallback(
    (t: number) => ((t - tWindow[0]) / (tWindow[1] - tWindow[0])) * width,
    [tWindow[0], tWindow[1], width]
  );

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const shareRef = React.useRef<HTMLDivElement | null>(null);

  useSubscribe(
    (t) => {
      const input = inputRef.current;
      if (!input) return;

      input.value = t + "";

      //
      const k = (+input.value - +input.min) / (+input.max - +input.min);
      const x = input.clientLeft + (input.clientWidth - caretWidth) * k;

      if (shareRef.current)
        shareRef.current.style.setProperty("transform", `translateX(${x}px)`);
    },
    selectT,
    [tWindow]
  );

  const step = 15 * 60 * 1000; // 15 minutes

  return (
    <Container>
      <NowButton
        title="Reset to now"
        onClick={() => useStore.setState({ t: now })}
        style={{ transform: `translateX(${toScreenSpace(now)}px)` }}
      >
        <NowCaret />
        <NowLabel>now</NowLabel>
      </NowButton>

      <InputRange
        ref={inputRef}
        type="range"
        step={step}
        min={tWindow[0]}
        max={tWindow[1]}
        defaultValue={now}
        onFocus={() => startDragDateCursor()}
        onBlur={() => endDragDateCursor()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          useStore.setState({ t: +e.target.value });
        }}
      />

      <ShareContainer ref={shareRef}>
        <Share />
      </ShareContainer>
    </Container>
  );
};

const caretWidth = 40;
const InputRange = styled.input<any>`

  --caret-width: ${caretWidth}px;
  --caret-height: 32px;

    appearance: none;
   background: transparent;
   cursor: pointer;

   background-color: #ddd4;

   touch-action: pan-x;

   position: relative;
   left: calc( -1 * var(--caret-width) / 2);
   width: calc( 100vw + var(--caret-width) );
   min-width: calc( 100vw + var(--caret-width) ); // otherwise the flexbox don't want with>100% (??)
   border: none;
   margin: 0;
   height: 32px;

  &::-webkit-slider-thumb {
    appearance: none;
    background: ${accentColor};
    border: none;
    width: var( --caret-width );
    height: var(--caret-height);
    border-radius: 2px;
  }

  &::-moz-range-thumb {
    appearance: none;
    background: ${accentColor};
    border: none;
    width: var( --caret-width );
    height: var(--caret-height);
    border-radius: 2px;
  }

  color:white; // for the focus ring color

    &:focus-visible,&:focus {
      outline: none;

      &::-webkit-slider-thumb  {
        outline: -webkit-focus-ring-color auto 1px;
        outline-offset: 2px;
      }

      &::-moz-range-thumb {
        outline: Highlight auto 1px;
        outline-offset: 2px;
      }
    }

`;

const Container = styled.div`
  overflow: hidden;
  position: relative;
  padding-top: 22px;
  padding-bottom: 4px; // for the focus ring
  width: 100%;
  display:flex;
`;
const nowColor = "#ddd";

const ShareContainer = styled.div`
  position: absolute;
  top: 22px;
  left: 28px;
  height: 32px;
  user-select: none;
`;

const NowButton = styled.div`
  top: 0px;
  position: absolute;
`;

const NowCaret = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 8px 6px 2px 6px;
  left: -${16 / 2}px;
  top: 0px;
  background-color: ${nowColor};
  position: absolute;
  transform: rotate(45deg);
`;

const NowLabel = styled.div`
  color: ${nowColor};
  margin-left: 10px;
`;
