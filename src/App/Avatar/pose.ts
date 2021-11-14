import { AWAKE_HOURS, OFFICE_HOURS } from "../../timezone/interval";

export const getPoseAtHour = (hour: number) =>
  (hour < AWAKE_HOURS[0] && "sleep") ||
  (hour < OFFICE_HOURS[0] && "morning") ||
  (hour < OFFICE_HOURS[1] && "day") ||
  (hour < AWAKE_HOURS[1] && "afternoon") ||
  "sleep";
