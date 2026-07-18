"use client";

import { useCallback, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/sections/ScreenLoader.module.css";

type ScreenLoaderProps = {
  onDismiss?: () => void;
};

export default function ScreenLoader({ onDismiss }: ScreenLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const centerLineRef = useRef<HTMLDivElement>(null);
  const [dismissing, setDismissing] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleStart = useCallback(() => {
    if (dismissing) return;
    setDismissing(true);

    window.dispatchEvent(new CustomEvent("loader-dismissed"));

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        window.dispatchEvent(new CustomEvent("loader-animation-done"));
        setHidden(true);
        onDismiss?.();
      },
    });

    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.28,
    })
      .to(
        centerLineRef.current,
        {
          scaleX: 0,
          opacity: 0,
          duration: 0.22,
        },
        "-=0.12",
      )
      .to(
        panelTopRef.current,
        {
          yPercent: -100,
          duration: 0.55,
        },
        "-=0.05",
      )
      .to(
        panelBottomRef.current,
        {
          yPercent: 100,
          duration: 0.55,
        },
        "<",
      )
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.2,
        },
        "-=0.1",
      );
  }, [dismissing, onDismiss]);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${hidden ? styles.hidden : ""}`}
      aria-live="polite"
      aria-label="Portfolio intro loader"
    >
      <div ref={panelTopRef} className={styles.panelTop} aria-hidden />
      <div ref={panelBottomRef} className={styles.panelBottom} aria-hidden />
      <div ref={centerLineRef} className={styles.centerLine} aria-hidden />

      <div ref={contentRef} className={styles.content}>
        <div className={styles.monogram}>
          <span className={styles.monogramLine}>Portfolio 2026</span>
          <h1 className={styles.name}>Muhammad Ahmed</h1>
          <p className={styles.subtitle}>Full Stack Developer</p>
        </div>

        <button
          type="button"
          className={styles.startBtn}
          onClick={handleStart}
          disabled={dismissing}
        >
          {dismissing ? "Entering…" : "Start"}
        </button>
      </div>
    </div>
  );
}
