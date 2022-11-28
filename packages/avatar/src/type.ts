export type Pose = "afternoon" | "day" | "night" | "morning";
export type Props = {
  className?: string;
  style?: any;

  transform?: string;
  pose: Pose;

  color?: string;
  colorDark?: string;
};
