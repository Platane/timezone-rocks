import linaria from "@linaria/esbuild";
import * as esbuild from "esbuild";
import * as path from "path";
import * as fs from "fs";

const __dirname = new URL(path.dirname(import.meta.url)).pathname;
const prod = process.env.NODE_ENV === "production";

const build = async () => {
  const names = prod ? "[hash]" : "[name].[hash]";
  const { metafile } = await esbuild.build({
    entryPoints: [
      path.join(__dirname, "../src/index.ts"),
      path.join(__dirname, "../src/locations/worker.ts"),
    ],

    entryNames: names,
    assetNames: names,
    chunkNames: names,

    outdir: path.join(__dirname, "../dist"),
    splitting: true,
    format: "esm",
    bundle: true,
    minify: prod,
    metafile: true,

    loader: {
      ".glb": "file",
      ".csv": "file",
    },

    plugins: [
      (linaria as any).default({
        sourceMap: false,
      }) as any,
    ],
  });

  const workerFile = Object.entries(metafile?.outputs ?? {})
    .find(([_, chunk]) => chunk.entryPoint?.endsWith("locations/worker.ts"))![0]
    .split("dist/")[1];
  const entryJsFiles = Object.entries(metafile?.outputs ?? {})
    .map(([file, chunk]) =>
      chunk.entryPoint?.endsWith("src/index.ts") ? [file.split("dist/")[1]] : []
    )
    .flat();
  const entryCssFiles = Object.entries(metafile?.outputs ?? {})
    .map(([file, chunk]) =>
      Object.keys(chunk.inputs).some((x) => x.startsWith("linaria:App_")) &&
      file.endsWith(".css")
        ? [file.split("dist/")[1]]
        : []
    )
    .flat();

  const html = `
  <html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    ${entryCssFiles
      .map((href) => `<link rel="stylesheet" href="${href}">`)
      .join("")}
  </head>
  <body>
    <div id="root"></div>
    <script>window.__location_worker_url="${workerFile}";</script>
    ${entryJsFiles
      .map((src) => `<script src="${src}" defer></script>`)
      .join("")}
  </body>
  </html>
  `;

  fs.writeFileSync(path.join(__dirname, "../dist/index.html"), html);
};

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
