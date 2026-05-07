import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        ink: "var(--text)",
        muted: "var(--muted)",
        line: "var(--border)",
        accent: "var(--accent)",
        brown: "var(--brown)",
        clay: "var(--clay)",
        surface: "var(--surface)",
        "surface-solid": "var(--surface-solid)",
        orange: "var(--accent-orange)",
      },
      fontFamily: {
        serif: ["var(--font-sans)", "Outfit", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "Outfit", "ui-sans-serif", "system-ui"],
        seasons: ['"the-seasons"', "Georgia", "ui-serif"],
      },
      maxWidth: {
        prose: "640px",
        wide: "1280px",
      },
      letterSpacing: {
        tightish: "-0.02em",
        tighter2: "-0.03em",
        editorial: "-0.055em",
      },
    },
  },
  plugins: [],
};

export default config;
