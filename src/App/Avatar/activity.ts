import { AWAKE_HOURS, OFFICE_HOURS } from "../../timezone/interval";

export const getActivity = (hour: number) =>
  (hour < AWAKE_HOURS[0] && "😴") ||
  (hour < OFFICE_HOURS[0] && `☕️`) ||
  (hour < OFFICE_HOURS[1] && `👨‍💻`) ||
  (hour < AWAKE_HOURS[1] && "🍻") ||
  "😴";
