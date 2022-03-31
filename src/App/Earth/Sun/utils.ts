import { createGetSunDirection } from "./__tests__/createGetSunDirection";

/**
 * get the sun direction from the earth point of view
 * @param timestamp unix timestamp (in ms)
 *
 * ⚠ likely not astronomically accurate
 */
export const getSunDirection = createGetSunDirection([
  0.7879023868527586, 0.07575636280327025, 0.7799648489722575,
]);
