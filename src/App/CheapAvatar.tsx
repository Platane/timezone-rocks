import { Pose } from "./Avatar/type";

export const CheapAvatar = ({
  style,
  className,
  pose,
}: {
  pose: Pose;
  style?: any;
  className?: string;
}) => {
  const emoji =
    (pose === "night" && "😴") ||
    (pose === "morning" && `☕️`) ||
    (pose === "day" && `👨‍💻`) ||
    (pose === "afternoon" && "🍻") ||
    "😴";

  return (
    <span style={style} className={className}>
      {emoji}
    </span>
  );
};
