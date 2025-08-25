"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Float, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useHeroTimeline } from "./useHeroTimeline";

type Props = {
  pinRef: React.RefObject<HTMLElement | null>;
  onReady?: () => void;
};
function FirstFrameReady({ onReady }: { onReady?: () => void }) {
  const { gl } = useThree();
  const called = useRef(false);
  const [frames, setFrames] = useState(0);

  useFrame(() => {
    if (called.current) return;
    setFrames((f) => {
      const next = f + 1;
      if (next >= 2) {
        // wait 2 frames for env/materials to appear
        called.current = true;
        onReady?.();
      }
      return next;
    });
  });

  return null;
}

/** ultra-thin progress arc shader */
/** luxury progress arc: gradient, rounded tip, shimmer, halo */
function useProgressArcMaterial(
  colorA: string,
  colorB = "#16d3c2",
  inner = 1.6,
  outer = 1.66
) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: true,
        blending: THREE.NormalBlending,
        uniforms: {
          uProgress: { value: 0 }, // 0..1 (we ease this a bit in-shader)
          uTime: { value: 0 }, // shimmer
          uColorA: { value: new THREE.Color(colorA) },
          uColorB: { value: new THREE.Color(colorB) },
          uInner: { value: inner },
          uOuter: { value: outer },
          uFeather: { value: 0.006 }, // soft edge thickness
          uTipRound: { value: 0.03 }, // end-cap roundness
          uGloss: { value: 0.35 }, // highlight strength
          uShimmerAmp: { value: 0.35 }, // shimmer opacity
          uShimmerWidth: { value: 0.06 }, // shimmer width (fraction)
        },
        vertexShader: /* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vPos;
          uniform float uProgress;
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uInner;
          uniform float uOuter;
          uniform float uFeather;
          uniform float uTipRound;
          uniform float uGloss;
          uniform float uShimmerAmp;
          uniform float uShimmerWidth;

          const float TAU = 6.28318530718;

          // smooth min
          float smin(float a, float b, float k) {
            float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
            return mix(b, a, h) - k*h*(1.0 - h);
          }

          void main() {
            float r = length(vPos.xy);
            float a = atan(vPos.y, vPos.x);
            if (a < 0.0) a += TAU;

            // Clockwise from 12 o'clock
            float angleFrac = mod(1.0 - ((a - TAU*0.25) / TAU), 1.0);

            // band with feathered edges
            float inEdge  = smoothstep(uInner - uFeather, uInner + uFeather, r);
            float outEdge = 1.0 - smoothstep(uOuter - uFeather, uOuter + uFeather, r);
            float band = clamp(inEdge * outEdge, 0.0, 1.0);

            // ease the progress slightly for a refined feel (still tied to scroll)
            float p = smoothstep(0.0, 1.0, uProgress);

            // rounded end-cap:
            // distance from the tip along the arc
            float dToTip = clamp((angleFrac - p) / max(uTipRound, 1e-4), 0.0, 1.0);
            // soften the arc cutoff using smooth min between arc mask and round cap
            float arcHard = step(angleFrac, p);
            float arcCap  = 1.0 - smoothstep(0.0, 1.0, dToTip); // 1 at tip, 0 back
            float arc = smin(arcHard, arcCap, 0.15);

            float alpha = band * arc;
            if (alpha < 0.001) discard;

            // gradient along angle
            vec3 baseCol = mix(uColorA, uColorB, angleFrac);

            // glossy highlight band that “travels” subtly with angle
            float glossBand = smoothstep(0.44, 0.5, angleFrac) * (1.0 - smoothstep(0.5, 0.56, angleFrac));
            vec3 glossy = baseCol + (uGloss * glossBand);

            // shimmer pulse (very subtle), moves opposite the fill
            float shimmerCenter = mod(p + 0.15 + 0.12 * sin(uTime * 0.8), 1.0);
            float d = abs(angleFrac - shimmerCenter);
            d = min(d, 1.0 - d); // wrap-around distance
            float shimmer = smoothstep(uShimmerWidth, 0.0, d) * uShimmerAmp;

            vec3 col = glossy + shimmer;

            gl_FragColor = vec4(col, 0.9 * alpha);
          }
        `,
      }),
    [colorA, colorB, inner, outer]
  );

  useEffect(() => {
    matRef.current = material;
    return () => material.dispose();
  }, [material]);

  return { matRef, material };
}

function Content({ pinRef }: Props) {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const ringArc = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // start a little closer but bounded so ring is always visible at final zoom
  useEffect(() => {
    camera.position.set(0, 0.06, 6.2); // start
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // ring color + thickness
  const { matRef: progMatRef, material: progMat } = useProgressArcMaterial(
    "#55D8FF",
    "#1AC7B6",
    1.58,
    1.68
  );

  // play/reverse on scroll direction
  useHeroTimeline({ pinRef, camera, progressMat: progMatRef });

  // idle rotation only
  useFrame((_, dt) => {
    if (knot.current) knot.current.rotation.y += dt * 0.26;
    // tick shader time for shimmer
    if (progMat) (progMat.uniforms as any).uTime.value += dt;
  });

  return (
    <group ref={group}>
      {/* simple lights for metallic sheen */}
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 6, 7]} intensity={1.05} />
      <pointLight position={[-3, -2, -3]} intensity={0.75} />

      {/* SMALLER KNOT so it never eclipses the ring */}
      <Float floatIntensity={0.55} rotationIntensity={0.28}>
        <mesh ref={knot} position={[0, 0.1, 0]}>
          {/* radius 0.8, tube 0.18 — smaller than before */}
          <torusKnotGeometry args={[0.8, 0.18, 180, 10, 2, 3]} />
          <meshPhysicalMaterial
            metalness={1}
            roughness={0.16}
            clearcoat={0.85}
            clearcoatRoughness={0.22}
            reflectivity={1}
            iridescence={0.12}
            color={"#7c3aed"}
            envMapIntensity={1.0}
          />
        </mesh>
      </Float>

      {/* PROGRESS RING — slightly larger than knot */}
      <mesh ref={ringArc} position={[0, 0, -0.05]}>
        <ringGeometry args={[1.58, 1.68, 384]} />
        <primitive object={progMat} attach="material" />
      </mesh>
      {/* subtle halo */}
      <mesh position={[0, 0, -0.051]} scale={[1.01, 1.01, 1.01]}>
        <ringGeometry args={[1.58, 1.695, 256]} />
        <meshBasicMaterial
          color={"#55D8FF"}
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* clean reflections */}
      <Environment preset="city">
        <Lightformer
          form="rect"
          intensity={0.9}
          scale={[2.8, 0.6, 1]}
          position={[-2.5, 0, 3]}
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          scale={[2.8, 0.6, 1]}
          position={[2.5, 0, 3]}
        />
        <Lightformer
          form="ring"
          intensity={1.4}
          scale={1.8}
          rotation-x={Math.PI / 2}
          position={[0, 2, 1.8]}
        />
      </Environment>
    </group>
  );
}

const Scene = ({ pinRef, onReady }: Props) => {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.4]}
        camera={{ fov: 45, near: 0.1, far: 100 }}
      >
        {/* ❌ remove background color so canvas is transparent */}
        {/* <color attach="background" args={["#0A0E10"]} /> */}
        <FirstFrameReady onReady={onReady} />

        <Content pinRef={pinRef} />
      </Canvas>
    </div>
  );
};

export default Scene;
