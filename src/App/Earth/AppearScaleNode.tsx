import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stepSpring } from "../../spring-utils";

export const AppearScaleNode = ({
  children,
  scaleTarget,
  springConfig = { tension: 80, friction: 9 },
}: {
  children: any;
  scaleTarget: number;
  springConfig?: { tension: number; friction: number };
}) => {
  const ref = useRef<THREE.Group>();
  const spring = useRef({ x: 0, target: 0, v: 0 });
  spring.current.target = scaleTarget;

  useFrame((_, dt) => {
    stepSpring(spring.current, springConfig, dt);
    ref.current?.scale.setScalar(spring.current.x);
  });

  return <group ref={ref}>{children}</group>;
};
