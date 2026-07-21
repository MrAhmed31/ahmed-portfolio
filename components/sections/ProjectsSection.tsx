"use client";

import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { content } from "@/data/content";
import { profile, type Project } from "@/data/profile";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";

function hasLiveDemo(live: string, github: string) {
  return Boolean(live) && live !== github && !live.includes("github.com");
}

function ProjectCard({ project }: { project: Project }) {
  const liveReady = hasLiveDemo(project.live, project.github);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--border-glass)] bg-[var(--surface-2)] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-[color-mix(in_oklab,var(--primary)_45%,transparent)] hover:shadow-[0_24px_60px_var(--hover-glow)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0b1120]">
        <Image
          src={project.image}
          alt={`${project.title} cover`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
          className="object-cover transition duration-500 group-hover:scale-110"
          unoptimized={project.image.endsWith(".svg")}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(11,17,32,0.55),transparent_45%)]" />
        <div className="absolute left-4 top-4">
          <Badge className="backdrop-blur-md">{project.type}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] md:text-2xl">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--accent)] md:text-base">
            {project.subtitle}
          </p>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)] md:text-[0.95rem]">
          {project.desc}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--border-glass)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-2.5 py-1 text-[0.7rem] text-[var(--text-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border-glass)] px-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <FaGithub size={14} aria-hidden />
            GitHub
          </a>
          <a
            href={liveReady ? project.live : project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--secondary))] px-4 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_10px_28px_var(--hover-glow)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            <FaExternalLinkAlt size={12} aria-hidden />
            {liveReady ? "Live Demo" : "View Repo"}
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ],
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
    },
    plugins,
  );

  const [selected, setSelected] = useState(0);
  const projects = profile.projects;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    startTransition(() => setSelected(index));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const frame = requestAnimationFrame(() => onSelect());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const dots = useMemo(() => projects.map((p) => p.id), [projects]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!emblaApi) return;
      const section = document.getElementById("projects");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.7 && rect.bottom > 80;
      if (!visible) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi, scrollNext, scrollPrev]);

  return (
    <Section
      id="projects"
      aria-labelledby="projects-title"
      className="bg-[var(--background)]"
    >
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <Heading
          eyebrow={content.projects.eyebrow}
          title={content.projects.title}
          titleId="projects-title"
          className="mb-0"
        >
          <a
            href="https://github.com/MrAhmed31?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--accent)]"
          >
            View all on GitHub →
          </a>
        </Heading>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <AnimatePresence mode="wait">
            <motion.p
              key={selected}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-mono text-sm text-[var(--text-muted)]"
              aria-live="polite"
            >
              <span className="text-[var(--primary)]">
                {String(selected + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(projects.length).padStart(2, "0")}
            </motion.p>
          </AnimatePresence>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous project"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-glass)] bg-[var(--surface)] text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next project"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-glass)] bg-[var(--surface)] text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden"
        ref={emblaRef}
        data-carousel-root
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
      >
        <div className="flex touch-pan-y">
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-0 shrink-0 grow-0 basis-[88%] pl-0 pr-4 sm:basis-[70%] md:basis-[48%] md:pr-6 lg:basis-[40%]"
              role="group"
              aria-roledescription="slide"
              aria-label={project.title}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-8 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Project pagination"
      >
        {dots.map((id, index) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-label={`Go to project ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              selected === index
                ? "w-8 bg-[linear-gradient(90deg,var(--primary),var(--secondary))]"
                : "w-2.5 bg-[color-mix(in_oklab,var(--text-muted)_45%,transparent)] hover:bg-[var(--text-muted)]",
            )}
          />
        ))}
      </div>
    </Section>
  );
}
