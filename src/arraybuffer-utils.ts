import { encode, decode } from "base-64";

/**
 * set the value of the i-nth element
 * in the Uint8Array containing value of n bits
 */
export const set = (arr: Uint8Array, n: number, i: number, value: number) => {
  for (let u = 0; u < n; u++) {
    const k = i * n + u;
    arr[Math.floor(k / 8)] += +!!(value & (1 << u)) * (1 << k % 8);
  }
};

/**
 * get the value of the i-nth element
 * in the Uint8Array containing value of n bits
 */
export const get = (arr: Uint8Array, n: number, i: number) => {
  let v = 0;
  for (let u = 0; u < n; u++) {
    const k = i * n + u;
    v += +!!((arr[Math.floor(k / 8)] || 0) & (1 << k % 8)) * (1 << u);
  }
  return v;
};

export const arrayBufferTob64 = (arr: Uint8Array) =>
  encode(arr.reduce((s, byte) => s + String.fromCharCode(byte), ""));

export const b64ToArrayBuffer = (s: string) => {
  const e = decode(s);
  const arr = new Uint8Array(e.length);
  for (let i = 0; i < e.length; i++) arr[i] = e.charCodeAt(i);
  return arr;
};
