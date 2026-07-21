"use client";

import { useEffect, useRef } from "react";

/** Lightweight custom cursor — paused when tab is hidden / on touch devices. */
export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!rafRef.current && activeRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.18);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.18);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      const dx = Math.abs(pos.current.x - mouse.current.x);
      const dy = Math.abs(pos.current.y - mouse.current.y);
      if ((dx > 0.35 || dy > 0.35) && activeRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const onVisibility = () => {
      activeRef.current = document.visibilityState === "visible";
      if (!activeRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
      style={{
        background: "var(--accent)",
        boxShadow:
          "0 0 18px color-mix(in oklab, var(--accent) 70%, transparent)",
      }}
    />
  );
}
