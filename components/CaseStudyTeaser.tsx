"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { CaseStudy } from "@/lib/projects";
import { CoverMedia } from "./CoverMedia";

type Props = {
  project: CaseStudy;
  index: number;
};

export function CaseStudyTeaser({ project }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.22 });
  // Still "near" while any pixel is around the viewport — used to delay reset.
  const nearViewport = useInView(ref, { amount: 0, margin: "40px" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    if (inView) {
      setVisible(true);
      return;
    }
    // Only snap back to the soft start state once the block is off-screen,
    // so leaving never fades the content while you're still looking at it.
    if (!nearViewport) {
      setVisible(false);
    }
  }, [inView, nearViewport, reduceMotion]);

  return (
    <section
      id={`work-${project.slug}`}
      aria-labelledby={`teaser-${project.slug}`}
      className="section-y"
    >
      <div className="container-ultra">
        <Link
          href={`/work/${project.slug}`}
          aria-label={`Open ${project.title} case study`}
          data-cursor="read"
          className="group block"
        >
          <motion.div
            ref={ref}
            initial={reduceMotion ? false : { opacity: 1, y: 44 }}
            animate={
              reduceMotion || visible
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: 44 }
            }
            transition={
              visible
                ? { duration: 1.35, ease: [0.33, 0.0, 0.2, 1] }
                : { duration: 0 }
            }
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h3
                id={`teaser-${project.slug}`}
                className="text-[16px] font-normal tracking-[-0.005em] text-ink/80"
              >
                {project.title}
              </h3>
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-ink/15 bg-ink/[0.03] px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-ink/65"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mb-8 max-w-[80%] whitespace-pre-line text-[28px] font-normal leading-[1.25] tracking-[-0.018em] text-ink md:mb-10">
              {project.summary}
            </p>

            <div className="relative overflow-hidden rounded-lg">
              <div className="origin-center scale-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                <CoverMedia
                  cover={project.teaserCover ?? project.cover}
                  ratio={(project.teaserCover ?? project.cover).ratio ?? "21/9"}
                />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_100%,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_38%,transparent_68%)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />

              <div
                aria-hidden
                className="pointer-events-none absolute bottom-5 left-6 z-[1] flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 translate-y-3"
              >
                <span>Read case study</span>
                <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
