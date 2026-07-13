import { parseLocations } from "@tzr/location-index/fetch/parseLocations";
import * as flags from "country-flag-icons/string/3x2";
import { optimize } from "svgo";

/**
 * Combine every country-flag-icons svg into a single sprite sheet.
 */
const csv = await Bun.file(
  new URL("../../location-index/assets/locations.csv", import.meta.url),
).text();

const usedCountryCodes = new Set(parseLocations(csv).map((l) => l.countryCode));

// optimize each flag on its own, before wrapping it in a <symbol id="XX">, so
// svgo's id cleanup never touches the ids we reference with <use href="#XX">.
const symbols = Object.entries(flags as Record<string, string>)
  .filter(([code]) => usedCountryCodes.has(code))
  .map(([code, svg]) => {
    const { data } = optimize(svg, { multipass: true });
    const viewBox = data.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 513 342";
    const inner = data.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    return `<symbol id="${code}" viewBox="${viewBox}">${inner}</symbol>`;
  });

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`;

await Bun.write(new URL("./flags.svg", import.meta.url), sprite);
console.log(`wrote flags.svg (${symbols.length} flags, ${sprite.length} bytes)`);
