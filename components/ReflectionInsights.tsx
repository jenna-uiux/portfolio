import Image from "next/image";

import { RichText } from "./CaseStudyBlocks";

type ReflectionItem = {
  number: string;
  title: string;
  body: string;
};

type Props = {
  items: ReflectionItem[];
  layout?: "editorial";
  photo?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
    href?: string;
  };
};

export function ReflectionInsights({ items, photo, layout }: Props) {
  if (layout === "editorial") {
    return (
      <div className={photo ? "space-y-8 md:space-y-10" : "h-full border-t border-ink/15 px-1 pb-4 pt-7 lg:pr-8"}>
        <div className="space-y-10">
          {!photo ? (
            <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--body)]">What I learned</p>
          ) : null}
          {items.map((item) => (
            <article key={item.number}>
              <h3 className={photo ? "font-sans text-[26px] font-medium leading-[1.3] tracking-[-0.02em] text-ink md:text-[32px]" : "max-w-[24ch] text-[24px] font-medium leading-[1.3] tracking-[-0.015em] text-ink"}>
                <RichText text={item.title} />
              </h3>
              <p className={`${photo ? "max-w-[82ch]" : "max-w-[58ch]"} mt-5 text-[16px] font-light leading-[1.7] text-[color:var(--body)]`}><RichText text={item.body} /></p>
            </article>
          ))}
        </div>
        {photo ? (
          <figure className="min-w-0 overflow-hidden rounded-2xl border border-ink/10 bg-white">
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 768px) 72vw, 100vw" className="aspect-[16/9] w-full object-cover" />
            <figcaption className="flex flex-col gap-3 p-5 md:p-6 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
              <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">Recognition</p>
              <p className="mt-2 text-[14px] leading-[1.5] text-ink">{photo.caption}</p>
              </div>
              {photo.href ? (
                <a href={photo.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center text-[13px] text-[color:var(--body)] underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  View Spring Show page ↗
                </a>
              ) : null}
            </figcaption>
          </figure>
        ) : null}
      </div>
    );
  }
  return (
    <div>
      <div className="space-y-12 md:space-y-16">
        {items.map((item) => (
          <article key={item.number} className="max-w-[62ch]">
            <h3 className="text-[24px] font-medium leading-[1.3] tracking-[-0.015em] text-ink">
              <RichText text={item.title} />
            </h3>
            <p className="mt-4 text-[16px] font-light leading-[1.7] text-[color:var(--body)]">
              <RichText text={item.body} />
            </p>
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
