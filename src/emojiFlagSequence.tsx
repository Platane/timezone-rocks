export const getFlagEmoji = (countyCode: string) => {
  const cc = countyCode.toLocaleLowerCase();
  const a = parseInt(cc[0], 36) - 10;
  const b = parseInt(cc[1], 36) - 10;

  return (
    unicodeSupplementaryPlanes(0x1f1e6 + a) +
    unicodeSupplementaryPlanes(0x1f1e6 + b)
  );
};

const unicodeSupplementaryPlanes = (x: number) => {
  const u = x - 0x10000;

  const hi = u >> 10;
  const lo = u % (1 << 10);

  return String.fromCharCode(hi + 0xd800, lo + 0xdc00);
};
