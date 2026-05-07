import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="container-wide section-y grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="text-mono-kicker">Contact · 2026</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.6rem)] font-extralight leading-[1] tracking-[-0.04em]">
            Let&rsquo;s make
            <br />
            <span className="italic text-brown">something good.</span>
          </h2>
          <p className="mt-5 max-w-md text-[14px] font-light leading-[1.65] text-ink/70">
            {site.footer.tagline}
          </p>
        </div>

        <div className="md:col-span-5 self-end">
          <ul className="divide-y hairline border-y hairline text-[14px]">
            <li className="flex items-center justify-between py-3">
              <span className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink/45">
                Email
              </span>
              <a
                href={`mailto:${site.email}`}
                className="font-light underline-grow hover:text-brown transition-colors"
              >
                {site.email}
              </a>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink/45">
                LinkedIn
              </span>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="font-light underline-grow hover:text-brown transition-colors"
              >
                /in/jihyeon-jang
              </a>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink/45">
                YouTube
              </span>
              <a
                href={site.links.youtube}
                target="_blank"
                rel="noreferrer"
                className="font-light underline-grow hover:text-brown transition-colors"
              >
                @Vibemaker
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-wide flex items-center justify-between pb-10 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink/45">
        <span>{site.footer.copyright}</span>
        <span>Jihyeon Jang · AI UX Designer</span>
      </div>
    </footer>
  );
}
