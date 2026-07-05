import React from "react";
import * as THREE from "three";
import { selectT } from "../../../store/selectors";
import { subscribeToValue, type Store } from "../../../store/store";
import { getSunDirection } from "./getSunDirection";

export const Sun = ({ store }: { store: Store }) => {
  const refLight = React.useRef<THREE.DirectionalLight | null>(null);

  React.useLayoutEffect(() => {
    const update = (t: number) => {
      if (refLight.current?.position)
        getSunDirection(t, refLight.current.position);
    };
    update(store.getState().t);
    return subscribeToValue(store, selectT, update);
  }, [store]);

  return <directionalLight intensity={0.4} ref={refLight} />;
};
