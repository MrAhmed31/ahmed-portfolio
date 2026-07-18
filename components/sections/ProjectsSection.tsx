"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "@/styles/sections/ProjectsSection.module.css";

function getMainScroller() {
  return document.querySelector("main");
}

function hasLiveDemo(live: string, github: string) {
  return Boolean(live) && live !== github && !live.includes("github.com");
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const projects = profile.projects;
  const projectCount = projects.length;
  const activeProject = useMemo(
    () => projects[activeIndex] ?? projects[0],
    [activeIndex, projects],
  );

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
    const t = window.setTimeout(refresh, 120);

    return () => {
      window.clearTimeout(t);
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
            <motion.span
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {content.projects.eyebrow}
            </motion.span>
            <motion.h2
              id="projects-title"
              className={styles.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              {content.projects.title}
            </motion.h2>
            <motion.a
              href="https://github.com/MrAhmed31?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubAll}
              whileHover={{ x: 4 }}
            >
              View all on GitHub →
            </motion.a>
          </div>

          <div className={styles.meta}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                className={styles.counter}
                aria-live="polite"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <span className={styles.counterAccent}>
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span> / {String(projectCount).padStart(2, "0")}</span>
              </motion.div>
            </AnimatePresence>
            <div className={styles.progressTrack} aria-hidden>
              <motion.div
                className={styles.progressBar}
                style={{ scaleX: progress }}
              />
            </div>
          </div>
        </header>

        <div className={styles.trackOuter}>
          <div ref={trackRef} className={styles.track}>
            {projects.map((project, index) => {
              const liveReady = hasLiveDemo(project.live, project.github);
              return (
                <article key={project.id} className={styles.slide}>
                  <div className={styles.slideInner}>
                    <motion.div
                      className={styles.imageCard}
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    >
                      <Image
                        src={project.image}
                        alt={`${project.title} cover`}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        priority={index === 0}
                        unoptimized={project.image.endsWith(".svg")}
                      />
                      <motion.div
                        className={styles.imageGlow}
                        animate={
                          activeIndex === index
                            ? { opacity: 0.55 }
                            : { opacity: 0.15 }
                        }
                        transition={{ duration: 0.35 }}
                        aria-hidden
                      />
                    </motion.div>

                    <motion.div
                      className={styles.copy}
                      initial={{ opacity: 0, x: 28 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.45 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className={styles.type}>{project.type}</span>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.subtitle}>{project.subtitle}</p>
                      <p className={styles.desc}>{project.desc}</p>

                      <motion.div
                        className={styles.tech}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={{
                          hidden: {},
                          visible: {
                            transition: { staggerChildren: 0.05 },
                          },
                        }}
                      >
                        {project.tech.map((t) => (
                          <motion.span
                            key={t}
                            className={styles.techTag}
                            variants={{
                              hidden: { opacity: 0, y: 10, scale: 0.96 },
                              visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            whileHover={{ y: -3, scale: 1.05 }}
                          >
                            {t}
                          </motion.span>
                        ))}
                      </motion.div>

                      <div className={styles.actions}>
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.btnGhost}
                          whileHover={{ y: -3, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <FaGithub size={14} />
                          GitHub
                        </motion.a>
                        {liveReady ? (
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnPrimary}
                            whileHover={{ y: -3, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <FaExternalLinkAlt size={12} />
                            Live Demo
                          </motion.a>
                        ) : (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnPrimary}
                            whileHover={{ y: -3, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <FaExternalLinkAlt size={12} />
                            View Repo
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
