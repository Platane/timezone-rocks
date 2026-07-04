import { dirname, resolve } from "node:path";
import { Glob } from "bun";

const packagesDir = resolve(import.meta.dir, "..");

/**
 * Discover every `?worker` import across the workspace source and bundle each
 * referenced worker ahead of the main build (nested builds during the main
 * build deadlock). Returns `absolute worker path -> bundled worker code`.
 *
 * Worker assets (e.g. the locations CSV imported inside the worker) are emitted
 * into `outdir` with a root-absolute `publicPath` so the Blob-URL worker can
 * still `fetch` them against the page origin.
 */
export const prebuildWorkers = async ({
  outdir,
  loader,
  minify,
}: {
  outdir: string;
  loader: Record<string, string>;
  minify: boolean;
}) => {
  const map = new Map<string, string>();

  const re = /from\s+["']([^"']+)\?worker["']/g;
  const glob = new Glob("**/*.{ts,tsx}");

  for await (const file of glob.scan({ cwd: packagesDir, absolute: true })) {
    if (file.includes("/node_modules/")) continue;

    const src = await Bun.file(file).text();
    for (const [, spec] of src.matchAll(re)) {
      const entry = Bun.resolveSync(spec, dirname(file));
      if (map.has(entry)) continue;

      const built = await Bun.build({
        entrypoints: [entry],
        outdir,
        publicPath: "/",
        target: "browser",
        format: "esm",
        minify,
        loader: loader as any,
      });
      if (!built.success) {
        console.error(built.logs);
        throw new Error(`failed to pre-build worker: ${entry}`);
      }
      const out = built.outputs.find((o) => o.kind === "entry-point")!;
      map.set(entry, await out.text());
    }
  }

  return map;
};
