import {
  arrayBufferTob64,
  b64ToArrayBuffer,
  get,
  set,
} from "../../utils-arraybuffer";
import { limit as MAX_VALUE } from "../../locations/generate/options";

const n = Math.ceil(Math.log(MAX_VALUE) / Math.log(2));

/**
 * stringify array of number as base64
 * assuming number in array are inside [0, MAX_VALUE]
 */
export const pack = (elements: number[]) => {
  const arr = new Uint8Array(Math.ceil((elements.length * n) / 8));
  elements.forEach((value, i) => set(arr, n, i, value + 1));
  return arrayBufferTob64(arr);
};

export const unpack = (s: string) => {
  const elements: number[] = [];
  const arr = b64ToArrayBuffer(s);
  for (let v = 0, i = 0; (v = get(arr, n, i)) !== 0; i++) elements.push(v - 1);
  return elements;
};
