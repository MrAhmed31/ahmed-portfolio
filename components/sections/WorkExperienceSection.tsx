"use client";

import { useEffect, useRef } from "react";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/sections/WorkExperienceSection.module.css";

export default function WorkExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-exp='header']", {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: document.querySelector("main") ?? undefined,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from("[data-exp='item']", {
        opacity: 0,
        x: -20,
        stagger: 0.14,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-exp='timeline']",
          scroller: document.querySelector("main") ?? undefined,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="experience-title"
    >
      <div className={styles.inner}>
        <header className={styles.header} data-exp="header">
          <span className={styles.eyebrow}>{content.experience.eyebrow}</span>
          <h2 id="experience-title" className={styles.title}>
            {content.experience.title}
          </h2>
        </header>

        <div className={styles.timeline} data-exp="timeline">
          {profile.experience.map((exp) => (
            <article key={exp.id} className={styles.item} data-exp="item">
              <span className={styles.dot} aria-hidden />
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.role}>{exp.role}</h3>
                  <time className={styles.period}>
                    {exp.period} — {exp.periodEnd}
                  </time>
                </div>

                <div className={styles.companyRow}>
                  <span>{exp.company}</span>
                  <span aria-hidden>·</span>
                  <span>{exp.type}</span>
                  <span aria-hidden>·</span>
                  <span>{exp.location}</span>
                </div>
                <span className={styles.companyShort}>{exp.companyShort}</span>

                <p className={styles.desc}>{exp.desc}</p>

                <ul className={styles.bullets}>
                  {exp.bullets.map((bullet) => (
                    <li key={bullet} className={styles.bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className={styles.tech}>
                  {exp.tech.map((t) => (
                    <span key={t} className={styles.techTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
