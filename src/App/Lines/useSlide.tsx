import { useCallback, useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLElement | null>();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  if (isTouchEventSupported) {
    const xRef = useRef(0);

    const onTouchMove = useCallback(
      ({ currentTarget, touches: [{ clientX }] }) => {
        const { width, left } = currentTarget.getBoundingClientRect();

        const x = (clientX - left) / width;
        xRef.current = x;

        onChangeRef.current?.(x);
      },
      []
    );
    const onTouchStart = useCallback(
      ({ currentTarget, touches: [{ clientX }] }) => {
        const { width, left } = currentTarget.getBoundingClientRect();

        const x = (clientX - left) / width;
        xRef.current = x;

        onStartRef.current?.(x);
        onChangeRef.current?.(x);
      },
      []
    );
    const onTouchEnd = useCallback(() => {
      onEndRef.current?.(xRef.current);
    }, []);

    return {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  } else {
    const onPointerUp = useCallback(({ clientX }) => {
      document.body.removeEventListener("pointermove", onPointerMove);
      document.body.removeEventListener("pointerup", onPointerUp);

      if (!containerRef.current) return;

      const { width, left } = containerRef.current.getBoundingClientRect();

      onEndRef.current?.((clientX - left) / width);
    }, []);
    const onPointerMove = useCallback(({ clientX }) => {
      if (!containerRef.current) return;

      const { width, left } = containerRef.current.getBoundingClientRect();

      onChangeRef.current?.((clientX - left) / width);
    }, []);
    const onPointerDown = useCallback(
      ({ currentTarget, clientX }) => {
        containerRef.current = currentTarget;

        const { width, left } = containerRef.current!.getBoundingClientRect();

        const x = (clientX - left) / width;
        onStartRef.current?.(x);
        onChangeRef.current?.(x);

        document.body.addEventListener("pointermove", onPointerMove);
        document.body.addEventListener("pointerup", onPointerUp);
      },
      [onPointerMove]
    );

    useEffect(() => {
      return () => {
        document.body.removeEventListener("pointermove", onPointerMove);
        document.body.removeEventListener("pointerup", onPointerUp);
      };
    }, []);
    return { onPointerDown };
  }
};
