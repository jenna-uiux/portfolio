export type IslandKey = "learn" | "background" | "interest" | "visual";

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
};

export type EducationItem = {
  degree: string;
  org: string;
  period: string;
};

export type Island = {
  key: IslandKey;
  tag: string;
  title: string;
  pos: { x: number; y: number };
  image: string;
  description: string;
  memories: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
};

const buildMemories = (key: IslandKey, exts: string[]): string[] =>
  exts.map((ext, i) => `/images/about/memories/${key}/${i + 1}.${ext}`);

export const heroImage = "/images/about/hero.png";

export const islands: Island[] = [
  {
    key: "learn",
    tag: "Growth Island",
    title: "How I Learn",
    pos: { x: 22, y: 38 },
    image: "/images/about/island_learn.jpg",
    description:
      "**I love learning, and I learn by doing.**\nHackathons, workshops, and side projects constantly pull me into unfamiliar spaces. I'm happiest when I'm learning, experimenting, and turning ideas into something real.",
    memories: buildMemories("learn", ["jpg", "jpg", "jpg", "jpg", "jpg"]),
  },
  {
    key: "background",
    tag: "FOUNDATION ISLAND",
    title: "My Background",
    pos: { x: 62, y: 28 },
    image: "/images/about/island_background.jpg",
    description:
      "Before I designed AI products, I taught students.\nTeaching shaped how I think about clarity, communication, and helping people navigate unfamiliar things. That perspective still guides how I design AI experiences today.",
    memories: buildMemories("background", ["jpg", "jpg", "jpg", "jpg", "jpg"]),
    experience: [
      { role: "UI/UX Design Intern", org: "nibnab", period: "2025" },
      {
        role: "UI/UX Designer",
        org: "Autodesk x Academy of Art University",
        period: "2025",
      },
      {
        role: "UI/UX Designer",
        org: "Seeds of Empowerment — Stanford University",
        period: "2023–2024",
      },
      {
        role: "Graphic Designer",
        org: "Foothill College",
        period: "2023–2024",
      },
    ],
    education: [
      {
        degree: "M.A. Interaction & UI/UX Design",
        org: "Academy of Art University",
        period: "2026",
      },
      {
        degree: "B.S. Home Economics Education",
        org: "Kyungpook National University",
        period: "2022",
      },
      {
        degree: "Graphic & Interactive Design",
        org: "Foothill College",
        period: "2024",
      },
    ],
  },
  {
    key: "interest",
    tag: "Future Island",
    title: "My Interest",
    pos: { x: 74, y: 58 },
    image: "/images/about/island_interest.jpg",
    description:
      "I want to explore Physical AI and multi-sensory interaction more deeply.\nI'm curious about interfaces that move beyond screens and become part of the physical world through vision, sound, movement, and space.",
    memories: buildMemories("interest", ["jpg", "png", "jpg", "png", "jpg"]),
  },
  {
    key: "visual",
    tag: "Creative Island",
    title: "How I Design & Build",
    pos: { x: 38, y: 62 },
    image: "/images/about/island_visual.jpg",
    description:
      "Design intuition is what AI cannot replace.\nI create visuals guided by my visual sensitivity, aesthetic sense, and empathy.\nThis journey led me to become a **Creative Partner at Reve.**",
    memories: buildMemories("visual", ["png", "png", "png", "png", "png"]),
  },
];

export const islandByKey = (key: IslandKey): Island =>
  islands.find((i) => i.key === key) as Island;
