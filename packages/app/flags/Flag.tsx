import React from "react";
import flagsSprite from "./flags.svg";

/**
 * Renders a country flag from the sprite sheet (see buildSprite.ts).
 * Size it with css `width` on the svg; height follows the 3x2 aspect ratio.
 */
export const Flag = ({
  countryCode,
  ...props
}: { countryCode: string } & React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 513 342" {...props}>
    <use href={`${flagsSprite}#${countryCode.toUpperCase()}`} />
  </svg>
);
