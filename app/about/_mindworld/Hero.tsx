"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import s from "./Hero.module.css";

type Props = {
  visible: boolean;
  onExplore: () => void;
};

export function Hero({ visible, onExplore }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLElement[]>([]);
  const introPlayedRef = useRef(false);

  const setItem = (el: HTMLElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  // Intro reveal — runs once on first mount
  useGSAP(
    () => {
      if (introPlayedRef.current) return;
      introPlayedRef.current = true;

      gsap.set(itemsRef.current, { y: 24, opacity: 0, filter: "blur(8px)" });

      gsap.to(itemsRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.18,
        delay: 0.3,
      });
    },
    { scope: wrapRef }
  );

  // Fade-out when leaving hero
  useEffect(() => {
    if (!wrapRef.current) return;
    if (visible) {
      gsap.to(wrapRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out",
      });
    } else {
      gsap.to(wrapRef.current, {
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.7,
        ease: "power2.inOut",
      });
    }
  }, [visible]);

  return (
    <section
      ref={wrapRef}
      className={`${s.wrap} ${visible ? s.visible : ""}`}
      aria-hidden={!visible}
    >
      <div className={s.inner}>
        <p ref={setItem as never} className={s.eyebrow}>
          About Me
        </p>

        <h1 ref={setItem as never} className={s.headline}>
          I&apos;m an AI Product Designer.
        </h1>

        <p ref={setItem as never} className={s.subcopy}>
          I packed my background into 4 islands. See what shapes how I work.
        </p>
        <div ref={setItem as never} className={s.ctaWrap}>
          <button
            type="button"
            className={s.cta}
            onClick={onExplore}
            aria-label="Explore Islands"
          >
            <span>Explore Islands</span>
            <span className={s.arrow} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
