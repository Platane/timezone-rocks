export const downloadGlb = (data: ArrayBuffer) => {
  const file = new Blob([data], { type: "model/gltf-binary" });

  const a = document.createElement("a");
  const url = URL.createObjectURL(file);

  a.href = url;
  a.download = "scene.glb";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);

  // document.body.removeChild(a);
};
