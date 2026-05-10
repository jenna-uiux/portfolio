"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

type Item = {
  value: string;
  label: string;
};

type Props = {
  items: Item[];
};

export function ResearchMeta({ items }: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.05 });

  return (
    <div
      ref={ref}
      className="research-meta grid grid-cols-2 gap-y-8 gap-x-6 border-y hairline py-8 md:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.label} data-reveal className="flex flex-col">
          <span className="t-h2 leading-none tracking-[-0.02em] text-ink">
            {item.value}
          </span>
          <span className="mt-3 t-eyebrow-mut">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
