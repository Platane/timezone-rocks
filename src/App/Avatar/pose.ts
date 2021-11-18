import { AWAKE_HOURS, OFFICE_HOURS } from "../../timezone/interval";
import { Pose } from "./type";

export const getPoseAtHour = (hour: number): Pose =>
  (hour < AWAKE_HOURS[0] && "night") ||
  (hour < OFFICE_HOURS[0] && "morning") ||
  (hour < OFFICE_HOURS[1] && "day") ||
  (hour < AWAKE_HOURS[1] && "afternoon") ||
  "night";
