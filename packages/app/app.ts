import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";
import { useStore } from "./store/store";

console.debug("version", process.env.APP_VERSION);

const handler = (ready: boolean) => {
  if (ready) {
    const container = document.getElementById("root")!;
    const root = createRoot(container);
    root.render(createElement(App));
  }
};
handler(useStore.getState().locationStoreReady);
useStore.subscribe((s) => s.locationStoreReady, handler);

// add scrollbar-width property, use in some layout css
const scrollbarWidth = window.innerWidth - document.body.clientWidth + "px";
document.documentElement.style.setProperty("--scrollbar-width", scrollbarWidth);

// window.navigator?.serviceWorker?.register("service-worker.js");
