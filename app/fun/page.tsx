import type { Metadata } from "next";
import { FunGallery } from "./FunGallery";

export const metadata: Metadata = {
  title: "Fun",
  description: "Creative coding, small useful apps, AI films, and visual experiments by Jihyeon Jang. Made out of curiosity, just for the fun of it.",
};

export default function FunPage() {
  return <FunGallery />;
}
