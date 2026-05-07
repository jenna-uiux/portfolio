"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isAbout =
    pathname === "/about" || pathname.startsWith("/about/");

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent hydration mismatch: initial render must match server HTML.
  const effectiveScrolled = mounted ? scrolled : false;

  const headerTone = isAbout
    ? effectiveScrolled
      ? "border-b border-white/10 bg-[#060a0f]/72 backdrop-blur-md supports-[backdrop-filter]:bg-[#060a0f]/60"
      : "border-b border-transparent bg-transparent"
    : scrolled
      ? "border-b hairline bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/65"
      : "border-b border-transparent bg-transparent";

  const homeLinkClass = isAbout
    ? "text-[14px] font-normal tracking-tight underline-grow text-[#FAFAFA]"
    : "text-[14px] font-normal tracking-tight underline-grow";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        headerTone,
      ].join(" ")}
    >
      <div className="container-ultra flex h-14 items-center justify-between">
        <Link href="/" aria-label="Home" className={homeLinkClass}>
          {site.name.toUpperCase()}
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-6 text-[13px]"
        >
          {site.nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const linkTone = isAbout
              ? active
                ? "text-[#FAFAFA]"
                : "text-[#B8B8B8] hover:text-[#FAFAFA]"
              : active
                ? "text-ink"
                : "text-[#5B5B5B] hover:text-ink";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={["underline-grow transition-colors", linkTone].join(
                  " "
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
