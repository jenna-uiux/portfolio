export type FunItem = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  details?: string;
  video?: string;
  image?: string;
  youtube?: string;
  href?: string;
  linkLabel?: string;
  storyHref?: string;
  highlight?: string;
  ratio: string;
};

export const funItems: Record<string, FunItem> = {
  liquid: {
    id: "liquid", title: "Liquid Time",
    description: "An interactive clock with liquid deformation, refraction, and motion-responsive droplets.",
    ratio: "16 / 9",
    tags: ["Creative Coding", "SwiftUI", "Metal", "Codex"],
    details: "Metal refraction, Core Motion gravity, and a touch-driven liquid particle simulation.",
    video: "fun_1_liquidTime_web.mp4",
  },
  heartbeat: {
    id: "heartbeat", title: "Heartbeat",
    ratio: "9 / 16",
    description: "A cloud of particles that comes alive with your heartbeat, read through the iPhone camera.",
    tags: ["Creative Coding", "SwiftUI", "Codex"],
    details: "SwiftUI Canvas and AVFoundation camera-based pulse sensing, with ambient motion and haptic feedback.",
    video: "fun_2_hearbeat_web.mp4",
  },
  objects: {
    id: "objects", title: "AI in Object Design",
    ratio: "1850 / 1080",
    description: "Object design explorations made with AI image tools.",
    tags: ["Object Design", "Generative AI"],
    video: "fun_3_aiObject_web.mp4",
    href: "https://jenna-uiux.github.io/aiInObjectDesign/", linkLabel: "Explore objects",
  },
  spatial: {
    id: "spatial", title: "Vibemaker AR",
    ratio: "16 / 9",
    description: "A spatial music experience that turns the mood of a space into a soundtrack.",
    tags: ["visionOS", "RealityKit", "Cursor"],
    details: "SwiftUI and RealityKit, with space analysis and soundtrack generation through Supabase Edge Functions.",
    video: "fun_4_vibemakerar_web.mp4",
    href: "https://lnkd.in/p/gPruxKU2", linkLabel: "Read the story",
  },
  hani: {
    id: "hani", title: "Run Hani",
    ratio: "9 / 16",
    description: "I built a reward-based weight-loss app. Then lost 30 lbs using it.",
    tags: ["iOS App", "SwiftUI", "Codex"],
    details: "SwiftData, WidgetKit, and AI-assisted weight logging from scale photos.",
    video: "fun_5_runHanni_web.mp4",
  },
  interstellar: {
    id: "interstellar", title: "Interstellar",
    ratio: "16 / 9",
    description: "A creative-coding universe, explored through hand tracking.",
    tags: ["Creative Coding", "MediaPipe", "Cursor"],
    video: "fun_6_interstellar_web.mp4",
    href: "https://jenna-uiux.github.io/vibecoding-aboutme/", linkLabel: "Enter the universe",
    storyHref: "https://lnkd.in/p/g-E4H2ke",
  },
  learnlens: {
    id: "learnlens", title: "LearnLens",
    ratio: "1638 / 1080",
    description: "Turns concepts into narrated, animated explainers.",
    tags: ["Learning App", "Web App", "Cursor"],
    video: "fun_6_learnlens_web.mp4",
    href: "https://learnlens.butterbase.dev/", linkLabel: "Try LearnLens",
  },
  demolight: {
    id: "demolight", title: "Demolight",
    ratio: "1592 / 1080",
    description: "A screen-based lighting tool for recording demos.",
    tags: ["Creative Tool", "React", "Codex"],
    details: "React and TypeScript, animated color sequences, the Fullscreen API, and Screen Wake Lock.",
    video: "fun_7_demolight_web.mp4",
    href: "https://demolight-kappa.vercel.app/", linkLabel: "Try Demolight",
  },
  vibemaker: {
    id: "vibemaker", title: "Vibemaker",
    ratio: "1536 / 1080",
    description: "Let your moments play. Your photo, turned into a vibe on a playlist.",
    tags: ["AI Music", "Suno", "YouTube"],
    video: "fun_8_vibemaker_web.mp4",
    href: "https://www.youtube.com/@Vibemaker_l0l", linkLabel: "Listen on YouTube",
  },
  reve: {
    id: "reve", title: "Reve × TIIAT",
    ratio: "9 / 16",
    description: "An AI film I created with Reve as my entry for a makeathon.",
    tags: ["AI Film", "Reve"], highlight: "1st place · Makeathon",
    video: "fun_9_ReveXtiiat_web.mp4",
    href: "https://lnkd.in/p/g5YgvX9j", linkLabel: "Read the story",
  },
  behind: {
    id: "behind", title: "Demolight in use",
    ratio: "16 / 9",
    description: "Using Demolight as the lighting setup for an actual demo recording.",
    tags: ["Demolight", "Demo Recording"],
    href: "https://demolight-kappa.vercel.app/", linkLabel: "Try Demolight",
    video: "fun_10_demoLight_behind_web.mp4",
  },
  musicvideo: {
    id: "musicvideo", title: "So you’re a designer who started vibe coding",
    ratio: "16 / 9",
    description: "Things I learned while vibe coding, turned into a music video.",
    tags: ["Music Video", "Suno", "Google Flow"],
    youtube: "8wGo0-eqHAM", image: "/images/fun/for-coding-designer.jpg",
    href: "https://www.youtube.com/watch?v=8wGo0-eqHAM", linkLabel: "Watch on YouTube",
  },
};

// User's priority order, including both fun_6 entries. Never sort by media shape.
// The row compositions mix native proportions without changing reading/keyboard order.
export const funRows = [
  { layout: "opening", items: ["liquid", "heartbeat"] },
  { layout: "pair", items: ["objects", "spatial"] },
  { layout: "portraitLead", items: ["hani", "interstellar"] },
  { layout: "pair", items: ["learnlens", "demolight"] },
  { layout: "musicPair", items: ["vibemaker", "reve"] },
  { layout: "pair", items: ["behind", "musicvideo"] },
] as const;
