"use client";

import Link from "next/link";

export function ScrollIndicator({
  targetId,
  label = "Scroll",
}: {
  targetId: string;
  label?: string;
}) {
  return (
    <Link
      href={`#${targetId}`}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-muted hover:text-ink transition-colors flex flex-col items-center gap-2"
    >
      <span>{label}</span>
      <span aria-hidden className="block h-8 w-px bg-current animate-pulse" />
    </Link>
  );
}
