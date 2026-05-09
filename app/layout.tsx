import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { MagneticCursor } from "@/components/MagneticCursor";
import { site } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    url: site.url,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&family=Outfit:wght@100..900&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://use.typekit.net/vlg1buw.css" />
      </head>
      <body className="min-h-screen bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <ConditionalFooter />
        <MagneticCursor />
      </body>
    </html>
  );
}
