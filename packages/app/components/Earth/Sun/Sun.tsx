import React from "react";
import * as THREE from "three";
import { selectT } from "../../../store/selector";
import { useSubscribe } from "../../../store/useSubscribe";
import { getSunDirection } from "./getSunDirection";

export const Sun = () => {
  const refLight = React.useRef<THREE.DirectionalLight | null>(null);

  useSubscribe((t) => {
    if (refLight.current?.position)
      getSunDirection(t, refLight.current.position);
  }, selectT);

  return <directionalLight intensity={0.4} ref={refLight} />;
};
