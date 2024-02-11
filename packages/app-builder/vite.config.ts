import { PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { execSync } from "child_process";
import { join as pathJoin } from "path";
import wyw from "@wyw-in-js/vite";

const getVersion = () =>
  [
    require("../../package.json").version,
    execSync("git rev-parse --short HEAD").toString().trim(),
  ].join("-");

export default defineConfig(() => ({
  root: "../app/",
  assetsInclude: ["**/*.glb", "**/*.csv"],
  plugins: [
    visualizer({
      filename: "../../dist-info/bundle-stats.html",
      template: "treemap",
    }),
    react(),
    wyw({
      include: ["**/*.tsx"],
      exclude: ["**/node_modules/**"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    prefetchChunk(),
  ],
  define: { "process.env.APP_VERSION": JSON.stringify(getVersion()) },
  server: { port: 3000 },
  build: {
    reportCompressedSize: false,
    outDir: "../../dist",
  },
}));

/**
 * inject link rel="prefetch" in index.html head, to hint the browser to fetch the chunks while idle
 */
const prefetchChunk = (): PluginOption => {
  let baseUrl = "/";
  return {
    name: "inject-link-rel=prefetch-in-index-html",
    enforce: "post",
    configResolved(config) {
      baseUrl = config.base ?? "/";
    },
    transformIndexHtml(html, { bundle }) {
      if (!bundle) {
        return html;
      }

      const links = Object.values(bundle)
        .filter(
          (chunk) =>
            chunk.type === "chunk" ||
            chunk.fileName.endsWith(".wasm") ||
            chunk.fileName.endsWith(".csv") ||
            chunk.fileName.endsWith(".glb")
        )
        .map((chunk) => chunk.fileName)
        .map(
          (url) => `<link rel="prefetch" href="${pathJoin(baseUrl, url)}"/>`
        );

      return html.replace("</head>", `${links.join("")}</head>`);
    },
  };
};
