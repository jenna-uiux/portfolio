"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { SketchbookFooter } from "@/components/footer/SketchbookFooter";

export function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname === "/about" || pathname.startsWith("/about/")) {
    return null;
  }

  if (pathname === "/work/aeon" || pathname.startsWith("/work/aeon/")) {
    return <SketchbookFooter variant="dark" />;
  }

  // Home, Work, Fun, and every case study under /work/* and /fun/* share the
  // editorial footer.
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
