import { gsap } from "@/lib/gsap";

/** Main full-page scroller element. */
export function getMainScroller(): HTMLElement | null {
  return document.querySelector("main");
}

/** Top-level section panels inside main (intro + content). */
export function getSectionPanels(main: HTMLElement = getMainScroller()!): HTMLElement[] {
  if (!main) return [];
  return Array.from(main.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );
}

/** Closest section index for the current scroll position. */
export function getActiveSectionIndex(main: HTMLElement = getMainScroller()!): number {
  if (!main) return 0;
  const panels = getSectionPanels(main);
  if (!panels.length) return 0;

  const y = main.scrollTop + main.clientHeight * 0.35;
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;

  panels.forEach((panel, i) => {
    const mid = panel.offsetTop + panel.offsetHeight / 2;
    const dist = Math.abs(mid - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });

  return best;
}

type ScrollOptions = {
  duration?: number;
  ease?: string;
};

/** Smooth-scroll main to a section by index (uses real offsetTop). */
export function scrollToSection(
  index: number,
  { duration = 0.7, ease = "power2.inOut" }: ScrollOptions = {},
) {
  const main = getMainScroller();
  if (!main) return;

  const panels = getSectionPanels(main);
  if (!panels.length) return;

  const clamped = Math.max(0, Math.min(index, panels.length - 1));
  const target = panels[clamped];
  const top = target.offsetTop;

  gsap.killTweensOf(main);
  gsap.to(main, {
    scrollTop: top,
    duration,
    ease,
  });
}

/** Instantly set scroll without animation (loop fades). */
export function jumpToSection(index: number) {
  const main = getMainScroller();
  if (!main) return;
  const panels = getSectionPanels(main);
  if (!panels.length) return;
  const clamped = Math.max(0, Math.min(index, panels.length - 1));
  main.scrollTop = panels[clamped].offsetTop;
}
