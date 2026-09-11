import type { Metadata } from "next";
import { MindWorld } from "../_mindworld/MindWorld";

export const metadata: Metadata = {
  title: "Mind World",
  description:
    "Explore four islands shaped by how Jihyeon learns, where she comes from, what she is curious about, and how she designs.",
};

export default function MindWorldPage() {
  return <MindWorld />;
}
