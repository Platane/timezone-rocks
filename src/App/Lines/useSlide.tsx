import { useCallback, useEffect, useRef } from "react";

const isTouchEventSupported = "ontouchend" in document;

export const useSlide = (onChange: (x: number) => void) => {
  const containerRef = useRef<HTMLElement | null>();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  if (isTouchEventSupported) {
    const onTouchMove = useCallback((event) => {
      const {
        currentTarget,
        touches: [{ clientX }],
      } = event;

      const { width, left } = currentTarget.getBoundingClientRect();

      onChangeRef.current?.((clientX - left) / width);
    }, []);

    return {
      onTouchStart: onTouchMove,
      onTouchMove,
    };
  } else {
    const onPointerUp = useCallback(() => {
      document.body.removeEventListener("pointermove", onPointerMove);
      document.body.removeEventListener("pointerup", onPointerUp);
    }, []);
    const onPointerMove = useCallback(({ clientX }) => {
      if (!containerRef.current) return;

      const { width, left } = containerRef.current.getBoundingClientRect();

      onChangeRef.current?.((clientX - left) / width);
    }, []);
    const onPointerDown = useCallback(
      (e) => {
        containerRef.current = e.currentTarget;
        onPointerMove(e);

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
