# Jihyeon Jang — Portfolio

Warm editorial portfolio for an AI UX designer and prototype builder. Built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS**.

## Stack

- Next.js 15 (App Router, RSC, static export-friendly)
- TypeScript (strict)
- Tailwind CSS 3
- `framer-motion` for small entrance animations
- Google Fonts via `next/font`: **Outfit** across the whole site

## Routes

| Path | What it is |
| --- | --- |
| `/` | Interactive hero + 3 big-visual featured projects |
| `/work` | Index of all projects |
| `/work/[slug]` | Visual-led case study detail (sticky outline + body) |
| `/fun` | Vibe coding, visual references, and creative lab work |
| `/about` | Bio, principles, contact |

Slugs come from [`lib/projects.ts`](lib/projects.ts) and are statically generated.

## Project structure

```
app/
  layout.tsx          # fonts, <Nav/>, <Footer/>
  page.tsx            # /
  globals.css         # design tokens, base styles
  work/
    page.tsx          # /work
    [slug]/page.tsx   # /work/[slug]
  fun/page.tsx        # /fun
  about/page.tsx      # /about
components/
  Nav.tsx             # sticky top nav with active state
  Footer.tsx
  Hero.tsx            # interactive "Design and Build" hero
  CaseStudyTeaser.tsx # large visual teaser used on home
  CaseStudyLayout.tsx # sticky-outline visual case layout
  SectionHeading.tsx
  ScrollIndicator.tsx
lib/
  site.ts             # name, email, social, nav config
  projects.ts         # case study data (move to MDX later)
public/                # images / videos go here
```

## Adding a case study

Add an entry to `projects` in [`lib/projects.ts`](lib/projects.ts):

```ts
{
  slug: "my-project",
  title: "My Project",
  tagline: "One-line summary.",
  summary: "A paragraph that lands the why.",
  role: "AI UX Designer",
  tools: ["Figma", "Cursor"],
  focus: ["Conversational AI"],
  year: "2026",
  cover: { type: "color", tone: "linear-gradient(...)" },
  featured: true,                 // shows on /
  sections: [
    { id: "overview", title: "Overview", body: "..." },
    { id: "process",  title: "How I built it", body: "...", bullets: ["..."] },
  ],
}
```

`featured: true` opts the project into the home page (max 3, in array order).

## Design tokens

Defined in [`app/globals.css`](app/globals.css) and surfaced to Tailwind in [`tailwind.config.ts`](tailwind.config.ts):

- Colors: `--bg`, `--text`, `--brown`, `--clay`, `--muted`, `--border`, `--accent`
- Tailwind aliases: `bg-bg`, `text-ink`, `text-muted`, `text-brown`, `text-clay`, `text-accent`, `bg-surface`
- Fonts: `font-sans` / `font-serif` both resolve to Outfit for consistency
- Containers: `.container-prose` (640px reading column), `.container-wide` (1280px)
- Utilities: `.text-kicker`, `.pull-quote`, `.grain`, `.image-card`, `.soft-shadow`, `.warm-gradient`

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

## Deploying

Designed for **Vercel**. Push the repo and import — no env vars required.

## Roadmap

- Convert case study `body` to MDX (`@next/mdx`) once content grows
- Add image-first cover support per case (`cover.type === "image"` already wired)
- Add OG image generation
- Optional KO/EN with `next-intl`
