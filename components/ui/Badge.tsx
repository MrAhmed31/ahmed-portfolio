import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[color-mix(in_oklab,var(--primary)_35%,transparent)] bg-[color-mix(in_oklab,var(--surface-2)_80%,transparent)] px-3 py-1 text-xs font-medium text-[var(--text-primary)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
