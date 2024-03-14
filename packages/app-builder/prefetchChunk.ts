import type { PluginOption } from "vite";
import { join as pathJoin } from "node:path";

/**
 * inject link rel="prefetch" in index.html head, to hint the browser to fetch the chunks while idle
 */
export const prefetchChunk = (): PluginOption => {
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
