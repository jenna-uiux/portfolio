"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { WorldExplorer } from "./WorldExplorer";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import s from "./about.module.css";

export function WorldEntrance() {
  const [exploring, setExploring] = useState(false);
  const closeExplorer = useCallback(() => setExploring(false), []);
  const summaryRequested = useRef(false);
  const scrollFromExplorer = useCallback(() => {
    summaryRequested.current = true;
    setExploring(false);
  }, []);
  useEffect(() => {
    if (exploring || !summaryRequested.current) return;
    summaryRequested.current = false;
    // Wait until the modal has restored document scrolling and focus.
    const frame = requestAnimationFrame(() => {
      const summary = document.getElementById("about-summary");
      if (!summary) return;
      history.replaceState(history.state, "", "#about-summary");
      summary.focus({ preventScroll: true });
      summary.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [exploring]);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const frame = useTransform(scrollYProgress, (progress) =>
    `inset(${progress * 8}svh ${progress * 6}vw round ${progress * 32}px)`
  );
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <>
    <section ref={sectionRef} className={s.worldSection}>
      <div className={s.worldStage}>
      <motion.div className={s.worldCard} style={{ clipPath: reduceMotion ? "none" : frame }}>
        <motion.div className={s.worldBackdrop} style={{ scale: reduceMotion ? 1 : imageScale }} aria-hidden="true">
          <Image
            src="/images/about/hero.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className={s.worldImage}
          />
        </motion.div>
        <div className={s.worldShade} aria-hidden="true" />
        <div className={s.worldCopy}>
          <p className={s.worldKicker}>About Jihyeon · AI Product Designer</p>
          <h1>Enter my Mind World.</h1>
          <p className={s.worldDescription}>
            Four islands hold the stories behind how I learn, where I come
            from, what I&apos;m curious about, and how I design.
          </p>
          <div className={s.worldActions}>
            <button type="button" onClick={() => setExploring(true)} className={s.worldLink} aria-haspopup="dialog">
              <span>Explore the islands</span>
              <span aria-hidden="true">→</span>
            </button>
            <a href="#about-summary" className={s.summaryLink} aria-label="TL;DR: jump to About section">
              <span>TL;DR</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
    {exploring && <WorldExplorer onClose={closeExplorer} onScrollToSummary={scrollFromExplorer} />}
    </>
  );
}
