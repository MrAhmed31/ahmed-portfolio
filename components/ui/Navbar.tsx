"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaEnvelope,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import { profile } from "@/data/profile";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/ui/Navbar.module.css";

type NavItem = {
  label: string;
  idx: number;
};

function getMainScroller() {
  return document.querySelector("main");
}

function getSectionIndexFromScroll(scrollTop: number, vh: number) {
  return Math.round(scrollTop / vh);
}

export default function Navbar() {
  const { theme, toggleTheme, ready } = useThemeContext();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState("");
  const lastScrollRef = useRef(0);

  const projectCount = profile.projects.length;

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Home", idx: 0 },
      { label: "About", idx: 2 },
      { label: "Skills", idx: 3 },
      { label: "Projects", idx: 4 },
      { label: "Experience", idx: 4 + projectCount },
      { label: "Contact", idx: 5 + projectCount },
    ],
    [projectCount],
  );

  const goTo = useCallback((idx: number) => {
    const main = getMainScroller();
    if (!main) return;
    gsap.to(main, {
      scrollTop: idx * window.innerHeight,
      duration: 1.2,
      ease: "power3.inOut",
    });
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const main = getMainScroller();
    if (!main) return;

    const onScroll = () => {
      const current = main.scrollTop;
      const vh = window.innerHeight;

      setScrolled(current > 24);
      setActiveIdx(getSectionIndexFromScroll(current, vh));

      if (current <= 0) {
        setVisible(true);
      } else if (current > lastScrollRef.current + 8) {
        setVisible(false);
      } else if (current < lastScrollRef.current - 8) {
        setVisible(true);
      }

      lastScrollRef.current = current;
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const tick = () => setClock(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (idx: number) => activeIdx === idx;

  return (
    <>
      <nav
        className={`${styles.nav} ${visible ? styles.navVisible : styles.navHidden} ${scrolled ? styles.navScrolled : ""}`}
        aria-label="Primary"
      >
        <button
          type="button"
          className={styles.brand}
          onClick={() => goTo(0)}
          aria-label={`${profile.name.full} — go to home`}
        >
          <span className={styles.brandName}>{profile.name.full}</span>
          <span className={styles.brandTag}>{profile.roles.short}</span>
        </button>

        <div className={styles.links}>
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`${styles.navLink} ${isActive(item.idx) ? styles.navLinkActive : ""}`}
              onClick={() => goTo(item.idx)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <span className={styles.clock} aria-label="Karachi time">
            PKT {clock}
          </span>

          <a
            href={`mailto:${profile.email}`}
            className={styles.emailBtn}
          >
            <FaEnvelope size={12} />
            Email
          </a>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            disabled={!ready}
          >
            {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
          </button>

          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <FaBars size={16} />
          </button>
        </div>
      </nav>

      <div
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`${styles.iconBtn} ${styles.mobileClose}`}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <FaTimes size={16} />
        </button>

        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={styles.mobileLink}
            onClick={() => goTo(item.idx)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
