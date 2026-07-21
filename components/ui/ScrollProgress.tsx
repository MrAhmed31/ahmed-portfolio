"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const scroller = document.querySelector("main");
    if (!scroller) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const max = scroller.scrollHeight - scroller.clientHeight;
        const progress = max > 0 ? scroller.scrollTop / max : 0;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`;
        }
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[100] h-[3px]"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-[linear-gradient(90deg,var(--accent),var(--accent-2))] will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
