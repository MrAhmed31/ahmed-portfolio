"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "@/styles/sections/ProjectsSection.module.css";

function getMainScroller() {
  return document.querySelector("main");
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const projectCount = profile.projects.length;

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const main = getMainScroller();

    if (!section || !sticky || !track || !main) return;

    const ctx = gsap.context(() => {
      const getScrollDistance = () =>
        Math.max(track.scrollWidth - window.innerWidth, window.innerWidth);

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: sticky,
          scrub: 1,
          scroller: main,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            const index = Math.min(
              projectCount - 1,
              Math.round(self.progress * (projectCount - 1)),
            );
            setActiveIndex(index);
          },
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, [projectCount]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={{ height: `${projectCount * 100}vh` }}
      aria-labelledby="projects-title"
    >
      <div ref={stickyRef} className={styles.sticky}>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>{content.projects.eyebrow}</span>
            <h2 id="projects-title" className={styles.title}>
              {content.projects.title}
            </h2>
          </div>

          <div className={styles.meta}>
            <div className={styles.counter} aria-live="polite">
              <span className={styles.counterAccent}>
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span> / {String(projectCount).padStart(2, "0")}</span>
            </div>
            <div className={styles.progressTrack} aria-hidden>
              <div
                className={styles.progressBar}
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>
        </header>

        <div className={styles.trackOuter}>
          <div ref={trackRef} className={styles.track}>
            {profile.projects.map((project) => (
              <article key={project.id} className={styles.slide}>
                <div className={styles.slideInner}>
                  <div className={styles.imageCard}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  </div>

                  <div className={styles.copy}>
                    <span className={styles.type}>{project.type}</span>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.subtitle}>{project.subtitle}</p>
                    <p className={styles.desc}>{project.desc}</p>

                    <div className={styles.tech}>
                      {project.tech.map((t) => (
                        <span key={t} className={styles.techTag}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className={styles.actions}>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnGhost}
                      >
                        <FaGithub size={14} />
                        GitHub
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnPrimary}
                      >
                        <FaExternalLinkAlt size={12} />
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
