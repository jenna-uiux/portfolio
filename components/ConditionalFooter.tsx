"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { SketchbookFooter } from "@/components/footer/SketchbookFooter";

export function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname === "/about" || pathname.startsWith("/about/")) {
    return null;
  }

  // Home, Work, Fun, and every case study under /work/* and /fun/* share the
  // interactive stamp footer.
  const isSketchbook =
    pathname === "/" ||
    pathname === "/work" ||
    pathname.startsWith("/work/") ||
    pathname === "/fun" ||
    pathname.startsWith("/fun/");

  if (isSketchbook) {
    return <SketchbookFooter />;
  }

  return <Footer />;
}
