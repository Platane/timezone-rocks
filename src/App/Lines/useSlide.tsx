import { useCallback, useEffect, useRef } from "react";

export const useSlide = (onChange: (x: number) => void) => {
  const containerRef = useRef<HTMLElement | null>();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

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
};
