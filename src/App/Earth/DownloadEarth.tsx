import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import { GLTFExporter } from "three-stdlib";
import { transform } from "./EarthGlobe";

// @ts-ignore
import modelPath from "../../assets/earth/scene.glb";

export const DownloadEarth = () => (
  <Suspense fallback={null}>
    <Inside />
  </Suspense>
);

const Inside = () => {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(
    () =>
      new THREE.Mesh(
        transform((gltf as any).nodes.earth4_lambert1_0.geometry),
        new THREE.LineBasicMaterial()
      ),
    [gltf]
  );

  const [result, setResult] = useState<any>();
  useEffect(() => {
    if (!scene) return;

    let url: string;
    let canceled = false;

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (binary) => {
        if (canceled) return;

        const buffer: ArrayBuffer = binary as any;

        url = URL.createObjectURL(new Blob([buffer]));

        setResult({ binary, url, scene });
      },
      { binary: true }
    );

    return () => {
      canceled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [scene]);

  const href = result?.scene === scene ? result.url : null;

  return (
    <>
      {href && (
        <a href={href} download="earth.glb">
          download
        </a>
      )}
    </>
  );
};
