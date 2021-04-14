import { createElement } from "react";
import { render } from "react-dom";
import { App } from "./App/App";
import { useStore } from "./App/store/store";
import { getBoxDistance } from "./math-utils";

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

if (0) {
  const c = document.createElement("canvas");
  c.width = 400;
  c.height = 400;
  c.style.zIndex = "5000000";
  c.style.position = "fixed";
  c.style.top = "0";
  c.style.left = "0";
  document.body.appendChild(c);

  const ctx = c.getContext("2d")!;

  c.addEventListener("mousemove", ({ clientX, clientY }) => {
    const c1 = { x: 156, y: 167 };
    const c2 = { x: clientX, y: clientY };

    const box1 = { min: { x: 0, y: 0 }, max: { x: 60, y: 20 } };
    const box2 = { min: { x: 0, y: 0 }, max: { x: 54, y: 107 } };

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.fillRect(0, 0, 999, 9999);

    ctx.fillStyle = "#5ff";
    ctx.beginPath();
    ctx.fillRect(
      c1.x + box1.min.x,
      c1.y + box1.min.y,
      box1.max.x - box1.min.x,
      box1.max.y - box1.min.y
    );

    ctx.fillStyle = "#f8f";
    ctx.beginPath();
    ctx.fillRect(
      c2.x + box2.min.x,
      c2.y + box2.min.y,
      box2.max.x - box2.min.x,
      box2.max.y - box2.min.y
    );

    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.fillText(getBoxDistance(c1, c2, box1, box2) + "", 30, 30);
    //
  });
}
