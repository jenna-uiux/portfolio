import type { Metadata } from "next";
import { FunGallery } from "./FunGallery";
import { site } from "@/lib/site";

const description = "Creative coding, small useful apps, AI films, and visual experiments by Jihyeon Jang. Made out of curiosity, just for the fun of it.";
const shareImage = {
  url: new URL("/images/fun/fun_2_hearbeat_web.jpg", site.url).href,
  width: 640,
  height: 1138,
  alt: "Heartbeat — a creative coding project by Jihyeon Jang",
};

export const metadata: Metadata = {
  title: "Fun",
  description,
  openGraph: {
    title: `Fun — ${site.name}`,
    description,
    url: new URL("/fun", site.url).href,
    siteName: site.name,
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Fun — ${site.name}`,
    description,
    images: [shareImage],
  },
};

export default function FunPage() {
  return <FunGallery />;
}
