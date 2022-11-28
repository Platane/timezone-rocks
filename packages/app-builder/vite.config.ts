import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import linaria from "@linaria/rollup";
import { execSync } from "child_process";

const getVersion = () =>
  [
    require("../../package.json").version,
    execSync("git rev-parse --short HEAD").toString().trim(),
  ].join("-");

export default defineConfig(() => ({
  root: "../app/",
  assetsInclude: ["**/*.glb", "**/*.csv", "**/*.zip"],
  plugins: [
    visualizer({
      filename: "../../dist-info/bundle-stats.html",
      template: "treemap",
    }) as any,
    react(),
    linaria({
      include: ["**/*.tsx"],
      exclude: ["**/node_modules/**"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
  ],
  define: { "process.env.APP_VERSION": JSON.stringify(getVersion()) },
  server: { port: 3000 },
  build: {
    outDir: "../../dist",
  },
}));
