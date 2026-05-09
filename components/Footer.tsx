import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative">
      <div className="container-ultra section-y">
        <h2
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: 200 }}
          className="text-[clamp(2rem,5vw,4.8rem)] leading-[1.04] tracking-[-0.04em] text-ink"
        >
          Let&rsquo;s make
          <br />
          <span
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: 200 }}
            className="italic text-ink/90"
          >
            something good.
          </span>
        </h2>

        <div className="mt-10 flex flex-col gap-3 md:mt-12">
          <a
            href={`mailto:${site.email}`}
            data-cursor="visit"
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: 300 }}
            className="group inline-flex max-w-max items-baseline gap-3 text-[clamp(18px,2vw,28px)] italic leading-[1.1] tracking-[-0.015em] text-ink"
          >
            <span className="underline-grow">{site.email}</span>
            <span
              aria-hidden
              className="not-italic transition-transform duration-300 ease-out group-hover:translate-x-1.5"
            >
              →
            </span>
          </a>

          <p
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: 300 }}
            className="mt-2 max-w-md text-[13px] leading-[1.6] text-ink/55"
          >
            {site.footer.tagline}
          </p>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-ultra flex flex-col gap-3 py-6 text-[12px] font-medium uppercase tracking-[0.16em] text-ink/45 md:flex-row md:items-center md:justify-between">
          <span>
            {site.footer.copyright}
            <span className="mx-2 text-ink/25" aria-hidden>
              ·
            </span>
            AI UX Designer
          </span>

          <nav aria-label="External links" className="flex items-center gap-6">
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="visit"
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-ink"
            >
              <span>LinkedIn</span>
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
            <a
              href={site.links.youtube}
              target="_blank"
              rel="noreferrer"
              data-cursor="visit"
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-ink"
            >
              <span>YouTube</span>
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
