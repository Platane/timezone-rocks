import { type Plugin, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { execSync } from "node:child_process";
import wyw from "@wyw-in-js/vite";
import { prefetchChunk } from "./prefetchChunk";

const getVersion = () =>
  [
    require("../../package.json").version,
    execSync("git rev-parse --short HEAD").toString().trim(),
  ].join("-");

export default defineConfig(() => ({
  root: "../app/",
  assetsInclude: [
    "**/*.svg",
    "**/*.glb",
    "**/*.csv",
    "**/*.frag",
    "**/*.vert",
    "**/*.zip",
  ],
  plugins: [
    visualizer({
      filename: "../../dist-info/bundle-stats.html",
      template: "treemap",
    }) as Plugin,
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
