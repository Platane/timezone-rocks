import type { BunPlugin } from "bun";

/**
 * The HTML entry references `public/` files by bare, root-relative names
 * (`manifest.json`, `icon.svg`, `favicon.ico`…). Those live outside the HTML's
 * directory and are copied verbatim into the output root, so mark them external
 * — Bun leaves the reference untouched instead of trying to bundle/hash it.
 *
 * Local entrypoints (`./app.ts`) and real module imports are left to resolve
 * normally; only bare specifiers imported *by the HTML file* are externalized.
 */
export const publicAssetsPlugin: BunPlugin = {
  name: "public-assets",
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (
        args.importer.endsWith(".html") &&
        !args.path.startsWith(".") &&
        !args.path.startsWith("/")
      )
        return { path: args.path, external: true };
      return undefined;
    });
  },
};
