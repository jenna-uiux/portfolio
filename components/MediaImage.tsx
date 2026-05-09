"use client";

import Image from "next/image";
import { useState } from "react";

import type { ImageRatio } from "@/lib/projects";

const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

type Props = {
  src: string;
  alt: string;
  ratio?: ImageRatio;
  maxWidth?: number;
  className?: string;
  fallbackHint?: string;
  objectFit?: "cover" | "contain";
};

export function MediaImage({
  src,
  alt,
  ratio = "16/9",
  maxWidth,
  className = "",
  fallbackHint,
  objectFit = "contain",
}: Props) {
  const [errored, setErrored] = useState(false);

  const sizes = maxWidth
    ? `(min-width: 1024px) ${maxWidth}px, 100vw`
    : "(min-width: 1024px) 900px, 100vw";

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-lg",
        errored ? "border border-dashed border-ink/18 bg-white/40" : "bg-white",
        ratioClass[ratio],
        className,
      ].join(" ")}
      style={maxWidth ? { maxWidth, marginInline: "auto" } : undefined}
    >
      {errored ? (
        <FallbackOverlay hint={fallbackHint ?? src} description={alt} />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized
          quality={100}
          className={objectFit === "cover" ? "object-cover" : "object-contain"}
          priority={false}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

function FallbackOverlay({
  hint,
  description,
}: {
  hint: string;
  description: string;
}) {
  return (
    <>
      <div aria-hidden className="absolute inset-0 grain opacity-20" />
      <div className="absolute left-4 top-4 t-mono">Drop file here</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <p className="max-w-[34ch] t-caption">{description}</p>
        <p className="mt-3 max-w-[44ch] break-all t-mono">{hint}</p>
      </div>
    </>
  );
}
