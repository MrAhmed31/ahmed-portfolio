"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { scrollToSection } from "@/lib/scroll";
import styles from "@/styles/sections/VideoIntro.module.css";

function scrollNext() {
  scrollToSection(1, { duration: 0.55 });
}

function forceSoundOn(video: HTMLVideoElement) {
  video.muted = false;
  video.volume = 1;
  video.defaultMuted = false;
  video.removeAttribute("muted");
}

export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [started, setStarted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [hasVideo, setHasVideo] = useState(true);

  const videoSrc = useMemo(
    () => (isMobile ? "/assets/about-me-mobile.mp4" : "/assets/about-me.mp4"),
    [isMobile],
  );

  // Start click unlocks audio (browser policy) — keep sound on
  useEffect(() => {
    function onLoaderDismissed() {
      setStarted(true);
      setMuted(false);
      const v = videoRef.current;
      if (!v) return;
      forceSoundOn(v);
      v.play()
        .then(() => {
          forceSoundOn(v);
          setMuted(false);
          setPlaying(true);
        })
        .catch(() => {
          // Retry once unmuted inside the same gesture chain
          forceSoundOn(v);
          v.play().catch(() => undefined);
        });
    }

    function onAnimationDone() {
      const v = videoRef.current;
      if (!v) return;
      forceSoundOn(v);
      setMuted(false);
      v.play().catch(() => undefined);
    }

    window.addEventListener("loader-dismissed", onLoaderDismissed);
    window.addEventListener("loader-animation-done", onAnimationDone);
    return () => {
      window.removeEventListener("loader-dismissed", onLoaderDismissed);
      window.removeEventListener("loader-animation-done", onAnimationDone);
    };
  }, []);

  // Keep unmuted if React re-renders
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !started) return;
    forceSoundOn(v);
    setMuted(false);
  }, [started, videoSrc]);

  // Pause when off-screen (saves CPU) — keep mute state
  useEffect(() => {
    const section = sectionRef.current;
    const v = videoRef.current;
    if (!section || !v) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!muted) forceSoundOn(v);
          v.play().catch(() => undefined);
          setPlaying(true);
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [hasVideo, muted]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (!v.paused) {
      v.pause();
      setPlaying(false);
      return;
    }
    if (!muted) forceSoundOn(v);
    v.play().catch(() => undefined);
    setPlaying(true);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    // Prefer staying unmuted; button still allows mute if needed
    const next = !v.muted;
    v.muted = next;
    if (!next) forceSoundOn(v);
    setMuted(next);
  }

  function handleEnded() {
    const main = document.querySelector("main");
    if (main && main.scrollTop < window.innerHeight * 0.35) scrollNext();
  }

  const labelAnim = reduceMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 18 },
        animate: started ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Cinematic intro"
    >
      {hasVideo ? (
        <video
          key={videoSrc}
          ref={videoRef}
          src={started ? videoSrc : undefined}
          playsInline
          loop
          autoPlay={started}
          muted={!started}
          preload={started ? "metadata" : "none"}
          poster="/assets/intro-poster.jpg"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
          onError={() => setHasVideo(false)}
          className={styles.mainVideo}
          style={{ opacity: 1 }}
        />
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

      <motion.div className={styles.heroContent} {...labelAnim}>
        <motion.p
          className={styles.eyebrow}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {content.site.tagline}
        </motion.p>
        <motion.h1
          className={styles.name}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
        >
          {profile.name.full}
        </motion.h1>
        <motion.p
          className={styles.role}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
        >
          {profile.roles.short}
        </motion.p>
      </motion.div>

      {!playing && hasVideo && started && (
        <motion.button
          type="button"
          className={styles.playOverlay}
          onClick={togglePlay}
          aria-label="Play video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
        </motion.button>
      )}

      {hasVideo && started && (
        <motion.div
          className={styles.controls}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
        >
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
        </motion.div>
      )}

      <motion.button
        type="button"
        className={styles.scrollCue}
        onClick={scrollNext}
        aria-label="Scroll to next section"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={started ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        whileHover={reduceMotion ? undefined : { y: -2 }}
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </motion.button>
    </section>
  );
}
