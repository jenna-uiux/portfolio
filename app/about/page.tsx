import type { Metadata } from "next";
import { MindWorld } from "./_mindworld/MindWorld";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Jihyeon Jang — a cinematic Mind World of four islands shaped by learning, background, curiosity, and visual sensitivity.",
};

export default function AboutPage() {
  return <MindWorld />;
}
