import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";
import { createLocationSearcher } from "@tzr/location-index";
import {
  createInitialState,
  createStore,
  subscribeHashUpdate,
} from "./store/store";

// add scrollbar-width property, use in some layout css
const scrollbarWidth = window.innerWidth - document.body.clientWidth + "px";
document.documentElement.style.setProperty("--scrollbar-width", scrollbarWidth);

// start loading this component
import("./components/Earth/Scene");

(async () => {
  const locationSearcher = createLocationSearcher();
  const store = createStore(await createInitialState(locationSearcher));
  subscribeHashUpdate(store);

  const container = document.getElementById("root")!;
  const root = createRoot(container);
  root.render(createElement(App, { locationSearcher, store }));
})();
