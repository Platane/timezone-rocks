import * as THREE from "three";
import JSZip from "jszip";
import { GLTFExporter, GLTFLoader } from "three-stdlib";

import zipPath from "./assets/earth.zip";

const loadZipFiles = async (zipPath: string) => {
  const zipBuffer = await fetch(zipPath).then((res) => res.arrayBuffer());
  const { files } = await JSZip.loadAsync(zipBuffer);

  const blobUrls = new Map();

  for (const [path, file] of Object.entries(files)) {
    const buffer = await file.async("arraybuffer");
    blobUrls.set(path, URL.createObjectURL(new Blob([buffer])));
  }

  return blobUrls;
};

export const generateGlb = async () => {
  const blobUrls = await loadZipFiles(zipPath);

  const loadingManager = new THREE.LoadingManager();

  loadingManager.setURLModifier((path) => {
    const name = path.replace(/^\.\//, "");

    return blobUrls.get(name);
  });

  const gltf = await new GLTFLoader(loadingManager).loadAsync("./scene.gltf");

  const scene = transform(gltf.scene);

  const outGlb: any = new Promise((resolve) =>
    new GLTFExporter().parse(scene, resolve, {
      binary: true,
      onlyVisible: true,
    })
  );

  return outGlb;
};

const transform = (scene: THREE.Object3D) => {
  let m: THREE.Mesh;
  scene.clone().traverse((o) => {
    if (o.name === "earth4_lambert1_0") m = o as any;
  });
  const mesh = m!.clone();

  mesh.parent?.remove(mesh);
  mesh.material = new THREE.MeshStandardMaterial();
  mesh.geometry = mesh.geometry.clone();
  mesh.geometry.deleteAttribute("uv");
  mesh.name = "land";
  resize(mesh.geometry);
  setFlatNormals(mesh.geometry);

  const o = new THREE.Scene();
  o.add(mesh);

  return o;
};

const tesselate = (geometry: THREE.BufferGeometry) => {
  geometry = geometry.toNonIndexed();

  const position = geometry.getAttribute("position")!;
  const normal = geometry.getAttribute("normal")!;
  const newNormals: THREE.Vector3[] = [];

  {
    const ps: THREE.Vector3[] = [];
    for (let j = 0; j < position.count; j += 1)
      ps.push(new THREE.Vector3().fromBufferAttribute(position, j));
    console.log(ps);
  }

  const getFaces = (p: THREE.Vector3) => {
    const f = [];

    for (let j = 0; j < position.count; j += 1) {
      const p0 = new THREE.Vector3().fromBufferAttribute(position, j);
      if (p.distanceTo(p0) < 0.00001) {
        const i0 = Math.floor(j / 3) * 3;
        f.push([i0 + 0, i0 + 1, i0 + 2]);
      }
    }

    return f;
  };

  for (let i = 0; i < position.count; i += 1) {
    const p = new THREE.Vector3().fromBufferAttribute(position, i);
    const n = new THREE.Vector3();

    let totalArea = 0;

    getFaces(p).forEach((indexes) => {
      // mean normal of the face
      const facePreviousN = new THREE.Vector3();
      for (const i of indexes) {
        const n0 = new THREE.Vector3().fromBufferAttribute(normal, i);
        facePreviousN.addScaledVector(n0, 1 / 3);
      }
      facePreviousN.normalize();

      const [a, b, c] = indexes.map((i) =>
        new THREE.Vector3().fromBufferAttribute(position, i)
      );

      const faceN = new THREE.Vector3()
        .subVectors(b, a)
        .cross(new THREE.Vector3().subVectors(c, a))
        .normalize();

      if (faceN.dot(facePreviousN) < 0) faceN.negate();

      const u = new THREE.Vector3();
      const v = new THREE.Vector3();

      u.subVectors(a, p);
      v.subVectors(b, p);

      if (u.length() < 0.00001) u.subVectors(c, p);
      if (v.length() < 0.00001) v.subVectors(c, p);

      u.normalize();
      v.normalize();

      const area = new THREE.Vector3().crossVectors(u, v).length();

      totalArea += area;

      n.addScaledVector(faceN, area);
    });

    n.normalize();

    const previousN = new THREE.Vector3().fromBufferAttribute(normal, i);

    const k = THREE.MathUtils.clamp(totalArea / 5, 0.5, 1);
    console.log(totalArea, k);

    newNormals.push(new THREE.Vector3().lerpVectors(previousN, n, k));
  }

  for (let i = 0; i < newNormals.length; i++)
    normal.setXYZ(i, newNormals[i].x, newNormals[i].y, newNormals[i].z);
};

const resize = (geometry: THREE.BufferGeometry) => {
  const ls: number[] = [];
  const position = geometry.getAttribute("position")!;

  for (let i = 0; i < position.count; i++) {
    const p = new THREE.Vector3(
      position.getX(i),
      position.getY(i),
      position.getZ(i)
    );

    const l = p.length();
    if (l > 8.5) ls.push(l);
  }

  const min = Math.min(...ls);
  const max = Math.max(...ls);

  console.log(min, max);

  for (let i = 0; i < position.count; i++) {
    const p = new THREE.Vector3(
      position.getX(i),
      position.getY(i),
      position.getZ(i)
    );

    const l = p.length();

    const u = THREE.MathUtils.clamp((l - min) / (max - min), 0, 1);

    p.normalize().multiplyScalar(1 + Math.pow(u, 1 / 1.5) * 0.08);

    position.setXYZ(i, p.x, p.y, p.z);
  }
};

const setFlatNormals = (geometry: THREE.BufferGeometry) => {
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const normal = geometry.getAttribute("normal") as THREE.BufferAttribute;

  const p = new THREE.Vector3();
  for (let i = position.array.length / position.itemSize; i--; ) {
    p.set(position.getX(i), position.getY(i), position.getZ(i));

    p.normalize();

    normal.setXYZ(i, p.x, p.y, p.z);
  }
};
