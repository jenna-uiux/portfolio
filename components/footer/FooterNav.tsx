import Link from "next/link";
import { site } from "@/lib/site";
import { PencilUnderline } from "./PencilUnderline";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

const EXPLORE: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Fun", href: "/fun" },
  { label: "About", href: "/about" },
];

export function FooterNav({ dark = false }: { dark?: boolean }) {
  const sayHi: NavLink[] = [
    { label: "LinkedIn", href: site.links.linkedin, external: true },
    { label: "Email", href: `mailto:${site.email}`, external: true },
    { label: "YouTube", href: site.links.youtube, external: true },
  ];

  return (
    <nav
      aria-label="Footer"
      className="flex flex-col gap-10 sm:flex-row sm:gap-16"
    >
      <NavGroup label="Explore" links={EXPLORE} dark={dark} />
      <NavGroup label="Say hi" links={sayHi} dark={dark} />
    </nav>
  );
}

function NavGroup({
  label,
  links,
  dark,
}: {
  label: string;
  links: NavLink[];
  dark: boolean;
}) {
  // On the dark footer the standard ink utilities are invisible, so swap to
  // explicit cream tones.
  const linkClass = dark
    ? "group inline-flex items-baseline text-[18px] font-light tracking-[-0.01em] text-[#f5f0e8]/80 transition-colors hover:text-[#f5f0e8]"
    : "group inline-flex items-baseline text-[18px] font-light tracking-[-0.01em] text-ink/85 transition-colors hover:text-ink";
  const arrowClass = dark
    ? "ml-1.5 text-[0.85em] text-[#f5f0e8]/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    : "ml-1.5 text-[0.85em] text-ink/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

  return (
    <div className="flex flex-col gap-3">
      <span className="t-mono">{label}</span>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http") ? "noreferrer" : undefined
                }
                data-cursor="visit"
                className={linkClass}
              >
                <PencilUnderline>{link.label}</PencilUnderline>
                {link.href.startsWith("http") ? (
                  <span aria-hidden className={arrowClass}>
                    ↗
                  </span>
                ) : null}
              </a>
            ) : (
              <Link href={link.href} data-cursor="visit" className={linkClass}>
                <PencilUnderline>{link.label}</PencilUnderline>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
