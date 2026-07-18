"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/sections/VideoIntro.module.css";

const CinematicLayer = dynamic(
  () => import("@/components/three/CinematicLayer"),
  { ssr: false, loading: () => null },
);

function scrollNext() {
  const main = document.querySelector("main");
  if (!main) return;
  gsap.to(main, {
    scrollTop: window.innerHeight,
    duration: 0.9,
    ease: "power3.inOut",
  });
}

export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const greetRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [hasVideo, setHasVideo] = useState(true);
  const [enableThree, setEnableThree] = useState(false);

  const videoSrc = useMemo(
    () => (isMobile ? "/assets/about-me-mobile.mp4" : "/assets/about-me.mp4"),
    [isMobile],
  );

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      greetRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    )
      .fromTo(
        nameRef.current,
        { opacity: 0, x: -48 },
        { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
        "-=0.2",
      )
      .fromTo(
        roleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.35",
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.1",
      );
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const t = gsap.fromTo(
      v,
      { opacity: 0 },
      { opacity: 1, duration: 0.9, ease: "power2.out" },
    );
    return () => {
      t.kill();
    };
  }, [hasVideo, videoSrc]);

  useEffect(() => {
    function onLoaderDismissed() {
      const v = videoRef.current;
      if (v) v.play().catch(() => undefined);
      if (!isMobile && !reduceMotion) {
        window.setTimeout(() => setEnableThree(true), 500);
      }
    }
    window.addEventListener("loader-dismissed", onLoaderDismissed);
    return () =>
      window.removeEventListener("loader-dismissed", onLoaderDismissed);
  }, [isMobile, reduceMotion]);

  useEffect(() => {
    function onAnimationDone() {
      const v = videoRef.current;
      if (!v) return;
      v.play().catch(() => undefined);
    }
    window.addEventListener("loader-animation-done", onAnimationDone);
    return () =>
      window.removeEventListener("loader-animation-done", onAnimationDone);
  }, []);

  // Pause video when off-screen to save battery/CPU
  useEffect(() => {
    const section = sectionRef.current;
    const v = videoRef.current;
    if (!section || !v) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (playing) v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [playing, hasVideo]);

  const dismissHint = useCallback(() => {
    if (!hintRef.current) {
      setShowHint(false);
      return;
    }
    gsap.to(hintRef.current, {
      opacity: 0,
      y: -8,
      duration: 0.28,
      onComplete: () => setShowHint(false),
    });
  }, []);

  useEffect(() => {
    if (!showHint) return;
    const id = window.setTimeout(() => dismissHint(), 7000);
    return () => window.clearTimeout(id);
  }, [showHint, dismissHint]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play().catch(() => undefined);
      setPlaying(true);
    }
  }

  function toggleMute() {
    if (showHint) dismissHint();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function handleEnded() {
    const main = document.querySelector("main");
    if (main && main.scrollTop < window.innerHeight * 0.35) scrollNext();
  }

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Cinematic intro"
    >
      {hasVideo ? (
        <>
          {!isMobile && (
            <video
              src="/assets/ambient.mp4"
              autoPlay
              muted
              playsInline
              loop
              preload="none"
              aria-hidden
              className={styles.bgVideo}
            />
          )}
          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            loop
            preload="metadata"
            poster="/assets/intro-poster.jpg"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={handleEnded}
            onError={() => setHasVideo(false)}
            className={styles.mainVideo}
          />
        </>
      ) : (
        <div className={styles.portraitFallback} aria-hidden>
          <Image
            src={profile.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.portraitImage}
          />
        </div>
      )}

      <div className={styles.overlay} />

      {!isMobile && enableThree && <CinematicLayer />}

      <div className={styles.heroContent}>
        <p ref={greetRef} className={styles.eyebrow}>
          {content.site.tagline}
        </p>
        <h1 ref={nameRef} className={styles.name}>
          {profile.name.first}
          <br />
          {profile.name.last}
        </h1>
        <p ref={roleRef} className={styles.role}>
          {profile.roles.detailed}
        </p>
      </div>

      {!playing && hasVideo && (
        <button
          type="button"
          className={styles.playOverlay}
          onClick={togglePlay}
          aria-label="Play video"
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle
              cx="36"
              cy="36"
              r="35"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
            />
            <polygon points="29,20 56,36 29,52" fill="white" />
          </svg>
        </button>
      )}

      {showHint && hasVideo && (
        <button
          ref={hintRef}
          type="button"
          className={styles.soundHint}
          onClick={toggleMute}
        >
          <span className={styles.soundPulse} />
          <span>Tap for sound</span>
        </button>
      )}

      {hasVideo && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="1" width="4" height="12" rx="1" />
                <rect x="8" y="1" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <polygon points="2,1 13,7 2,13" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path
                  d="M2 5.5h2.5L8 3v10l-3.5-2.5H2V5.5z"
                  fill="currentColor"
                  stroke="none"
                />
                <line x1="10" y1="5" x2="14" y2="11" />
                <line x1="14" y1="5" x2="10" y2="11" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path
                  d="M2 5.5h2.5L8 3v10l-3.5-2.5H2V5.5z"
                  fill="currentColor"
                  stroke="none"
                />
                <path d="M10.5 5.5C11.8 6.5 12.5 7.2 12.5 8s-.7 1.5-2 2.5" />
                <path d="M12 3.5C14 5 15 6.4 15 8s-1 3-3 4.5" />
              </svg>
            )}
          </button>
        </div>
      )}

      <button
        ref={scrollRef}
        type="button"
        className={styles.scrollCue}
        onClick={scrollNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>
    </section>
  );
}
