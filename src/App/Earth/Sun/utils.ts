import { createGetSunDirection } from "./__tests__/createGetSunDirection";

/**
 * get the sun direction from the earth point of view
 * @param timestamp unix timestamp (in ms)
 *
 * ⚠ likely not astronomically accurate
 */
export const getSunDirection = createGetSunDirection([
  13.875722951785317, 7.046026446232912, 7.4410338760036545, -5.268040712609422,
]);
