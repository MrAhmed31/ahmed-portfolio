"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(c);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const PALETTE = [
  new THREE.Color("#e0f2fe"),
  new THREE.Color("#7dd3fc"),
  new THREE.Color("#38bdf8"),
];

export default function HeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth;
    let H = mount.clientHeight;
    let disposed = false;
    let visible = true;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 28;

    const count = 280;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      speeds[i] = 0.15 + Math.random() * 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      map: makeSprite(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(mount);

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      if (!visible) return;

      const t = clock.getElapsedTime();
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i += 2) {
        const iy = i * 3 + 1;
        pos.array[iy] += Math.sin(t * speeds[i] + i) * 0.002;
      }
      pos.needsUpdate = true;
      points.rotation.y = t * 0.025 + mouse.x * 0.12;
      points.rotation.x = mouse.y * 0.06;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      W = mount.clientWidth;
      H = mount.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      material.map?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-0" aria-hidden />;
}
