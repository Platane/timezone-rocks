import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";
import { useStore } from "./store/store";

const handler = (ready: boolean) => {
  if (ready) {
    const container = document.getElementById("root")!;
    const root = createRoot(container);
    root.render(createElement(App));
  }
};
handler(useStore.getState().locationStoreReady);
useStore.subscribe((s) => s.locationStoreReady, handler);

// window.navigator?.serviceWorker?.register("service-worker.js");
