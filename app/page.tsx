"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ScreenLoader from "@/components/sections/ScreenLoader";
import VideoIntro from "@/components/sections/VideoIntro";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { gsap } from "@/lib/gsap";

const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100vh" }} />,
});
const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> },
);
const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> },
);
const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> },
);
const WorkExperienceSection = dynamic(
  () => import("@/components/sections/WorkExperienceSection"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> },
);
const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> },
);

const TOTAL = 7; // intro, hero, about, skills, projects, experience, contact

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const idxRef = useRef(0);
  const busyRef = useRef(false);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const loopOverlayRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [readySections, setReadySections] = useState(false);

  useEffect(() => {
    let idleTimer = 0;
    function unlock() {
      // Defer heavy sections so intro video stays smooth
      idleTimer = window.setTimeout(() => setReadySections(true), 450);
    }
    window.addEventListener("loader-animation-done", unlock);
    const id = window.setTimeout(unlock, 5000);
    return () => {
      window.removeEventListener("loader-animation-done", unlock);
      window.clearTimeout(id);
      window.clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    function fadeLoop(targetScrollTop: number, targetIdx: number) {
      busyRef.current = true;
      tweenRef.current?.kill();
      gsap.to(loopOverlayRef.current, {
        opacity: 1,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          el!.scrollTop = targetScrollTop;
          idxRef.current = targetIdx;
          gsap.to(loopOverlayRef.current, {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
            onComplete: () => {
              window.setTimeout(() => {
                busyRef.current = false;
              }, 80);
            },
          });
        },
      });
    }

    function goTo(idx: number) {
      if (idx >= TOTAL) idx = 0;
      if (idx < 0) idx = TOTAL - 1;
      if (idx === idxRef.current || busyRef.current) return;

      if (idxRef.current === TOTAL - 1 && idx === 0) {
        fadeLoop(0, 0);
        return;
      }

      if (idxRef.current === 0 && idx === TOTAL - 1) {
        fadeLoop((TOTAL - 1) * window.innerHeight, TOTAL - 1);
        return;
      }

      idxRef.current = idx;
      busyRef.current = true;
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(el, {
        scrollTop: idx * window.innerHeight,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () => {
          window.setTimeout(() => {
            busyRef.current = false;
          }, 100);
        },
      });
    }

    function onScroll() {
      idxRef.current = Math.round(el!.scrollTop / window.innerHeight);
    }

    function onFooterLoop() {
      if (busyRef.current) return;
      fadeLoop(0, 0);
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("footer-loop-back", onFooterLoop);

    if (!isMobile) {
      function onWheel(e: WheelEvent) {
        e.preventDefault();
        if (busyRef.current) return;
        goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1));
      }

      let touchY = 0;
      function onTouchStart(e: TouchEvent) {
        touchY = e.touches[0].clientY;
      }
      function onTouchEnd(e: TouchEvent) {
        const dy = touchY - e.changedTouches[0].clientY;
        if (Math.abs(dy) < 40 || busyRef.current) return;
        goTo(idxRef.current + (dy > 0 ? 1 : -1));
      }

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchend", onTouchEnd, { passive: true });

      return () => {
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("scroll", onScroll);
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("footer-loop-back", onFooterLoop);
        tweenRef.current?.kill();
      };
    }

    // Mobile: native scroll for better responsiveness
    let mTouchY = 0;
    function onMobileTouchStart(e: TouchEvent) {
      mTouchY = e.touches[0].clientY;
    }
    function onMobileTouchEnd(e: TouchEvent) {
      const dy = mTouchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      const atBottom = el!.scrollTop + el!.clientHeight >= el!.scrollHeight - 8;
      const atTop = el!.scrollTop < 8;
      if (dy > 0 && atBottom) fadeLoop(0, 0);
      if (dy < 0 && atTop) {
        fadeLoop(el!.scrollHeight - el!.clientHeight, TOTAL - 1);
      }
    }

    el.addEventListener("touchstart", onMobileTouchStart, { passive: true });
    el.addEventListener("touchend", onMobileTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onMobileTouchStart);
      el.removeEventListener("touchend", onMobileTouchEnd);
      window.removeEventListener("footer-loop-back", onFooterLoop);
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <>
      {showLoader && <ScreenLoader onDismiss={() => setShowLoader(false)} />}

      <div
        ref={loopOverlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] bg-black opacity-0"
      />

      <ScrollProgress />
      <Navbar />

      <main
        ref={mainRef}
        className="h-dvh overflow-y-auto overscroll-none"
        style={{ height: "100vh" }}
      >
        <VideoIntro />
        {readySections && (
          <>
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <WorkExperienceSection />
            <ContactSection />
          </>
        )}
      </main>
    </>
  );
}
