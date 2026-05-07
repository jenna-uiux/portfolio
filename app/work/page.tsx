import type { Metadata } from "next";
import Link from "next/link";
import { CoverMedia } from "@/components/CoverMedia";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work and ongoing experiments.",
};

export default function WorkIndexPage() {
  return (
    <div className="container-wide pt-32 pb-24">
      <header className="max-w-3xl">
        <p className="text-mono-kicker">Work · 2026</p>
        <h1 className="mt-4 text-[clamp(2.4rem,4.5vw,4.4rem)] font-extralight leading-[0.98] tracking-[-0.045em]">
          Selected work.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] font-light leading-[1.65] text-ink/75">
          AI UX projects and creative systems built with design craft, product
          logic, and working prototypes.
        </p>
      </header>

      <ul className="mt-16 divide-y hairline border-y hairline">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              className="group grid items-center gap-6 py-6 md:grid-cols-12"
            >
              <span className="font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink/45 tabular-nums md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="md:col-span-4">
                <h3 className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-light leading-[1.05] tracking-[-0.035em] transition-colors group-hover:text-brown">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-[13px] font-sans font-medium uppercase tracking-[0.16em] text-ink/45">
                  {project.category}
                </p>
              </div>

              <p className="text-[14px] font-light leading-[1.6] text-ink/70 md:col-span-3">
                {project.tagline}
              </p>

              <div className="md:col-span-3 transition-transform duration-500 group-hover:-translate-y-0.5">
                <CoverMedia cover={project.cover} ratio="3/2" compact />
              </div>

              <div className="flex items-center justify-between gap-3 text-[13px] md:col-span-1 md:justify-end">
                <span className="font-sans font-medium uppercase tracking-[0.16em] text-ink/45">
                  {project.year}
                </span>
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
