import { cpSync, rmSync } from "node:fs";
import { publicAssetsPlugin } from "./plugins/publicAssets";
import { rawPlugin } from "./plugins/raw";
import { workerPlugin } from "./plugins/worker";
import { prebuildWorkers } from "./worker-prebuild";
import { define, htmlEntry, loader, outdir, publicDir } from "./config";

rmSync(outdir, { recursive: true, force: true });

// 1. bundle workers ahead of the main build (see worker-prebuild.ts)
const workers = await prebuildWorkers({ outdir, loader, minify: true });

// 2. main build from the HTML entrypoint
const res = await Bun.build({
  entrypoints: [htmlEntry],
  outdir,
  target: "browser",
  minify: true,
  splitting: true,
  publicPath: "/",
  sourcemap: "linked",
  loader: loader as any,
  define: define(),
  plugins: [publicAssetsPlugin, rawPlugin, workerPlugin(workers)],
});

if (!res.success) {
  console.error(res.logs);
  process.exit(1);
}

// 3. copy static public assets (favicon, manifest, icons, robots, _headers…)
cpSync(publicDir, outdir, { recursive: true });

for (const o of res.outputs)
  console.log(o.path.replace(outdir, "dist"), `${(o.size / 1024) | 0}kb`);
