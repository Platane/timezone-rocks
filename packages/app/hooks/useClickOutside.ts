import * as React from "react";

export const useClickOutside = (onClickOutside?: () => void) => {
  const [className] = React.useState(generateClassName);
  const ref = React.useRef(onClickOutside);
  ref.current = onClickOutside;

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement | null)?.closest("." + className))
        ref.current?.();
    };

    document.body.addEventListener("click", onClick);
    return () => document.body.removeEventListener("click", onClick);
  }, [className]);

  return { className };
};

const generateClassName = () => "inside-" + Math.random().toString(36).slice(2);
