"use client";

import { useThemeContext } from "@/components/providers/ThemeProvider";
import { profile } from "@/data/profile";
import { getActiveSectionIndex, scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaBars,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaTimes,
} from "react-icons/fa";

type NavItem = {
  label: string;
  idx: number;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", idx: 0 },
  { label: "About", idx: 2 },
  { label: "Skills", idx: 3 },
  { label: "Projects", idx: 4 },
  { label: "Experience", idx: 5 },
  { label: "Contact", idx: 6 },
];

export default function Navbar() {
  const { theme, toggleTheme, ready } = useThemeContext();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastYRef = useRef(0);
  const rafRef = useRef(0);

  const goTo = useCallback((idx: number) => {
    scrollToSection(idx, { duration: 0.65 });
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const y = main.scrollTop;
        setScrolled(y > 16);
        setActiveIdx(getActiveSectionIndex(main as HTMLElement));
        if (y < 24) {
          setVisible(true);
        } else if (y > lastYRef.current + 12) {
          setVisible(false);
        } else if (y < lastYRef.current - 12) {
          setVisible(true);
        }
        lastYRef.current = y;
      });
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      main.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const activeLabel = useMemo(() => {
    // Hero (1) should highlight Home
    const mapped = activeIdx === 1 ? 0 : activeIdx;
    return NAV_ITEMS.reduce((best, item) =>
      Math.abs(item.idx - mapped) < Math.abs(best.idx - mapped) ? item : best,
    ).label;
  }, [activeIdx]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: visible ? 0 : -110, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-shadow duration-300",
          scrolled &&
            "shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl bg-[color-mix(in_oklab,var(--background)_72%,transparent)] border-b border-[var(--border-glass)]",
          !scrolled && "bg-transparent",
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-[var(--container)] items-center justify-between gap-4 px-6 md:h-[4.5rem] md:px-8"
          aria-label="Primary"
        >
          <button
            type="button"
            onClick={() => goTo(0)}
            className="text-left text-sm font-bold tracking-tight text-[var(--text-primary)] md:text-base"
          >
            {profile.name.first}
            <span className="text-[var(--primary)]">.</span>
            {profile.name.last}
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = activeLabel === item.label;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => goTo(item.idx)}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition",
                      active
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))]"
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                ready && theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-glass)] text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="hidden h-10 items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--secondary))] px-4 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_8px_24px_var(--hover-glow)] transition hover:-translate-y-0.5 sm:inline-flex"
            >
              <FaEnvelope size={12} aria-hidden />
              Email
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-glass)] text-[var(--text-primary)] lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-xl lg:hidden"
          >
            <motion.ul
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="mx-auto flex h-full max-w-[var(--container)] flex-col justify-center gap-2 px-6"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <button
                    type="button"
                    onClick={() => goTo(item.idx)}
                    className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface)] px-5 py-4 text-left text-lg font-semibold text-[var(--text-primary)]"
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
