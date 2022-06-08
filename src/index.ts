import { getMatchingLocation } from "./locations/wasm-index";

(async () => {
  const ls = await getMatchingLocation("pris", 3);

  console.log(ls);

  const n = 100;
  const a = performance.now();
  for (let k = n; k--; ) await getMatchingLocation("pris", 3);

  console.log((performance.now() - a) / n, "ms");
})();
