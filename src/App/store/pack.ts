import { encode, decode } from "base-64";

export const MAX_VALUE = (1 << 12) - 1;
const n = Math.ceil(Math.log(MAX_VALUE) / Math.log(2));

/**
 * set the value of the i-nth element
 * in the Uint8Array containing value of n bits
 */
const set = (arr: Uint8Array, n: number, i: number, value: number) => {
  for (let u = 0; u < n; u++) {
    const k = i * n + u;
    arr[Math.floor(k / 8)] += +!!(value & (1 << u)) * (1 << k % 8);
  }
};

/**
 * get the value of the i-nth element
 * in the Uint8Array containing value of n bits
 */
const get = (arr: Uint8Array, n: number, i: number) => {
  let v = 0;
  for (let u = 0; u < n; u++) {
    const k = i * n + u;
    v += +!!((arr[Math.floor(k / 8)] || 0) & (1 << k % 8)) * (1 << u);
  }
  return v;
};

const arrayBufferTob64 = (arr: Uint8Array) =>
  encode(arr.reduce((s, byte) => s + String.fromCharCode(byte), ""));

const b64ToArrayBuffer = (s: string) => {
  const e = decode(s);
  const arr = new Uint8Array(e.length);
  for (let i = 0; i < e.length; i++) arr[i] = e.charCodeAt(i);
  return arr;
};

/**
 * stringify array of number as base64
 * assuming number in array are lesser than MAX_VALUE
 */
export const pack = (elements: number[]) => {
  const arr = new Uint8Array(Math.ceil((elements.length * n) / 8));
  elements.forEach((value, i) => set(arr, n, i, value + 1));
  return arrayBufferTob64(arr);
  //.replace(/=\+$/, "");
};

export const unpack = (s: string) => {
  const elements: number[] = [];
  const arr = b64ToArrayBuffer(s);
  for (let v = 0, i = 0; (v = get(arr, n, i)) !== 0; i++) elements.push(v - 1);
  return elements;
};
