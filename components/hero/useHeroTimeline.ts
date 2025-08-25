"use client";

import { MutableRefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type Refs = {
  pinRef: MutableRefObject<HTMLElement | null>;
  camera: THREE.Camera;
  progressMat?: MutableRefObject<THREE.ShaderMaterial | null>;
};

export function useHeroTimeline({ pinRef, camera, progressMat }: Refs) {
  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    // keep the section pinned briefly so the zoom feels snappy
    const pin = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top+=1", // minimal pin spacing
      pin: true,
      pinSpacing: true,
    });

    // camera zoom timeline (autoplay on enter, reverse on leave back)
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
    });
    tl.to(camera.position, { z: 5.2, duration: 0.9 });

    const enter = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(), // shrink when scrolling back up
    });

    // global page progress -> ring fill
    const global = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const m = progressMat?.current;
        if (m) m.uniforms.uProgress.value = self.progress; // 0..1
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      tl.kill();
      pin.kill();
      enter.kill();
      global.kill();
    };
  }, [pinRef, camera, progressMat]);
}
