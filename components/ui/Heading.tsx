import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  titleId?: string;
  className?: string;
  children?: ReactNode;
};

export function Heading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  titleId,
  className,
  children,
}: HeadingProps) {
  return (
    <header
      className={cn(
        "mb-10 md:mb-12",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
          {subtitle}
        </p>
      ) : null}
      {children}
    </header>
  );
}
