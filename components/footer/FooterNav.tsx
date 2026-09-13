import Link from "next/link";
import { site } from "@/lib/site";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

const EXPLORE: NavLink[] = [
  { label: "Work", href: "/#work" },
  { label: "Fun", href: "/fun" },
  { label: "About", href: "/about" },
];

export function FooterNav({ dark = false }: { dark?: boolean }) {
  const sayHi: NavLink[] = [
    { label: "Linkedin", href: site.links.linkedin, external: true },
    { label: "Email", href: `mailto:${site.email}`, external: true },
    { label: "Youtube", href: site.links.youtube, external: true },
  ];

  return (
    <nav
      aria-label="Footer"
      className="flex flex-row gap-12 sm:gap-16 lg:gap-24"
    >
      <NavGroup label="Explore" links={EXPLORE} dark={dark} />
      <NavGroup label="Say Hi" links={sayHi} dark={dark} />
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
  const headingClass = dark
    ? "text-[12px] font-semibold uppercase leading-none tracking-[0.04em] text-[#f5f5f5]"
    : "text-[12px] font-semibold uppercase leading-none tracking-[0.04em] text-black";
  const linkClass = dark
    ? "group inline-flex min-h-10 items-center text-[15px] font-normal capitalize leading-[1.5] tracking-[-0.01em] text-[#f5f5f5]/75 transition-colors hover:text-[#f5f5f5] md:min-h-0 md:py-[0.1em] md:text-[18px] md:leading-[1.8]"
    : "group inline-flex min-h-10 items-center text-[15px] font-normal capitalize leading-[1.5] tracking-[-0.01em] text-[#2e2e2e] transition-colors hover:text-black md:min-h-0 md:py-[0.1em] md:text-[18px] md:leading-[1.8]";

  return (
    <div className="flex flex-col gap-3">
      <span className={headingClass}>{label}</span>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                data-cursor="visit"
                className={linkClass}
              >
                <span className="footer-link-underline">{link.label}</span>
              </a>
            ) : (
              <Link href={link.href} data-cursor="visit" className={linkClass}>
                <span className="footer-link-underline">{link.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
