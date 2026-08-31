import Image from "next/image";

import { RichText } from "./CaseStudyBlocks";

type ReflectionItem = {
  number: string;
  title: string;
  body: string;
};

type Props = {
  items: ReflectionItem[];
  photo?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
    href?: string;
  };
};

export function ReflectionInsights({ items, photo }: Props) {
  return (
    <div>
      <div className="space-y-12 md:space-y-16">
        {items.map((item) => (
          <article
            key={item.number}
            className="grid gap-4 md:grid-cols-12 md:gap-10"
          >
            <div className="md:col-span-5">
              <h3 className="text-[24px] font-medium leading-[1.3] tracking-[-0.015em] text-ink md:whitespace-nowrap">
                <RichText text={item.title} />
              </h3>
            </div>
            <div className="md:col-span-7">
              <p className="text-[16px] font-light leading-[1.7] text-[color:var(--body)]">
                <RichText text={item.body} />
              </p>
            </div>
          </article>
        ))}
      </div>

      {photo ? (
        <figure className="relative mt-[clamp(64px,8vw,112px)] px-1 pb-3 pt-5">
          <div
            aria-hidden
            className="absolute inset-x-2 bottom-0 top-8 rotate-[1.2deg] rounded-xl bg-[color:var(--accent-orange)]/15 md:inset-x-6"
          />
          <div className="relative -rotate-[0.8deg] transition-transform duration-500 ease-out hover:rotate-0">
            <div className="overflow-hidden rounded-lg border-[6px] border-white bg-white shadow-[0_18px_55px_rgba(23,23,23,0.14)]">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 1100px, 100vw"
                className="h-auto w-full"
              />
            </div>
            <span className="absolute -right-2 -top-4 rotate-[3deg] rounded-full bg-[color:var(--accent-orange)] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white md:right-5">
              Recognition
            </span>
          </div>

          <figcaption className="relative mt-5 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-end md:gap-8">
            <p className="t-caption">{photo.caption}</p>
            {photo.href ? (
              <a
                href={photo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[13px] text-ink underline decoration-ink/30 underline-offset-[0.25em] transition-colors hover:decoration-ink"
              >
                View Spring Show page ↗
              </a>
            ) : null}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
