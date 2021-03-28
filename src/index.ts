import { createElement } from "react";
import { render } from "react-dom";
import { App } from "./App/App";
import { useStore } from "./App/store/store";

useStore.subscribe(
  () => {
    const root = document.getElementById("root");
    render(createElement(App), root);
  },
  (s) => s.locationStoreReady
);

useStore.subscribe(
  () => {
    window.navigator?.serviceWorker?.register("service-worker.js");
  },
  (s) => s.locationStoreReady && s.earthReady
);
