import { useEffect, useState } from "react";

/**
 *
 */
export const useClickOutside = (onClickOutside?: () => void) => {
  const [className] = useState(Math.random().toString(36));
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ancestorContainsClassName(e.target as any, className))
        onClickOutside?.();
    };
    document.body.addEventListener("click", onClick);
    return () => {
      document.body.removeEventListener("click", onClick);
    };
  }, [className, onClickOutside]);

  return { className };
};

/**
 * return true is the element or any of it's ancestors contains the className
 */
const ancestorContainsClassName = (
  el: HTMLElement | null,
  className: string
): boolean => {
  if (!el?.classList) return false;
  if (el.classList.contains(className)) return true;
  return ancestorContainsClassName(el.parentElement, className);
};
