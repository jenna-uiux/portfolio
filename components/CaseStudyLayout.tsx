"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { CaseStudy } from "@/lib/projects";
import {
  ContentBlockRenderer,
  MediaRenderer,
  RichText,
  SectionBlock,
} from "./CaseStudyBlocks";
import { FiniHighlightsScroll } from "./FiniHighlightsScroll";
import { CoverMedia } from "./CoverMedia";
import { ImageSlot } from "./ImageSlot";
import { ThemeController } from "./ThemeController";

type Props = {
  project: CaseStudy;
};

export function CaseStudyLayout({ project }: Props) {
  const sectionKey = project.sections.map((s) => s.id).join(",");
  const [activeId, setActiveId] = useState<string>(
    project.sections[0]?.id ?? ""
  );
  const INLINE_MEDIA_TOKEN = "[[MEDIA_AFTER_BODY]]";

  useEffect(() => {
    const ids = sectionKey.split(",").filter(Boolean);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (els.length === 0) return;

    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) {
        if (el.offsetTop <= mid) current = el.id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionKey]);

  const accentOverride: CSSProperties | undefined =
    project.slug === "strawberry-matcha"
      ? ({
          "--accent": "#788449",
          "--accent-orange": "#788449",
          "--accent-soft": "rgba(120, 132, 73, 0.14)",
          "--brown": "#788449",
          "--eyebrow": "#788449",
        } as CSSProperties)
      : undefined;

  return (
    <div className="pt-28 pb-24" style={accentOverride}>
      {project.theme === "dark" ? <ThemeController theme="dark" /> : null}
      <div className="container-ultra grid gap-12 md:grid-cols-12">
        <aside
          aria-label="Case study outline"
          className="md:col-span-3 md:sticky md:top-24 md:self-start"
        >
          <p className="t-h4">{project.title}</p>

          <nav className="mt-8 hidden md:block">
            <ul className="space-y-1">
              {project.sections.map((s) => (
                <OutlineLink
                  key={s.id}
                  id={s.id}
                  label={s.title}
                  active={activeId === s.id}
                />
              ))}
            </ul>
          </nav>

          <div className="mt-10 hidden md:block">
            <Link
              href="/work"
              className="t-caption hover:text-ink transition-colors underline-grow"
            >
              ← Back to work
            </Link>
          </div>
        </aside>

        <article className="md:col-span-9">
          <header className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-7">
              <h1 className="font-normal leading-[1.02] tracking-[-0.02em] text-ink text-[clamp(48px,5.8vw,72px)] [font-family:'Instrument_Serif',serif]">
                {project.title}
              </h1>
              <p className="mt-10 max-w-[20ch] font-sans text-[24px] font-medium leading-[1.35] tracking-[-0.015em] text-[#171717] md:max-w-[26ch]">
                {project.tagline}
              </p>
            </div>

            <dl className="md:col-span-5 divide-y divide-ink/10">
              <Meta label="Role" value={project.role} />
              <Meta label="Tools" value={project.tools.join(", ")} />
              <Meta label="Focus" value={project.focus.join(", ")} />
              {project.timeline ? (
                <Meta label="Timeline" value={project.timeline} />
              ) : null}
            </dl>
          </header>

          <div className="mt-10">
            <CoverMedia cover={project.cover} ratio={project.cover.ratio ?? "16/9"} />
          </div>

          <div className="mt-12">
            {project.sections.map((s) => {
              const contentBlockRhythm =
                project.slug === "fini" &&
                (s.id === "build-iterate" || s.id === "design-build")
                  ? "section-rhythm-loose"
                  : project.slug === "strawberry-matcha"
                    ? "section-rhythm-matcha"
                  : "section-rhythm";
              const useSentenceHeadline =
                project.slug === "strawberry-matcha" || project.slug === "fini";
              const isAeonContext =
                project.slug === "aeon" && s.id === "context";
              const isAeonBackground =
                project.slug === "aeon" && s.id === "background";
              const firstBlock = s.contentBlocks?.[0];
              const aeonBackgroundPinsKicker =
                isAeonBackground &&
                firstBlock?.kind === "backgroundPinnedDeck" &&
                Boolean(firstBlock.kicker?.trim());
              const contentBlocksWrapperClass =
                project.slug === "fini" && s.id === "research"
                  ? `mt-10 ${contentBlockRhythm}`
                  : s.body.trim()
                    ? `mt-12 ${contentBlockRhythm}`
                    : isAeonContext
                      ? "mt-7 md:mt-9 lg:mt-11 section-rhythm section-rhythm-aeon-context"
                      : isAeonBackground
                        ? aeonBackgroundPinsKicker
                          ? `mt-0 ${contentBlockRhythm}`
                          : `mt-2 md:mt-3 ${contentBlockRhythm}`
                        : !s.body.trim() && !s.eyebrow
                          ? `mt-3 ${contentBlockRhythm}`
                          : `mt-6 ${contentBlockRhythm}`;
              const isFiniFinalProduct =
                project.slug === "fini" && s.id === "final-product";
              return (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-24 section-padding"
              >
                <div>
                  {!aeonBackgroundPinsKicker ? (
                    <p className="t-eyebrow whitespace-nowrap">{s.title}</p>
                  ) : null}

                  {s.eyebrow ? (
                    useSentenceHeadline ? (
                      <h2
                        className={[
                          "mt-3 max-w-[80%]",
                          isFiniFinalProduct ? "t-h3-serif" : "t-h3",
                        ].join(" ")}
                      >
                        {s.eyebrow}
                      </h2>
                    ) : project.slug === "aeon" ? (
                      <h3 className="mt-3 max-w-[95%] text-[36px] font-medium leading-[1.25] tracking-[-0.02em] text-ink">
                        {s.eyebrow}
                      </h3>
                    ) : (
                      <h3 className="mt-3 t-h3">{s.eyebrow}</h3>
                    )
                  ) : null}

                  {s.body.trim() ? (
                    <div className="mt-6 w-full max-w-none prose-rhythm t-body">
                      {(() => {
                        const hasInlineMedia =
                          Boolean(s.mediaAfterBody?.length) &&
                          s.body.includes(INLINE_MEDIA_TOKEN);

                        if (!hasInlineMedia) {
                          return s.body.split("\n\n").map((para, i) => (
                            <p key={i}>
                              <RichText text={para} />
                            </p>
                          ));
                        }

                        const [before = "", after = ""] =
                          s.body.split(INLINE_MEDIA_TOKEN);

                        return (
                          <>
                            {before
                              .trim()
                              .split("\n\n")
                              .filter(Boolean)
                              .map((para, i) => (
                                <p key={`b-${i}`}>
                                  <RichText text={para} />
                                </p>
                              ))}

                            <div className="min-w-0 space-y-8">
                              {s.mediaAfterBody?.map((m, i) => (
                                <MediaRenderer key={`m-${i}`} media={m} />
                              ))}
                            </div>

                            {after
                              .trim()
                              .split("\n\n")
                              .filter(Boolean)
                              .map((para, i) => (
                                <p key={`a-${i}`}>
                                  <RichText text={para} />
                                </p>
                              ))}
                          </>
                        );
                      })()}
                    </div>
                  ) : null}

                  {s.mediaAfterBody &&
                  s.mediaAfterBody.length > 0 &&
                  !s.body.includes(INLINE_MEDIA_TOKEN) ? null : (
                    <>
                      {s.bullets ? (
                        <ul className="mt-6 w-full max-w-none divide-y hairline border-y hairline">
                          {s.bullets.map((b, i) => (
                            <li
                              key={i}
                              className="flex items-baseline gap-3 py-3 t-body-sm"
                            >
                              <span className="t-mono text-brown">→</span>
                              <span>
                                <RichText text={b} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {s.pull ? (
                        <blockquote className="pull-quote mt-8 max-w-[40ch]">
                          {s.pull}
                        </blockquote>
                      ) : null}

                      {s.contentBlocks && s.contentBlocks.length > 0 ? (
                        <div className={contentBlocksWrapperClass}>
                          {s.contentBlocks.map((block, i) => (
                            <ContentBlockRenderer key={i} block={block} />
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}

                  {s.mediaAfterBody &&
                  s.mediaAfterBody.length > 0 &&
                  !s.body.includes(INLINE_MEDIA_TOKEN) ? (
                    <div className="mt-8 min-w-0 space-y-8">
                      {s.mediaAfterBody.map((m, i) => (
                        <MediaRenderer key={i} media={m} />
                      ))}
                    </div>
                  ) : null}

                  {s.mediaAfterBody &&
                  s.mediaAfterBody.length > 0 &&
                  !s.body.includes(INLINE_MEDIA_TOKEN) ? (
                    <div className="mt-6 min-w-0 space-y-8">
                      {s.bullets ? (
                        <ul className="w-full max-w-none divide-y hairline border-y hairline">
                          {s.bullets.map((b, i) => (
                            <li
                              key={i}
                              className="flex items-baseline gap-3 py-3 t-body-sm"
                            >
                              <span className="t-mono text-brown">→</span>
                              <span>
                                <RichText text={b} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {s.pull ? (
                        <blockquote className="pull-quote max-w-[40ch]">
                          {s.pull}
                        </blockquote>
                      ) : null}

                      {s.contentBlocks && s.contentBlocks.length > 0 ? (
                        <div className={contentBlockRhythm}>
                          {s.contentBlocks.map((block, i) => (
                            <ContentBlockRenderer key={i} block={block} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {s.blocks && s.blocks.length > 0 ? (
                  <div className="mt-14 space-y-14">
                    {s.blocks.map((block, i) => (
                      <SectionBlock key={i} block={block} />
                    ))}
                  </div>
                ) : null}

                {s.image || (s.media && s.media.length > 0) ? (
                  <div
                    className={
                      project.slug === "fini" &&
                      (s.id === "research" || s.id === "challenge")
                        ? "mt-3"
                        : "mt-12"
                    }
                  >
                    {s.mediaHeading ? (
                      <p className="mb-2 t-caption">{s.mediaHeading}</p>
                    ) : null}
                    <div className="space-y-10">
                      {s.image ? (
                        <ImageSlot
                          filename={s.image.filename}
                          description={s.image.description}
                          ratio={s.image.ratio ?? "16/9"}
                        />
                      ) : null}
                      {(() => {
                        const media = s.media ?? [];
                        const allHighlights =
                          media.length > 0 &&
                          media.every(
                            (m) =>
                              m.kind === "image" &&
                              Boolean(m.src) &&
                              Boolean(m.finiHighlight)
                          );

                        if (allHighlights) {
                          const highlights = media.flatMap((m) =>
                            m.kind === "image" && m.src && m.finiHighlight
                              ? [
                                  {
                                    src: m.src,
                                    alt: m.description,
                                    titleLines: m.finiHighlight.titleLines,
                                    body: m.finiHighlight.body,
                                    textSide: m.finiHighlight.textSide,
                                    emphasizeImage: m.finiHighlight.emphasizeImage,
                                    textColumnYClass:
                                      m.finiHighlight.textColumnYClass,
                                  },
                                ]
                              : []
                          );
                          return (
                            <FiniHighlightsScroll highlights={highlights} />
                          );
                        }

                        return media.map((m, i) => (
                          <MediaRenderer key={i} media={m} />
                        ));
                      })()}
                    </div>
                  </div>
                ) : null}
              </section>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-10">
            <Link
              href="/work"
              className="t-caption hover:text-ink transition-colors underline-grow"
            >
              ← All work
            </Link>
            {project.externalLink ? (
              <a
                href={project.externalLink.href}
                target="_blank"
                rel="noreferrer"
                className="t-caption hover:text-brown transition-colors underline-grow"
              >
                {project.externalLink.label} →
              </a>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}

function OutlineLink({
  id,
  label,
  active,
}: {
  id: string;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <a
        href={`#${id}`}
        className={[
          "group relative flex items-center gap-3 py-1 transition-colors t-caption",
          active ? "!text-ink" : "hover:!text-ink",
        ].join(" ")}
      >
        <span
          aria-hidden
          className={[
            "block h-px bg-current transition-all duration-500 ease-out",
            active ? "w-6 opacity-80" : "w-2 opacity-40 group-hover:w-4",
          ].join(" ")}
        />
        <span>{label}</span>
      </a>
    </li>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-6 py-3.5 last:pb-0 sm:grid-cols-[6.5rem_1fr]">
      <dt className="font-sans text-[13px] font-medium text-ink">{label}</dt>
      <dd className="min-w-0 text-[14px] font-light leading-[1.5] text-ink/75">
        {value}
      </dd>
    </div>
  );
}
