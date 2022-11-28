import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stepSpring } from "@tzr/utils/utils-spring";

export const AppearScaleNode = ({
  children,
  scaleTarget,
  scale0 = 0,
  springConfig = { tension: 80, friction: 9 },
}: {
  children: any;
  scaleTarget: number;
  scale0?: number;
  springConfig?: { tension: number; friction: number };
}) => {
  const ref = React.useRef<THREE.Group | null>(null);
  const spring = React.useRef({ x: scale0, target: 0, v: 0 });
  spring.current.target = scaleTarget;

  useFrame((_, dt) => {
    stepSpring(spring.current, springConfig, dt);
    ref.current?.scale.setScalar(spring.current.x);
  });

  return <group ref={ref}>{children}</group>;
};
