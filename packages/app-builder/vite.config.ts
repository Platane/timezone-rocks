import { execSync } from "node:child_process";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { type Plugin, type UserConfig } from "vite";
import { prefetchChunk } from "./prefetchChunk";

const getVersion = () =>
  [
    require("../../package.json").version,
    execSync("git rev-parse --short HEAD").toString().trim(),
  ].join("-");

export default {
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
    react() as any,
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
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    outDir: "../../dist",
  },
} satisfies UserConfig;
