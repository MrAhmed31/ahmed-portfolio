"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/sections/AboutSection.module.css";

const SECTION_INDEX = 2;

function getMainScroller() {
  return document.querySelector("main");
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const typingRef = useRef<number | null>(null);

  const reveal = useCallback(() => {
    if (revealed) return;
    setRevealed(true);

    gsap.fromTo(
      photoRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" },
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.15 },
    );
  }, [revealed]);

  useEffect(() => {
    const main = getMainScroller();
    if (!main) return;

    const threshold = SECTION_INDEX * window.innerHeight - window.innerHeight * 0.45;

    const onScroll = () => {
      if (main.scrollTop >= threshold) {
        reveal();
      }
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => main.removeEventListener("scroll", onScroll);
  }, [reveal]);

  useEffect(() => {
    if (!revealed) return;

    let index = 0;
    const fullText = profile.bio;

    const tick = () => {
      index += 1;
      setTypedText(fullText.slice(0, index));
      if (index < fullText.length) {
        typingRef.current = window.setTimeout(tick, 18);
      }
    };

    typingRef.current = window.setTimeout(tick, 400);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [revealed]);

  const github = profile.socials.find((s) => s.label === "GitHub");
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");
  const email = profile.socials.find((s) => s.label === "Email");

  const marqueeItems = [...profile.marqueeSkills, ...profile.marqueeSkills];

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className={styles.inner}>
        <div
          ref={photoRef}
          className={styles.photoWrap}
          style={{ opacity: revealed ? undefined : 0 }}
        >
          <Image
            src={profile.image}
            alt={profile.name.full}
            fill
            sizes="(max-width: 900px) 80vw, 352px"
          />
        </div>

        <div
          ref={contentRef}
          className={styles.content}
          style={{ opacity: revealed ? undefined : 0 }}
        >
          <span className={styles.eyebrow}>{content.about.eyebrow}</span>
          <h2 id="about-title" className={styles.title}>
            {content.about.title}
          </h2>

          <p className={styles.bio}>
            {typedText}
            {revealed && typedText.length < profile.bio.length && (
              <span className={styles.cursor} aria-hidden />
            )}
          </p>

          <div className={styles.marqueeWrap} aria-hidden>
            <div className={styles.marquee}>
              <div className={styles.marqueeGroup}>
                {marqueeItems.map((skill, i) => (
                  <span key={`${skill}-${i}`} className={styles.skillChip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.socials}>
            {github && (
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <FaGithub size={16} />
                GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <FaLinkedin size={16} />
                LinkedIn
              </a>
            )}
            {email && (
              <a href={email.href} className={styles.socialLink}>
                <FaEnvelope size={16} />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
