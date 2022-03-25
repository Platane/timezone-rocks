export const debugCanvas = document.createElement("canvas");
debugCanvas.id = "debug-canvas";
debugCanvas.style.pointerEvents = "none";
debugCanvas.style.position = "absolute";
debugCanvas.style.top = "0";
debugCanvas.style.left = "0";

export const debugCtx = debugCanvas.getContext("2d")!;

export const createDebugCanvas = () => {
  const container = document.getElementById("scene-earth")!;

  container.appendChild(debugCanvas);

  debugCanvas.width = container.clientWidth;
  debugCanvas.height = container.clientHeight;
};
