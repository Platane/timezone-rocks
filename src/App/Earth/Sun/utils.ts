import { createGetSunDirection } from "./__tests__/createGetSunDirection";

/**
 * get the sun direction from the earth point of view
 * @param timestamp unix timestamp (in ms)
 *
 * ⚠ likely not astronomically accurate
 */
export const getSunDirection = createGetSunDirection([
  0.38790391277557745, 0.49780801115685747, 0.6193269140271598,
  0.7902493904198362,
]);
