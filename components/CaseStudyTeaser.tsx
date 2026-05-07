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
  const number = String(index + 1).padStart(2, "0");
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
          className="group block"
        >
          <div className="flex items-baseline justify-between gap-6 pb-6">
            <div className="flex items-baseline gap-4">
              <span className="font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink/45">
                {number}
              </span>
              <h2
                id={`teaser-${project.slug}`}
                className="text-[clamp(1.6rem,2.6vw,2.6rem)] font-light tracking-[-0.035em] leading-[1.1] transition-colors group-hover:text-brown"
              >
                {project.title}
              </h2>
            </div>
            <span className="hidden font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink/45 md:block">
              {project.category} · {project.year}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-12 md:items-end md:pb-6">
            <p className="max-w-[58ch] whitespace-pre-line text-[16px] font-light leading-[1.65] text-ink/80 md:col-span-9">
              {project.summary}
            </p>
            <div className="flex items-center justify-end gap-2 text-[14px] md:col-span-3">
              <span className="underline-grow font-light text-ink/80 group-hover:text-brown transition-colors">
                Read case study
              </span>
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="transition-transform duration-500 group-hover:-translate-y-1"
          >
            <CoverMedia cover={project.cover} ratio="21/9" />
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
