import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSubscribe } from "../../store/useSubscribe";
import { isStable, stepSpring } from "../../../spring-utils";
import * as THREE from "three";
import { setLatLng } from "../Locations/utils";

export const useSelectedLocation = () => {
  const { camera } = useThree();

  const animation = useRef({
    running: false,
    phi: { x: 0, v: 0, target: 0 },
    theta: { x: 0, v: 0, target: 0 },
  });

  useSubscribe(
    (location: any) => {
      if (!location) return;

      setLatLng(s, location);
      animation.current.phi.target = Math.max(
        Math.PI / 5,
        Math.min(Math.PI - Math.PI / 4, s.phi)
      );
      animation.current.theta.target = s.theta;

      if (!animation.current.running) {
        s.setFromVector3(camera.position);

        animation.current.phi.x = s.phi;
        animation.current.theta.x = s.theta;
      }

      animation.current.running = true;
    },
    (s) => s.selectedLocation
  );

  useFrame((_, dt) => {
    if (!animation.current.running) return;

    const { phi, theta } = animation.current;

    stepSpring(phi, springParams, dt);
    stepSpring(theta, springParams, dt);

    s.set(camera.position.length(), phi.x, theta.x);
    camera.position.setFromSpherical(s);

    camera.lookAt(0, 0, 0);

    if (isStable(phi) && isStable(phi)) animation.current.running = false;
  });
};

const springParams = { tension: 60, friction: 16 };
const s = new THREE.Spherical(1.04);
