import * as React from "react";
import * as ReactDOM from "react-dom";
import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";
import { useEffect } from "react";

export const Html = ({ children, style, className, ...props }: any) => {
  const {
    gl: { domElement },
    camera,
    size,
  } = useThree();
  const [el] = React.useState(() => document.createElement("div"));
  const groupRef = React.useRef<THREE.Group>(null);

  useEffect(() => {
    domElement.style.position = "relative";
    domElement.style.zIndex = "200";

    el.style.pointerEvents = "none";
    el.style.position = "absolute";
    el.style.left = "0px";
    el.style.top = "0px";

    domElement.parentNode!.appendChild(el);
    ReactDOM.render(
      <div style={style} className={className}>
        {children}
      </div>,
      el
    );

    return () => {
      el.parentNode?.removeChild(el);
      ReactDOM.unmountComponentAtNode(el);
    };
  }, []);

  useFrame(() => {
    const group = groupRef.current;

    if (!group) return;

    camera.updateMatrixWorld();

    group.getWorldPosition(position);

    const o = a.subVectors(position, camera.position).dot(position) < 0;

    position.project(camera);

    el.style.zIndex = Math.floor(
      o ? 201 + (1 - position.z) * 190 : 199 - position.z * 190
    ).toString();

    el.style.transform =
      "translate(" +
      ((position.x + 1) / 2) * size.width +
      "px," +
      ((1 - position.y) / 2) * size.height +
      "px)";
  });

  return <group {...props} ref={groupRef} />;
};

const position = new THREE.Vector3();
const a = new THREE.Vector3();
