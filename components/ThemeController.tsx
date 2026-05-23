"use client";

import { useEffect } from "react";

type Theme = "light" | "dark";

export function ThemeController({ theme }: { theme: Theme }) {
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.dataset.theme;
    html.dataset.theme = theme;
    return () => {
      if (previous) html.dataset.theme = previous;
      else delete html.dataset.theme;
    };
  }, [theme]);

  return null;
}
