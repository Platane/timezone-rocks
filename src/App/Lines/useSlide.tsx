import { useCallback, useEffect, useRef } from "react";

const isTouchEventSupported = "ontouchend" in document;

export const useSlide = (
  onChange: (x: number) => void,
  onDefinitiveChange?: (x: number) => void
) => {
  const containerRef = useRef<HTMLElement | null>();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onDefinitiveChangeRef = useRef(onDefinitiveChange);
  onDefinitiveChangeRef.current = onDefinitiveChange;

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
    const onTouchEnd = useCallback(() => {
      onDefinitiveChangeRef.current?.(xRef.current);
    }, []);

    return {
      onTouchStart: onTouchMove,
      onTouchMove,
      onTouchEnd,
    };
  } else {
    const onPointerUp = useCallback(({ clientX }) => {
      document.body.removeEventListener("pointermove", onPointerMove);
      document.body.removeEventListener("pointerup", onPointerUp);

      if (!containerRef.current) return;

      const { width, left } = containerRef.current.getBoundingClientRect();

      onDefinitiveChangeRef.current?.((clientX - left) / width);
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
