"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/lib/projects";
import { CoverMedia } from "./CoverMedia";

type Props = {
  project: CaseStudy;
  index: number;
};

export function CaseStudyTeaser({ project, index }: Props) {
  return (
    <section
      id={index === 0 ? "work" : `work-${project.slug}`}
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

          <p className="mb-8 max-w-[80%] whitespace-pre-line t-h2-tight text-ink md:mb-10">
            {project.summary}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden rounded-lg"
          >
            <div className="transition-transform duration-700 ease-out group-hover:scale-[1.025]">
              <CoverMedia cover={project.cover} ratio="21/9" />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-5 left-6 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 translate-y-3 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
            >
              <span>Read case study</span>
              <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">
                →
              </span>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
