import { dirname, resolve } from "node:path";
import type { BunPlugin } from "bun";

/**
 * Support Vite-style `import x from "./shader.frag?raw"` — returns the file
 * contents as a string. (Bun's native equivalent is `with { type: "text" }`.)
 */
export const rawPlugin: BunPlugin = {
  name: "raw",
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, (args) => ({
      path: resolve(dirname(args.importer), args.path.replace(/\?raw$/, "")),
      namespace: "raw",
    }));

    build.onLoad({ filter: /.*/, namespace: "raw" }, async (args) => ({
      loader: "js",
      contents: `export default ${JSON.stringify(await Bun.file(args.path).text())}`,
    }));
  },
};
