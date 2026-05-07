import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Fun",
  description:
    "Vibe coding, visual references, small experiments, and creative work from Jihyeon Jang.",
};

const funItems = [
  {
    title: "Vibemaker",
    category: "Vibe coding",
    description:
      "My build-in-public lab for documenting how design ideas become real prototypes with AI coding tools.",
    href: "/work/vibemaker",
    image: {
      filename: "vibemaker_thumbnail.jpg",
      description: "YouTube channel still",
    },
  },
  {
    title: "YouTube process logs",
    category: "Storytelling",
    description:
      "Short notes and videos about making things with Cursor, Framer, and whatever tool gets the idea moving.",
    href: "https://www.youtube.com/@Vibemaker_l0l",
    image: {
      filename: "fun_youtube.jpg",
      description: "Process log thumbnail",
    },
  },
  {
    title: "Visual notes",
    category: "Visual direction",
    description:
      "Soft interiors, warm neutrals, gentle contrast — references that keep my AI work from feeling too synthetic.",
    image: {
      filename: "fun_visual-notes.jpg",
      description: "Moodboard reference frame",
    },
  },
];

export default function FunPage() {
  return (
    <div className="container-wide pt-32 pb-24">
      <header className="max-w-3xl">
        <p className="text-mono-kicker">Fun · Side studio</p>
        <h1 className="mt-4 text-[clamp(2.4rem,4.5vw,4.4rem)] font-extralight leading-[0.98] tracking-[-0.045em]">
          A softer lab for fast ideas.
        </h1>
        <p className="mt-5 max-w-[55ch] text-[15px] font-light leading-[1.65] text-ink/75">
          Vibe coding, visual direction, and small creative experiments that
          keep my design practice loose and alive.
        </p>
      </header>

      <ul className="mt-16 divide-y hairline border-y hairline">
        {funItems.map((item, i) => {
          const card = (
            <article className="group grid items-start gap-6 py-8 md:grid-cols-12">
              <span className="font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink/45 md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="md:col-span-4">
                <h2 className="text-[clamp(1.5rem,2.4vw,2.2rem)] font-light leading-[1.1] tracking-[-0.035em] transition-colors group-hover:text-brown">
                  {item.title}
                </h2>
                <p className="mt-2 font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-ink/45">
                  {item.category}
                </p>
              </div>

              <p className="max-w-[50ch] text-[14px] font-light leading-[1.65] text-ink/70 md:col-span-3">
                {item.description}
              </p>

              <div className="md:col-span-3 transition-transform duration-500 group-hover:-translate-y-0.5">
                <ImageSlot
                  filename={item.image.filename}
                  description={item.image.description}
                  ratio="3/2"
                  compact
                />
              </div>

              <div className="flex items-center justify-end gap-2 text-[13px] md:col-span-1">
                {item.href ? (
                  <>
                    <span className="underline-grow font-light text-ink/80 group-hover:text-brown transition-colors">
                      View
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </>
                ) : (
                  <span className="font-sans font-normal uppercase tracking-[0.18em] text-ink/40">
                    Coming
                  </span>
                )}
              </div>
            </article>
          );

          return (
            <li key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="block"
                >
                  {card}
                </Link>
              ) : (
                <div>{card}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
