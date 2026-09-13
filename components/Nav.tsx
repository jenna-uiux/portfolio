"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMindWorld =
    pathname === "/about/mind-world" ||
    pathname.startsWith("/about/mind-world/");

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  // Prevent hydration mismatch: initial render must match server HTML.
  const effectiveScrolled = mounted ? scrolled : false;
  const hasSolidBackground = effectiveScrolled || mobileOpen;
  const isDarkHeader =
    isMindWorld ||
    (!hasSolidBackground &&
      (pathname === "/about" || pathname === "/work/aeon"));

  const headerTone = isMindWorld
    ? hasSolidBackground
      ? "bg-[#060a0f]"
      : "bg-transparent"
    : hasSolidBackground
      ? "bg-[#FAFAFA]"
      : "bg-transparent";

  const homeLinkClass = isDarkHeader
    ? "text-[14px] font-normal tracking-tight underline-grow text-[#FAFAFA]"
    : "text-[14px] font-normal tracking-tight underline-grow text-[#171717]";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-colors duration-200 ease-out motion-reduce:transition-none",
        headerTone,
      ].join(" ")}
    >
      <div className="container-ultra flex h-[52px] items-center justify-between">
        <Link href="/" aria-label="Home" className={homeLinkClass}>
          {site.name.toUpperCase()}
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-[13px] md:flex"
        >
          {site.nav.map((item) => {
            const isWork = item.href === "/#work";
            const active = isWork
              ? pathname === "/" || pathname.startsWith("/work")
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const linkTone = isDarkHeader
              ? active
                ? "text-[#FAFAFA]"
                : "text-[#B8B8B8] hover:text-[#FAFAFA]"
              : active
                ? "text-[#171717]"
                : "text-[#767676] hover:text-[#171717]";
            const className = [
              "inline-block font-normal transition-[color,transform] duration-200 ease-out motion-reduce:transition-none",
              linkTone,
              active ? "" : "hover:-translate-y-px motion-reduce:hover:translate-y-0",
            ].join(" ");

            // Same-page hash: plain anchor so the browser scrolls to #work.
            if (isWork && pathname === "/") {
              return (
                <a
                  key={item.href}
                  href="#work"
                  aria-current={active ? "page" : undefined}
                  className={className}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={className}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className={[
            "grid size-11 place-items-center md:hidden",
            isDarkHeader ? "text-[#FAFAFA]" : "text-[#171717]",
          ].join(" ")}
        >
          {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
        className={[
          "fixed inset-x-0 bottom-0 top-[52px] z-[-1] px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-12 transition-[opacity,visibility] duration-200 md:hidden",
          isDarkHeader ? "bg-[#060a0f] text-[#FAFAFA]" : "bg-[#FAFAFA] text-[#171717]",
          mobileOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Mobile primary" className="flex flex-col">
          {site.nav.map((item) => {
            const isWork = item.href === "/#work";
            const active = isWork
              ? pathname === "/" || pathname.startsWith("/work")
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const linkClass = [
              "flex min-h-16 items-center justify-between border-b text-[30px] font-normal leading-none tracking-[-0.035em]",
              isDarkHeader ? "border-white/15" : "border-ink/10",
              active ? "opacity-100" : "opacity-60",
            ].join(" ");
            const content = (
              <>
                <span>{item.label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  size={22}
                  strokeWidth={1.25}
                  className="opacity-50"
                />
              </>
            );

            if (isWork && pathname === "/") {
              return (
                <a key={item.href} href="#work" className={linkClass} onClick={() => setMobileOpen(false)}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={linkClass}>
                {content}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
