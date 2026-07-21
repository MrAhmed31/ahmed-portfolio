import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  "aria-labelledby"?: string;
};

export function Section({
  id,
  children,
  className,
  containerClassName,
  "aria-labelledby": labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative flex min-h-[100vh] min-h-[100svh] items-center py-16 md:py-20",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
