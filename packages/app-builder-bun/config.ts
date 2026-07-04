import { execSync } from "node:child_process";
import { resolve } from "node:path";

export const appDir = resolve(import.meta.dir, "../app");
export const outdir = resolve(import.meta.dir, "../../dist");
export const htmlEntry = resolve(appDir, "index.html");
export const publicDir = resolve(appDir, "public");

/** extensions emitted as separate hashed files, exposing their URL as default */
export const loader: Record<string, string> = {
  ".svg": "file",
  ".glb": "file",
  ".csv": "file",
  ".frag": "file",
  ".vert": "file",
  ".zip": "file",
  ".jpg": "file",
  ".png": "file",
  ".ico": "file",
};

export const getVersion = () =>
  [
    require("../../package.json").version,
    execSync("git rev-parse --short HEAD").toString().trim(),
  ].join("-");

export const define = () => ({
  "process.env.APP_VERSION": JSON.stringify(getVersion()),
});
