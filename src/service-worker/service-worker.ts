import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

/**
 * pre cache
 */
precacheAndRoute([
  {
    url: process.env.APP_BASE_URL + "/app-shell.html",
    revision: process.env.APP_SHELL_REVISION,
  },
  { url: "https://cdn.ampproject.org/shadow-v0.js" },
]);

/**
 * upon navigation, serve the pwa shell instead
 */
const handler = createHandlerBoundToURL(
  process.env.APP_BASE_URL + "/app-shell.html"
);
registerRoute(({ event }) => event.request.mode === "navigate", handler);

/**
 * cache pages
 */
registerRoute(
  ({ url }) => url.pathname.match(/^(\/pokemon\/[^/]+|\/type\/[^/]+|\/)$/),

  new CacheFirst({
    cacheName: "content-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
      }),
    ],
  })
);

/**
 * cache images
 */
registerRoute(
  ({ request }) => request.destination === "image",

  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      // new CacheableResponsePlugin({
      //   statuses: [0, 200],
      // }),
    ],
  })
);

/**
 * cache assets
 */
registerRoute(
  ({ request }) => request.destination === "font",

  new CacheFirst({
    cacheName: "assets-cache",
  })
);

export {};
