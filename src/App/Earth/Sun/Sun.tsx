import React, { useRef } from "react";
import * as THREE from "three";
import { selectT } from "../../store/selector";
import { useSubscribe } from "../../store/useSubscribe";
import { getSunDirection } from "./utils";

export const Sun = () => {
  const refLight = useRef<THREE.DirectionalLight>();

  useSubscribe((t) => {
    if (refLight.current?.position)
      getSunDirection(t, refLight.current.position);
  }, selectT);

  return <directionalLight intensity={0.2} ref={refLight} />;
};
