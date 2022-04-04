import { createGetSunDirection } from "./__tests__/createGetSunDirection";

/**
 * get the sun direction from the earth point of view
 * @param timestamp unix timestamp (in ms)
 *
 * ⚠ likely not astronomically accurate
 */
export const getSunDirection = createGetSunDirection([
  0.28665286245723853, 31558149763.5456,
]);
