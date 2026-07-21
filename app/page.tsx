"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ScreenLoader from "@/components/sections/ScreenLoader";
import VideoIntro from "@/components/sections/VideoIntro";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { gsap } from "@/lib/gsap";
import {
  getActiveSectionIndex,
  getSectionPanels,
  jumpToSection,
} from "@/lib/scroll";

const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), {
  loading: () => <div style={{ minHeight: "100svh" }} aria-hidden />,
});
const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection"),
  { loading: () => <div style={{ minHeight: "100svh" }} aria-hidden /> },
);
const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection"),
  { loading: () => <div style={{ minHeight: "100svh" }} aria-hidden /> },
);
const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection"),
  { loading: () => <div style={{ minHeight: "100svh" }} aria-hidden /> },
);
const WorkExperienceSection = dynamic(
  () => import("@/components/sections/WorkExperienceSection"),
  { loading: () => <div style={{ minHeight: "100svh" }} aria-hidden /> },
);
const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection"),
  { loading: () => <div style={{ minHeight: "100svh" }} aria-hidden /> },
);

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
      idleTimer = window.setTimeout(() => setReadySections(true), 120);
    }
    window.addEventListener("loader-animation-done", unlock);
    const id = window.setTimeout(unlock, 2800);
    return () => {
      window.removeEventListener("loader-animation-done", unlock);
      window.clearTimeout(id);
      window.clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    function fadeLoop(targetIdx: number) {
      busyRef.current = true;
      tweenRef.current?.kill();
      gsap.to(loopOverlayRef.current, {
        opacity: 1,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          jumpToSection(targetIdx);
          idxRef.current = targetIdx;
          gsap.to(loopOverlayRef.current, {
            opacity: 0,
            duration: 0.28,
            ease: "power2.out",
            onComplete: () => {
              window.setTimeout(() => {
                busyRef.current = false;
              }, 60);
            },
          });
        },
      });
    }

    function goTo(idx: number) {
      const panels = getSectionPanels(el!);
      const total = panels.length;
      if (!total) return;

      if (idx >= total) idx = 0;
      if (idx < 0) idx = total - 1;
      if (idx === idxRef.current || busyRef.current) return;

      if (idxRef.current === total - 1 && idx === 0) {
        fadeLoop(0);
        return;
      }

      if (idxRef.current === 0 && idx === total - 1) {
        fadeLoop(total - 1);
        return;
      }

      const target = panels[idx];
      idxRef.current = idx;
      busyRef.current = true;
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(el, {
        scrollTop: target.offsetTop,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          window.setTimeout(() => {
            busyRef.current = false;
          }, 80);
        },
      });
    }

    function onScroll() {
      idxRef.current = getActiveSectionIndex(el!);
    }

    function onFooterLoop() {
      if (busyRef.current) return;
      fadeLoop(0);
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("footer-loop-back", onFooterLoop);

    if (!isMobile) {
      function onWheel(e: WheelEvent) {
        const target = e.target as HTMLElement | null;
        if (target?.closest("[data-carousel-root]")) return;

        e.preventDefault();
        if (busyRef.current) return;
        goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1));
      }

      let touchY = 0;
      function onTouchStart(e: TouchEvent) {
        touchY = e.touches[0].clientY;
      }
      function onTouchEnd(e: TouchEvent) {
        const target = e.target as HTMLElement | null;
        if (target?.closest("[data-carousel-root]")) return;
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

    let mTouchY = 0;
    function onMobileTouchStart(e: TouchEvent) {
      mTouchY = e.touches[0].clientY;
    }
    function onMobileTouchEnd(e: TouchEvent) {
      const dy = mTouchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      const atBottom = el!.scrollTop + el!.clientHeight >= el!.scrollHeight - 8;
      const atTop = el!.scrollTop < 8;
      if (dy > 0 && atBottom) fadeLoop(0);
      if (dy < 0 && atTop) {
        const panels = getSectionPanels(el!);
        fadeLoop(Math.max(0, panels.length - 1));
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
  }, [readySections]);

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
        style={{ height: "100svh" }}
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
