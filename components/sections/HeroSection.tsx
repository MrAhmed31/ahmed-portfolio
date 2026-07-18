"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/sections/HeroSection.module.css";

const HeroBackground = dynamic(
  () => import("@/components/three/HeroBackground"),
  { ssr: false, loading: () => null },
);

const PROJECTS_SECTION_INDEX = 4;

function getMainScroller() {
  return document.querySelector("main");
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      tl.from("[data-hero='eyebrow']", { opacity: 0, y: 20, duration: 0.6 })
        .from(
          "[data-hero='first']",
          { opacity: 0, y: 48, duration: 0.8 },
          "-=0.35",
        )
        .from(
          "[data-hero='last']",
          { opacity: 0, y: 48, duration: 0.8 },
          "-=0.65",
        )
        .from(
          "[data-hero='role']",
          { opacity: 0, y: 24, duration: 0.6 },
          "-=0.45",
        )
        .from(
          "[data-hero='tagline']",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.4",
        )
        .from(
          "[data-hero='pill']",
          { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 },
          "-=0.35",
        )
        .from(
          "[data-hero='actions']",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.25",
        )
        .from(
          "[data-hero='image']",
          { opacity: 0, scale: 0.92, duration: 0.9 },
          "-=0.7",
        )
        .from(
          "[data-hero='stat']",
          { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 },
          "-=0.5",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = useCallback(() => {
    const main = getMainScroller();
    if (!main) return;
    gsap.to(main, {
      scrollTop: PROJECTS_SECTION_INDEX * window.innerHeight,
      duration: 1.4,
      ease: "power3.inOut",
    });
  }, []);

  const scrollToContact = useCallback(() => {
    const main = getMainScroller();
    if (!main) return;
    const contactIndex = 5 + profile.projects.length;
    gsap.to(main, {
      scrollTop: contactIndex * window.innerHeight,
      duration: 1.4,
      ease: "power3.inOut",
    });
  }, []);

  const github = profile.socials.find((s) => s.label === "GitHub");
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Hero">
      <div className={styles.bgLayer}>
        <HeroBackground />
      </div>
      <div className={styles.vignette} aria-hidden />

      <div className={styles.grid}>
        <div className={styles.copy}>
          <span className={styles.eyebrow} data-hero="eyebrow">
            {content.site.tagline}
          </span>

          <div className={styles.nameBlock}>
            <span className={styles.firstName} data-hero="first">
              {profile.name.first}
            </span>
            <span className={styles.lastName} data-hero="last">
              {profile.name.last}
            </span>
          </div>

          <p className={styles.role} data-hero="role">
            {profile.roles.detailed}
          </p>

          <p className={styles.tagline} data-hero="tagline">
            {profile.tagline}
          </p>

          <div className={styles.pills}>
            {content.hero.pills.map((pill) => (
              <motion.span
                key={pill}
                className={styles.pill}
                data-hero="pill"
                whileHover={{ y: -3, scale: 1.04 }}
              >
                {pill}
              </motion.span>
            ))}
          </div>

          <div className={styles.actions} data-hero="actions">
            <motion.button
              type="button"
              className={styles.ctaPrimary}
              onClick={scrollToProjects}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Projects
            </motion.button>
            <motion.button
              type="button"
              className={styles.ctaGhost}
              onClick={scrollToContact}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch
            </motion.button>

            <div className={styles.socials}>
              {github && (
                <motion.a
                  href={github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="GitHub"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub size={18} />
                </motion.a>
              )}
              {linkedin && (
                <motion.a
                  href={linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="LinkedIn"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin size={18} />
                </motion.a>
              )}
            </div>
          </div>

          <p className={styles.freelanceNote}>{content.hero.freelanceNote}</p>
        </div>

        <div className={styles.visual}>
          <div className={styles.imageCard} data-hero="image">
            {profile.available && (
              <div className={styles.badge}>
                <span className={styles.badgeDot} aria-hidden />
                {content.hero.availableLabel}
              </div>
            )}
            <div className={styles.imageWrap}>
              <Image
                src={profile.image}
                alt={profile.name.full}
                fill
                sizes="(max-width: 960px) 100vw, 420px"
                priority
              />
            </div>
          </div>

          <div className={styles.stats}>
            {profile.stats.map((stat) => (
              <div
                key={stat.label}
                className={styles.statCard}
                data-hero="stat"
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
