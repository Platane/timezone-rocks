import { Pose } from "@tzr/avatar";
import React from "react";

export const CheapAvatar = ({
  pose,
  ...props
}: {
  pose: Pose;
} & React.ComponentProps<"span">) => {
  const emoji =
    (pose === "night" && "😴") ||
    (pose === "morning" && `☕️`) ||
    (pose === "day" && `👨‍💻`) ||
    (pose === "afternoon" && "🍻") ||
    "😴";

  return <span {...props}>{emoji}</span>;
};
