import { Pose } from "./Avatar/type";

export const CheapAvatar = ({ pose }: { pose: Pose }) => {
  const emoji =
    (pose === "night" && "😴") ||
    (pose === "morning" && `☕️`) ||
    (pose === "day" && `👨‍💻`) ||
    (pose === "afternoon" && "🍻") ||
    "😴";

  return <span>{emoji}</span>;
};
