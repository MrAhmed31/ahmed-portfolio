"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/sections/VideoIntro.module.css";

const CinematicLayer = dynamic(
  () => import("@/components/three/CinematicLayer"),
  { ssr: false },
);

function getMainScroller() {
  return document.querySelector("main");
}

export default function VideoIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(greetingRef.current, { opacity: 0, y: 24, duration: 0.7 })
        .from(
          nameRef.current,
          { opacity: 0, y: 40, duration: 0.9 },
          "-=0.4",
        )
        .from(
          roleRef.current,
          { opacity: 0, y: 24, duration: 0.7 },
          "-=0.5",
        )
        .from(
          taglineRef.current,
          { opacity: 0, y: 20, duration: 0.7 },
          "-=0.45",
        )
        .from(
          hintRef.current,
          { opacity: 0, y: 16, duration: 0.6 },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = useCallback(() => {
    const main = getMainScroller();
    if (!main) return;
    gsap.to(main, {
      scrollTop: window.innerHeight,
      duration: 1.2,
      ease: "power3.inOut",
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Intro">
      <div className={styles.gradient} aria-hidden />
      <div className={styles.threeLayer}>
        <CinematicLayer />
      </div>
      <div className={styles.vignette} aria-hidden />

      <div ref={innerRef} className={styles.inner}>
        <p ref={greetingRef} className={styles.greeting}>
          {content.intro.greeting}
        </p>
        <h1 ref={nameRef} className={styles.name}>
          {profile.name.full}
        </h1>
        <p ref={roleRef} className={styles.role}>
          {profile.roles.detailed}
        </p>
        <p ref={taglineRef} className={styles.tagline}>
          {profile.tagline}
        </p>
      </div>

      <button
        ref={hintRef}
        type="button"
        className={styles.scrollHint}
        onClick={scrollToNext}
        aria-label={content.intro.scrollHint}
      >
        <span>{content.intro.scrollHint}</span>
        <span className={styles.scrollLine} aria-hidden />
      </button>
    </section>
  );
}
