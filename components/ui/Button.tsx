"use client";

import { cn } from "@/lib/utils";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: ReactNode;
  className?: string;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-white shadow-[0_10px_30px_var(--hover-glow)] hover:brightness-110",
  secondary:
    "border-transparent bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[color-mix(in_oklab,var(--surface-2)_80%,var(--primary))]",
  ghost:
    "border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[color-mix(in_oklab,var(--surface-2)_55%,transparent)]",
  outline:
    "border-[color-mix(in_oklab,var(--text-primary)_20%,transparent)] bg-transparent text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      className,
      children,
      href,
      type = "button",
      ...props
    },
    ref,
  ) {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-full border font-semibold tracking-wide uppercase transition duration-200 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
      variantClass[variant],
      sizeClass[size],
      className,
    );

    if (href) {
      return (
        <a href={href} className={classes} {...(props as object)}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
