"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/about" || pathname.startsWith("/about/")) {
    return null;
  }
  return <Footer />;
}
