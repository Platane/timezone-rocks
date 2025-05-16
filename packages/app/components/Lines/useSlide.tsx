import React from "react";

const isTouchEventSupported = "ontouchend" in document;

export const useSlide = ({
  onChange,
  onStart,
  onEnd,
}: {
  onChange?: (x: number) => void;
  onStart?: (x: number) => void;
  onEnd?: (x: number) => void;
}) => {
  const containerRef = React.useRef<HTMLElement | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const onStartRef = React.useRef(onStart);
  onStartRef.current = onStart;
  const onEndRef = React.useRef(onEnd);
  onEndRef.current = onEnd;

  if (isTouchEventSupported) {
    const xRef = React.useRef(0);

    const onTouchMove = React.useCallback(
      ({ currentTarget, touches }: TouchEvent | React.TouchEvent) => {
        const { clientX } = touches[0];

        const { width, left } = (
          currentTarget as HTMLElement
        ).getBoundingClientRect();

        const x = (clientX - left) / width;
        xRef.current = x;

        onChangeRef.current?.(x);
      },
      []
    );
    const onTouchStart = React.useCallback(
      ({ currentTarget, touches }: TouchEvent | React.TouchEvent) => {
        const { clientX } = touches[0];
        const { width, left } = (
          currentTarget as HTMLElement
        ).getBoundingClientRect();

        const x = (clientX - left) / width;
        xRef.current = x;

        onStartRef.current?.(x);
        onChangeRef.current?.(x);
      },
      []
    );
    const onTouchEnd = React.useCallback(() => {
      onEndRef.current?.(xRef.current);
    }, []);

    return {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  } else {
    const onPointerUp = React.useCallback(
      ({ clientX }: PointerEvent | React.PointerEvent) => {
        document.body.removeEventListener("pointermove", onPointerMove);
        document.body.removeEventListener("pointerup", onPointerUp);

        if (!containerRef.current) return;

        const { width, left } = containerRef.current.getBoundingClientRect();

        onEndRef.current?.((clientX - left) / width);
      },
      []
    );
    const onPointerMove = React.useCallback(
      ({ clientX }: PointerEvent | React.PointerEvent) => {
        if (!containerRef.current) return;

        const { width, left } = containerRef.current.getBoundingClientRect();

        onChangeRef.current?.((clientX - left) / width);
      },
      []
    );
    const onPointerDown = React.useCallback(
      ({ currentTarget, clientX }: PointerEvent | React.PointerEvent) => {
        containerRef.current = currentTarget as HTMLElement;

        const { width, left } = containerRef.current!.getBoundingClientRect();

        const x = (clientX - left) / width;
        onStartRef.current?.(x);
        onChangeRef.current?.(x);

        document.body.addEventListener("pointermove", onPointerMove);
        document.body.addEventListener("pointerup", onPointerUp);
      },
      [onPointerMove]
    );

    React.useEffect(
      () => () => {
        document.body.removeEventListener("pointermove", onPointerMove);
        document.body.removeEventListener("pointerup", onPointerUp);
      },
      []
    );
    return { onPointerDown };
  }
};
