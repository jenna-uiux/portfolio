"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Options = {
  /** CSS selector(s) of children inside scope to reveal. Defaults to `[data-reveal]`. */
  selector?: string;
  /** Stagger between siblings, in seconds. */
  stagger?: number;
  /** Pixels to translate up from. */
  yOffset?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Scroll trigger start position. */
  start?: string;
};

/**
 * Subtle fade-up scroll reveal shared across case-study components.
 * Honors `prefers-reduced-motion`. Returns a ref to attach to the scope element.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: Options = {}
): RefObject<T | null> {
  const {
    selector = "[data-reveal]",
    stagger = 0.06,
    yOffset = 8,
    duration = 0.4,
    start = "top 85%",
  } = options;

  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll(selector);
      if (targets.length === 0) return;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(targets, { autoAlpha: 0, y: yOffset });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration,
        ease: "power2.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reset",
        },
      });
    },
    { scope: ref }
  );

  return ref;
}
