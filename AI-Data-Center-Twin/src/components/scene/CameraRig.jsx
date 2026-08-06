import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { cameraPositionBridge } from '../../utils/cameraPositionBridge';

const INTRO_START = new THREE.Vector3(0, 38, 0.1);
const INTRO_END = new THREE.Vector3(18, 12, 18);
const DEFAULT_TARGET = new THREE.Vector3(0, 2, 0);

export default function CameraRig({ reducedMotion }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const cameraTarget = useStore((s) => s.cameraTarget);
  const autoRotate = useStore((s) => s.autoRotate);

  // Cinematic fly-in on mount
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (reducedMotion) {
      camera.position.copy(INTRO_END);
      controls.target.copy(DEFAULT_TARGET);
      controls.update();
      return;
    }

    camera.position.copy(INTRO_START);
    controls.target.set(0, 10, 0);

    const timeline = gsap.timeline({
      onUpdate: () => controls.update(),
    });

    timeline.to(camera.position, {
      x: INTRO_END.x,
      y: INTRO_END.y,
      z: INTRO_END.z,
      duration: 2.6,
      ease: 'power3.inOut',
    }, 0);
    timeline.to(controls.target, {
      x: DEFAULT_TARGET.x,
      y: DEFAULT_TARGET.y,
      z: DEFAULT_TARGET.z,
      duration: 2.6,
      ease: 'power3.inOut',
    }, 0);

    return () => timeline.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to camera-move requests (rack focus, presets, double-click)
  useEffect(() => {
    if (!cameraTarget || !controlsRef.current) return;
    const { position, lookAt, fov = 45, duration = 1.4 } = cameraTarget;
    const controls = controlsRef.current;

    // Cancel any intro or previous preset animation before starting the next
    // synchronized move. Competing camera/target tweens can point the camera
    // away from the facility and leave the canvas appearing blank.
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);
    gsap.killTweensOf(camera);

    const timeline = gsap.timeline({
      onUpdate: () => {
        controls.update();
        camera.updateProjectionMatrix();
      },
      onComplete: () => {
        controls.update();
        camera.updateProjectionMatrix();
      },
    });

    timeline.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration,
      ease: 'power2.inOut',
    }, 0);
    timeline.to(controls.target, {
      x: lookAt[0],
      y: lookAt[1],
      z: lookAt[2],
      duration,
      ease: 'power2.inOut',
    }, 0);
    timeline.to(camera, {
      fov,
      duration,
      ease: 'power2.inOut',
    }, 0);

    return () => timeline.kill();
  }, [cameraTarget, camera]);

  useFrame(() => {
    controlsRef.current?.update();
    cameraPositionBridge.x = camera.position.x;
    cameraPositionBridge.z = camera.position.z;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={55}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.15}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
      enablePan={false}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      makeDefault
    />
  );
}
