import { dirname } from "node:path";
import type { BunPlugin } from "bun";

/**
 * Support Vite-style `import MyWorker from "./worker?worker"`.
 *
 * Bun's bundler does NOT treat `new Worker(new URL(...))` (or `?worker`) as a
 * bundle entrypoint, and a nested `Bun.build` inside `onLoad` deadlocks the
 * bundler. So workers are bundled *ahead of time* (see `worker-prebuild.ts`)
 * and passed in here as a map of `absolute worker path -> bundled code`. We
 * inline that code as a Blob URL and export a `Worker`-constructing class,
 * matching the shape Vite's `?worker` import produces.
 */
export const workerPlugin = (prebuilt: Map<string, string>): BunPlugin => ({
  name: "worker",
  setup(build) {
    build.onResolve({ filter: /\?worker$/ }, (args) => ({
      path: Bun.resolveSync(
        args.path.replace(/\?worker$/, ""),
        dirname(args.importer)
      ),
      namespace: "worker",
    }));

    build.onLoad({ filter: /.*/, namespace: "worker" }, (args) => {
      const code = prebuilt.get(args.path);
      if (code == null)
        throw new Error(
          `worker not pre-built: ${args.path}\n(add it to worker-prebuild discovery)`
        );

      return {
        loader: "js",
        contents: `
          const url = URL.createObjectURL(
            new Blob([${JSON.stringify(code)}], { type: "text/javascript" })
          );
          export default class {
            constructor() { return new Worker(url, { type: "module" }); }
          }
        `,
      };
    });
  },
});
