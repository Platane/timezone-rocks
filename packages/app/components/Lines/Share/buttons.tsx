import React from "react";
import s from "./buttons.module.css";

export const Button = ({ className, ...props }: React.ComponentProps<"a">) => (
  <a {...props} className={`${s.button} ${className ?? ""}`} />
);

export const appearAnimation = s.appearAnimation;
export const disappearAnimation = s.disappearAnimation;
