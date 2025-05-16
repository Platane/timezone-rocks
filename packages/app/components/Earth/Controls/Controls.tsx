import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useSubscribe } from "../../../store/useSubscribe";
import { isStable, stepSpring } from "@tzr/utils/utils-spring";
import { setLatLng } from "../Locations/utils-latLng";
import { MathUtils } from "three";
import type { ForwardRefComponent } from "@react-three/drei/helpers/ts-utils";

type Impl<T> = T extends ForwardRefComponent<infer _, infer I> ? I : never;
type IOrbitControls = Impl<typeof OrbitControls>;

export const Controls = () => {
  const { camera } = useThree();

  const state = useRef({
    orbitControlsActive: false,
    travelAnimationRunning: false,
    idleAnimationDelay: 1.6,
    phi: { x: 0, v: 0, target: 0 },
    theta: { x: 0, v: 0, target: 0 },
  });

  useSubscribe(
    (location: any) => {
      if (!location) return;

      setLatLng(s, location[0]);
      state.current.phi.target = Math.max(
        Math.PI / 5,
        Math.min(Math.PI - Math.PI / 4, s.phi)
      );
      state.current.theta.target = s.theta;

      if (!state.current.travelAnimationRunning) {
        s.setFromVector3(camera.position);

        state.current.phi.x = s.phi;
        state.current.theta.x = s.theta;
      }

      state.current.travelAnimationRunning = true;
    },
    (s) => s.selectedLocation
  );

  // handle orbit control
  const orbitControlsRef = useRef<IOrbitControls | null>(null);
  useEffect(() => {
    const onStart = () => {
      state.current.orbitControlsActive = true;
      state.current.travelAnimationRunning = false;
    };
    const onEnd = () => {
      state.current.orbitControlsActive = false;
      state.current.idleAnimationDelay = 1;
    };

    const orbitControls = orbitControlsRef.current!;

    orbitControls.addEventListener("start", onStart);
    orbitControls.addEventListener("end", onEnd);

    return () => {
      orbitControls.removeEventListener("start", onStart);
      orbitControls.removeEventListener("end", onEnd);
    };
  });

  // animate
  useFrame((_, dt) => {
    if (state.current.travelAnimationRunning) {
      const { phi, theta } = state.current;

      stepSpring(phi, springParams, dt);
      stepSpring(theta, springParams, dt);

      s.set(camera.position.length(), phi.x, theta.x);
      camera.position.setFromSpherical(s);

      camera.lookAt(0, 0, 0);

      if (isStable(phi) && isStable(phi)) {
        state.current.travelAnimationRunning = false;
        state.current.idleAnimationDelay = 1;
      }
    } else if (!state.current.orbitControlsActive) {
      state.current.idleAnimationDelay -= dt;
      const k = MathUtils.clamp(
        -state.current.idleAnimationDelay * 0.3 + 0.3,
        0,
        1
      );

      const V = 0.05 * k;

      s.setFromVector3(camera.position);
      s.theta -= V * dt;
      if (s.phi < Math.PI / 3) s.phi += V * 0.4 * dt;
      if (s.phi > Math.PI - Math.PI / 3) s.phi -= V * 0.4 * dt;
      camera.position.setFromSpherical(s);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      minDistance={1.8}
      maxDistance={4}
      enableZoom={true}
      enablePan={false}
    />
  );
};

const springParams = { tension: 60, friction: 16 };
const s = new THREE.Spherical(1.04);
