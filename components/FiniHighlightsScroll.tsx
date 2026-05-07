"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

/** Scroll track length per slide (× viewport). Lower = less whitespace before next section. */
const VH_PER_SLIDE = 88;

type Highlight = {
  src: string;
  alt: string;
  titleLines: string[];
  body: string;
  textSide: "left" | "right";
  emphasizeImage?: boolean;
  textColumnYClass?: string;
};

type Props = {
  highlights: Highlight[];
};

export function FiniHighlightsScroll({ highlights }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const n = highlights.length;

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `${n * VH_PER_SLIDE}vh` }}
    >
      <div className="sticky top-0 flex h-screen overflow-hidden">
        <div className="relative mx-auto h-full w-full max-w-[1420px] px-4 md:px-6">
          {highlights.map((h, i) => (
            <HighlightFrame
              key={i}
              highlight={h}
              index={i}
              total={n}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HighlightFrame({
  highlight,
  index,
  total,
  progress,
}: {
  highlight: Highlight;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const per = 1 / total;
  const mid = (index + 0.5) * per;

  const inStart = index === 0 ? 0 : mid - per * 0.75;
  const inEnd = mid - per * 0.15;
  const outStart = mid + per * 0.15;
  const outEnd = index === total - 1 ? 1 : mid + per * 0.75;

  const opacity = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );

  const y = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [index === 0 ? 0 : 48, 0, 0, index === total - 1 ? 0 : -48]
  );

  const scale = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [index === 0 ? 1 : 0.97, 1, 1, index === total - 1 ? 1 : 0.97]
  );

  const imageY = useTransform(progress, [inStart, outEnd], [60, -60]);
  const imageScale = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [1.06, 1, 1, 1.06]
  );

  const paragraphs = highlight.body.split("\n\n").filter(Boolean);

  const textColumnYClass =
    highlight.textColumnYClass ?? "md:-translate-y-12";

  const textBlock = (
    <div
      className={[
        "flex max-w-[380px] flex-col justify-center px-6 md:px-2",
        textColumnYClass,
      ].join(" ")}
    >
      <h3 className="text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
        {highlight.titleLines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h3>
      <div className="mt-4 space-y-2.5 text-[16px] leading-[1.55] text-[#646464]">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );

  const imageFrameClass = highlight.emphasizeImage
    ? "h-[min(88vh,880px)]"
    : "h-[min(76vh,700px)]";

  const imageBlock = (
    <div className="relative flex min-w-0 items-center justify-center overflow-hidden">
      <motion.div
        className={["relative w-full", imageFrameClass].join(" ")}
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={highlight.src}
          alt={highlight.alt}
          fill
          className="object-contain object-center"
          sizes={
            highlight.emphasizeImage
              ? "(min-width: 768px) 85vw, 100vw"
              : "(min-width: 768px) 70vw, 100vw"
          }
          priority={index === 0}
        />
      </motion.div>
    </div>
  );

  const gridCols =
    highlight.textSide === "left"
      ? "md:[grid-template-columns:minmax(260px,380px)_1fr]"
      : "md:[grid-template-columns:1fr_minmax(260px,380px)]";

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center pt-10 md:pt-12"
      style={{ opacity, y, scale }}
    >
      <div
        className={[
          "grid w-full items-center gap-8 md:gap-12",
          gridCols,
        ].join(" ")}
      >
        {highlight.textSide === "left" ? (
          <>
            {textBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            <div className="md:justify-self-end">{textBlock}</div>
          </>
        )}
      </div>
    </motion.div>
  );
}
