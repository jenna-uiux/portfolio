export const site = {
  name: "Jihyeon Jang",
  title: "Jihyeon Jang — AI UX Designer",
  description:
    "Portfolio of Jihyeon Jang, an AI UX designer who designs and builds conversational interfaces, agent-based workflows, and working prototypes.",
  url: "https://www.jihyeonjang.com",
  email: "jihyeonjang102@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/jihyeon-jang-705227266/",
    youtube: "https://www.youtube.com/@Vibemaker_l0l",
  },
  nav: [
    { label: "Work", href: "/work" },
    { label: "Fun", href: "/fun" },
    { label: "About", href: "/about" },
  ] as const,
  footer: {
    tagline: "Always open to new ideas and collaborations (and good coffee).",
    copyright: "© 2026 Jihyeon Jang",
  },
};

export type SiteConfig = typeof site;
