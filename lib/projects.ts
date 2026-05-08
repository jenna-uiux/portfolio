export type ImageRatio = "16/9" | "4/5" | "1/1" | "3/2" | "21/9";

export type ImagePlaceholder = {
  filename: string;
  description: string;
  ratio?: ImageRatio;
  /** Public URL under `/public` (e.g. `/media/fini/thumbnail/demo.mp4`) */
  videoSrc?: string;
};

export type ChartId =
  | "diary-structure"
  | "energy-rhythm"
  | "signal-flow"
  | "elastic-deadline"
  | "readiness-mapping"
  | "before-after-entry"
  | "ai-correction-loop";

export type MediaItem =
  | {
      kind: "image";
      filename: string;
      description: string;
      src?: string;
      maxWidth?: number;
      ratio?: ImageRatio;
      /** How the image fills the aspect-ratio frame (default: contain). */
      objectFit?: "cover" | "contain";
      /** Fini overview: two-column highlight slide (Figma key highlight frames). */
      finiHighlight?: {
        titleLines: string[];
        body: string;
        textSide: "left" | "right";
        /** Larger image treatment for one slide (e.g. hero highlight). */
        emphasizeImage?: boolean;
        /** Optional Tailwind translate class for the text column (md+), e.g. per-slide vertical tuning. */
        textColumnYClass?: string;
      };
    }
  | {
      kind: "video";
      filename: string;
      description: string;
      src: string;
      poster?: string;
      ratio?: ImageRatio;
      /** Browsers require muted for reliable autoplay. */
      autoPlay?: boolean;
      loop?: boolean;
      muted?: boolean;
      controls?: boolean;
      objectFit?: "cover" | "contain";
    }
  | {
      kind: "chart";
      id: ChartId;
      caption: string;
      ratio?: ImageRatio;
    };

export type CaseBlock = {
  title: string;
  label?: string;
  body?: string;
  problem?: string;
  designMove?: string;
  buildProof?: string;
  bullets?: string[];
  media?: MediaItem[];
};

export type CaseContentBlock =
  | {
      kind: "callout";
      title?: string;
      body: string;
    }
  | {
      kind: "logicDemo";
      title: string;
      body: string;
    }
  | {
      kind: "comparison";
      items: {
        label: string;
        title: string;
        body: string;
      }[];
    }
  | {
      kind: "insightCards";
      cards: {
        title: string;
        body: string;
        evidence?: string;
      }[];
    }
  | {
      kind: "miniTable";
      columns: string[];
      rows: string[][];
    }
  | {
      kind: "mediaPlaceholder";
      filename: string;
      description: string;
      mediaType?: "image" | "video";
      ratio?: ImageRatio;
      /** Small mono uppercase line rendered below the placeholder. */
      sourceCaption?: string;
      /** Replaces the default "Future image/video" badge in the corner (e.g. "Before" / "After"). */
      captionLabel?: string;
    }
  | {
      kind: "takeawayCards";
      cards: {
        title: string;
        body: string;
      }[];
    }
  | {
      kind: "storyBeats";
      beats: {
        eyebrow?: string;
        stat?: {
          value: string;
          label: string;
          source?: string;
          detail?: string;
        };
        body: string;
        highlight?: string;
        listItems?: { type: "disappear" | "survive"; text: string }[];
      }[];
    }
  | {
      kind: "interactiveDemo";
      variant: "energySlider";
      caption?: string;
    }
  | {
      kind: "subheading";
      title: string;
      body?: string;
      first?: boolean;
      /** Keeps local subheading spacing tight when parent content rhythm already provides separation. */
      compact?: boolean;
      /** Small version label in a pill (e.g. v2), Apple-style doc header */
      kicker?: string;
    }
  | {
      kind: "timelineStepper";
      steps: { time: string; label: string; body: string }[];
    }
  | {
      kind: "flipCards";
      cards: {
        label: string;
        title: string;
        front: string;
        back: string;
        backLabel?: string;
      }[];
    }
  | {
      kind: "v2Items";
      items: {
        number: string;
        title: string;
        body: string;
        /** Public URL under `/public`, e.g. `/media/fini/.../clip.mp4` */
        videoSrc?: string;
        videoPlaceholder?: boolean;
        /** Static image under `/public` (e.g. before/after UI) */
        imageSrc?: string;
        imageAlt?: string;
        hasConsole?: boolean;
      }[];
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      objectFit?: "cover" | "contain";
    }
  | { kind: "edgeCaseExplorer" }
  | {
      kind: "numberedList";
      items: string[];
      intro?: string;
    }
  | {
      kind: "annotation";
      label: string;
      body: string;
    }
  | {
      kind: "prose";
      body: string;
    }
  | { kind: "fieldTranslator" }
  | {
      kind: "pivotComparison";
      items: [
        { label: string; title: string; body: string },
        { label: string; title: string; body: string },
      ];
    }
  | {
      kind: "bulletList";
      intro?: string;
      items: string[];
    }
  | {
      kind: "pillarGrid";
      pillars: {
        number: string;
        title: string;
        body: string;
        /** Optional small mono uppercase source line rendered below the body (e.g. RFE stat citation). */
        sourceCaption?: string;
      }[];
    }
  | {
      kind: "annotatedCallout";
      label: string;
      body: string;
      tone?: "neutral" | "accent";
    }
  | {
      kind: "problemStatement";
      body: string;
    }
  | {
      kind: "numberedTimeline";
      steps: { num: string; name: string; note?: string }[];
    }
  | {
      kind: "explorationCards";
      intro?: string;
      options: {
        number: string;
        title: string;
        pros: string[];
        cons: string[];
        image?: { filename: string; description: string; src?: string };
      }[];
      finalPickLabel?: string;
      finalPickBody?: string;
    };

export type CaseSection = {
  id: string;
  title: string;
  eyebrow?: string;
  body: string;
  /** Renders immediately after body copy, before bullets / contentBlocks (full width of article column). */
  mediaAfterBody?: MediaItem[];
  pull?: string;
  bullets?: string[];
  contentBlocks?: CaseContentBlock[];
  blocks?: CaseBlock[];
  image?: ImagePlaceholder;
  media?: MediaItem[];
  /** Shown above section `image` / `media`, left-aligned (e.g. product highlight label). */
  mediaHeading?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  category: string;
  role: string;
  tools: string[];
  focus: string[];
  team?: string;
  /** Optional 4th meta column rendered next to Role/Tools/Focus when present. */
  timeline?: string;
  year: string;
  cover: ImagePlaceholder;
  featured: boolean;
  externalLink?: { label: string; href: string };
  sections: CaseSection[];
};

export const projects: CaseStudy[] = [
  {
    slug: "fini",
    title: "Fini",
    tagline: "Building Fini from 0 → 1",
    summary:
      "Designed and built Fini, an adaptive productivity mobile app\nthat aligns daily tasks with a user's real-time bio-signals.",
    category: "AI UX / Productivity",
    role: "Design Engineer",
    tools: [
      "Cursor",
      "SwiftUI",
      "Apple HealthKit",
      "Supabase",
      "Anthropic API",
      "Figma",
    ],
    focus: [
      "Agentic Engineering",
      "Bio-adaptive UX",
      "Cognitive Load Management",
    ],
    year: "2026",
    cover: {
      filename: "finiDemo.mp4",
      description: "Fini hero — phone in hand with planner UI",
      ratio: "16/9",
      videoSrc: "/media/fini/thumbnail/finiDemo.mp4",
    },
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        eyebrow: "The AI energy-aware productivity companion",
        body: "I designed and built Fini, an adaptive productivity mobile app that aligns daily tasks with a user's real-time energy levels. Moving beyond static mockups, I architected a full system from 0 to 1 that translates raw bio-signals into a responsive interface.\n\nFrom defining the systems architecture to refining human-centered interactions with Cursor and SwiftUI, my focus was on creating a seamless, evidence-based relationship between the user and AI.",
        mediaHeading: "Product Highlights",
        media: [
          {
            kind: "image",
            filename: "highlight-energy.png",
            description:
              "Fini reads Apple Health signals and breaks tasks into smaller steps when energy is low",
            src: "/images/fini/figma-highlights/highlight-energy.png",
            ratio: "16/9",
            finiHighlight: {
              titleLines: [
                "Understands your energy.",
                "Helps you start.",
              ],
              body:
                "Fini reads your daily energy using signals from Apple Health. When your energy is low, it breaks tasks into smaller steps to help you get started.",
              textSide: "left",
              emphasizeImage: true,
            },
          },
          {
            kind: "image",
            filename: "highlight-voice.png",
            description:
              "Voice and intent: Fini turns what you say into a prioritized plan",
            src: "/images/fini/figma-highlights/highlight-voice.png",
            ratio: "16/9",
            finiHighlight: {
              titleLines: [
                "Say everything on your mind.",
                "Fini turns it into a plan.",
              ],
              body:
                "Describe what you need to do in your own words. Fini understands your intent and turns it into a prioritized task plan.",
              textSide: "right",
              /** Net +16px vs default -48px column lift ≈ 64px lower than -translate-y-12 baseline. */
              textColumnYClass: "md:translate-y-4",
            },
          },
          {
            kind: "image",
            filename: "highlight-watch.png",
            description:
              "Next step on Apple Watch — glanceable, focused forward motion",
            src: "/images/fini/figma-highlights/highlight-watch.png",
            ratio: "16/9",
            finiHighlight: {
              titleLines: ["Your next step, on your wrist"],
              body:
                "Fini brings the right next step to your Apple Watch so you can stay focused and keep moving forward.",
              textSide: "right",
            },
          },
        ],
      },
      {
        id: "challenge",
        title: "The Challenge",
        body: "",
        contentBlocks: [
          {
            kind: "storyBeats",
            beats: [
              {
                highlight: "Plans for personal growth were the hardest to finish...",
                body: "If you live by a schedule, you know how it goes. Plans for work and school are non-negotiable, but self-initiated plans always seem to fall through.",
              },
            ],
          },
        ],
        media: [
          {
            kind: "image",
            filename: "challenge.png",
            description:
              "Planner and sticky notes with crossed-out personal goals, crumpled paper — rigid self-initiated plans versus real motivation",
            src: "/media/fini/challenge/challenge.png",
            ratio: "16/9",
            objectFit: "cover",
          },
        ],
      },
      {
        id: "research",
        title: "Research",
        eyebrow: "When and why do productivity crashes occur?",
        body: "To identify the **hidden triggers** behind productivity crashes, I conducted a diary study tracking the real-time interplay between energy levels, emotional states, and task execution.",
        contentBlocks: [
          {
            kind: "insightCards",
            cards: [
              {
                title: "**Energy is the Hidden Variable**",
                body: "We abandon our plans when our 'battery' is low, regardless of how much time we have left.",
              },
              {
                title: "**The Burden of Large Tasks**",
                body: "While micro-tasks feel doable, vaguely defined 'big goals' are the first to be skipped.",
              },
              {
                title: "**The Guilt Spiral**",
                body: "Unfinished plans leave a 'guilt debt.' This emotional burden creates a cycle of demotivation that affects the next day's productivity.",
              },
            ],
          },
        ],
        media: [
        ],
      },
      {
        id: "system-architecture",
        title: "Systems Architecture",
        eyebrow: "Let’s see the Big Picture",
        body: "Before diving into development with Cursor, I mapped out the systems architecture to ensure a **seamless experience.**\n\nThis architecture is what **transforms raw energy data into adaptive schedules.** To create a truly energy-aware planner, I designed an engine that turns biological signals like sleep and HRV into a fluid planning surface.\n\n[[MEDIA_AFTER_BODY]]",
        mediaAfterBody: [
          {
            kind: "video",
            filename: "system-layer.mp4",
            description:
              "System architecture — signals, inference, and planning surface",
            src: "/media/fini/system-architecture/system-layer.mp4",
            ratio: "16/9",
            autoPlay: true,
            loop: true,
            muted: true,
            controls: true,
            objectFit: "contain",
          },
        ],
        bullets: [],
        contentBlocks: [
          {
            kind: "logicDemo",
            title: "The Logic: Quantifying Energy",
            body: "I developed a logic that calculates a personalized energy score by analyzing sleep quality, heart rate variability, and activity levels.",
          },
        ],
        media: [],
      },
      {
        id: "design-build",
        title: "Design & Build",
        eyebrow: "",
        body: "Fini was designed as a working planning behavior system rather than a static interface prototype. The design evolved through rapid iteration, real-world testing, and continuous refinement.",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            kicker: "v1",
            title: "Fast Validation with Agentic Coding",
            body: "I didn't wait for a finished UI to test my hypothesis. By providing Cursor with a clear **PRD and System Architecture**, I bypassed static mockups and built a functional V1 in just 24 hours. This allowed me to conduct immediate QA and User Testing with a real system, moving beyond the limitations of \"Figma-only\" testing.",
          },
          {
            kind: "timelineStepper",
            steps: [
              {
                time: "Hour 0 – 2",
                label: "PRD & Architecture Planning",
                body: "Clarified the product hypothesis with ChatGPT, drafted a short PRD, and defined color, font, and system architecture in Cursor Plan Mode.",
              },
              {
                time: "Hour 3 – 7",
                label: "Core Data Modeling",
                body: "Cursor generated foundational data models and Supabase schema. HealthKit integration stubs scaffolded in SwiftUI.",
              },
              {
                time: "Hour 8 – 13",
                label: "SwiftUI + HealthKit Integration",
                body: "Built the live HealthKit signal pipeline. Sleep, HRV, and activity data flowing into the readiness engine.",
              },
              {
                time: "Hour 14 – 19",
                label: "Anthropic Inference Pipeline",
                body: "Supabase Edge Functions connected to the Anthropic API. First AI-generated task plans appearing in the UI.",
              },
              {
                time: "Hour 20 – 23",
                label: "QA + Debug Loop",
                body: "End-to-end user flow tested with real data. Critical edge cases caught and fixed. Latency identified as V1's biggest UX risk.",
              },
              {
                time: "Hour 24",
                label: "V1 Complete",
                body: "A fully functional prototype, ready for the first real user test. Not polished, but real.",
              },
            ],
          },
          {
            kind: "image",
            src: "/media/fini/design-build/v1.jpg",
            alt: "Fini V1 app screenshot",
            objectFit: "cover",
          },
          {
            kind: "subheading",
            title: "The Reality Check from UT & QA",
            body: "To validate the system, I conducted a **User Test** to observe behavioral patterns and a **technical Quality Assurance** to stress-test the data flow. These sessions revealed 4 gaps:",
          },
          {
            kind: "flipCards",
            cards: [
              {
                label: "UX",
                title: "Cognitive Overload",
                front: "The act of manual task entry (categorizing, typing, and assigning energy weights) became a \"second job\" for users who were already biologically depleted.",
                back: "\"I'm already exhausted. Having to type out my tasks and decide on energy levels feels like more work. I wish it could just hear my state and suggest the plan for me.\"",
              },
              {
                label: "App Concept",
                title: "The \"Starting\" Friction",
                front: "Users didn't just need a more flexible schedule; they were paralyzed by the sheer effort of \"starting\" while in a low-energy state. The initial focus on postponement was a secondary need.",
                back: "\"Flexible deadlines are great, but I'm so drained that I don't even know where to begin. I just need the system to pick one small thing I can actually handle right now.\"",
              },
              {
                label: "UI",
                title: "Invisible Systems are Untrustworthy",
                front: "While the backend was processing complex bio-signals, the static UI didn't communicate this activity. This \"black box\" approach led to skepticism about the AI's logic.",
                back: "\"It says it's connected to my Watch, but I don't see any of my data on the screen. How do I know if this plan is actually based on my recovery or just random suggestions?\"",
              },
              {
                label: "Dev",
                title: "Logic Lag & Latency",
                front: "Technical audits revealed inefficient asynchronous calls and an unoptimized inference engine, resulting in data loading latencies of 0.8s to 1.2s.",
                back: "This delay was projected to decrease user trust scores by 40% and increase immediate drop-off rates by approximately 25%, as users equate latency with system unreliability.",
                backLabel: "Engineering Impact",
              },
            ],
          },
          {
            kind: "subheading",
            kicker: "v2",
            title: "The Refined System",
            body: "I redesigned the system to be more empathetic and transparent:",
          },
          {
            kind: "v2Items",
            items: [
              {
                number: "01",
                title: "Voice Task Entry",
                body: "To eliminate the cognitive load of manual entry, I implemented Voice Capture. An Edge Function parses natural language into categorized, energy-weighted tasks, removing the friction of planning.",
                videoSrc: "/media/fini/design-build/voiceTaskEntry.mp4",
              },
              {
                number: "02",
                title: "Making It Easier to Start",
                body: "I designed Energy-Matched Breakdown to make starting easier. Instead of large, overwhelming tasks, the system breaks them into small, doable steps based on real-time energy, **so users can take the first step, even on low-energy days.**",
                videoSrc: "/media/fini/design-build/proactiveAtomization.mp4",
              },
              {
                number: "03",
                title: "Making the system visible",
                body: "I redesigned the Hero Section to surface raw bio-data (HRV, Stress, Sleep). I realized that if the system's \"thinking\" is invisible, it's untrustworthy. Prioritizing which data to show became a key UX challenge.",
                imageSrc: "/media/fini/design-build/visualTrust.jpg?v=2",
                imageAlt:
                  "Making the system visible — before static UI vs after data-driven interface with bio-signals",
              },
              {
                number: "04",
                title: "Optimizing the Bio-Inference Model",
                body: "The initial energy model was skewed by workout data, leading to inaccurate scheduling. To fix this, I directed Cursor to re-engineer the data ingestion layer, specifically by prioritizing Resting Heart Rate for biological accuracy and implementing query caching to minimize system latency.",
                hasConsole: true,
              },
            ],
          },
          {
            kind: "subheading",
            kicker: "v∞",
            title: "Solving the Edge Cases",
            body: "After ensuring basic stability, **I focus on the 'what-ifs.'** I designed the user experience to handle unpredictable real-world data so Fini never leaves the user hanging. It is built to continuously evolve and stay one step ahead of reality.",
          },
          { kind: "edgeCaseExplorer" },
        ],
        blocks: [],
        media: [],
      },
      {
        id: "impact-vision",
        title: "Impact & Vision",
        body: "",
        contentBlocks: [
          {
            kind: "takeawayCards",
            cards: [
              {
                title: "What I gained",
                body: "I learned Agentic Coding by doing. CLI, design tokens, version control, things I'd never heard of before this project. I documented everything as I went.\n\n[View my note →](https://docs.google.com/document/d/12PMD79Cqjkw8ChC-CLue5E5lhuJFyfU7k8Eio9iWtCo/edit?usp=sharing)",
              },
              {
                title: "Recognition",
                body: "Fini was selected for the Academy of Art University 2026 Spring Show.\n\n[View Spring Show page →](https://2026springshow.academyart.edu/student/jihyeon-jang/)",
              },
              {
                title: "What's next",
                body: "Fini is heading to the App Store. The goal is **500 users** in the first month and a **4.5+** star rating.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "strawberry-matcha",
    title: "Strawberry Matcha",
    tagline:
      "AI agent for marriage-based green card applicants (CR1 or F2A) filing without a lawyer.",
    summary:
      "A legal-trained AI agent for couples filing their CR1 or F2A green card alone. It learns your case through conversation and walks you through every form, field by field.",
    category: "AI UX / Legal workflow",
    role: "AI UX Designer · Solo project",
    tools: ["Cursor", "Claude API", "Supabase", "Figma"],
    focus: ["Conversational AI", "Decision-support UX"],
    timeline: "3 weeks · v0 → v1",
    year: "2026",
    cover: {
      filename: "strawberry-matcha_hero.mp4",
      description: "Strawberry Matcha hero demo",
      ratio: "16/9",
    },
    featured: true,
    sections: [
      {
        id: "context",
        title: "Context",
        eyebrow:
          "An AI agent for couples filing their marriage-based green card alone.",
        body: "Strawberry Matcha is for people going through the CR1 or F2A green card process without a lawyer. The applicant talks to it the way they would talk to someone who already knows the process. As they chat, it asks follow-up questions, picks up details about the case, and gets more useful the more it's used.",
      },
      {
        id: "problem",
        title: "User problem",
        eyebrow:
          "Filing alone leads to mistakes. General AI makes it worse.",
        body: "Most couples filing for a marriage-based green card don't have a lawyer. They piece the process together from USCIS pages, Reddit threads, and lawyer blogs from years ago. Three forces collide.",
        contentBlocks: [
          {
            kind: "pillarGrid",
            pillars: [
              {
                number: "01",
                title: "Lawyers are unaffordable for many couples.",
                body: "Marriage-based green card lawyers charge $2,000 to $8,000+ on top of $1,700+ in USCIS fees. For most couples that's not a real option, so they file alone and learn the process as they go.",
              },
              {
                number: "02",
                title: "DIY filing produces costly mistakes.",
                body: "==1 in 4== marriage-based applicants gets a Request for Evidence, most of them for missing documents and filing errors. The kind of mistakes that happen without someone to ask the right questions first.",
                sourceCaption:
                  "Source: CitizenPath, USCIS Request for Evidence Guide",
              },
              {
                number: "03",
                title: "General AI hallucinates on legal workflows.",
                body: "ChatGPT and Claude sound confident, but they aren't trained on legal workflows. They miss steps. They give advice that fits a generic case, not yours. For an immigration filing, that's not safe enough.",
              },
            ],
          },
          {
            kind: "problemStatement",
            body: "How might we make case-aware legal guidance affordable and reliable for couples filing alone?",
          },
        ],
      },
      {
        id: "solution",
        title: "Solution",
        eyebrow:
          "A legal-trained AI agent that learns your case through conversation.",
        body: "Three pillars hold it together. Each one is a deliberate counter to the way filing alone usually breaks down.",
        contentBlocks: [
          {
            kind: "pillarGrid",
            pillars: [
              {
                number: "01",
                title: "Built around how immigration lawyers actually work.",
                body: "Strawberry Matcha follows the legal workflow, asks the right questions in the right order, and stays grounded in the applicant's specific case instead of falling back on generic advice.",
              },
              {
                number: "02",
                title: "It learns as you chat.",
                body: "Instead of a long form upfront, it starts with a short intake and keeps learning as the user talks. It asks follow-ups when it needs more context, and suggests what to ask when the user isn't sure.",
              },
              {
                number: "03",
                title: "It walks you through every form, field by field.",
                body: "When the user uploads a USCIS form, Strawberry Matcha checks each field against the case it has built. It points out what's missing, what looks off, and how to fix it before submission.",
              },
            ],
          },
        ],
      },
      {
        id: "features",
        title: "Key features",
        eyebrow:
          "Three features that close the gap between filing alone and having a lawyer.",
        body: "",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            title: "Ask Strawberry Matcha, a conversation that knows your case.",
            body: "Users can ask anything, anytime. Strawberry Matcha answers based on the applicant's actual case status and preparation progress, and updates the case as the conversation continues.",
          },
          {
            kind: "annotatedCallout",
            label: "My goal",
            body: "Make immigration questions feel like talking to someone who already knows your case, not searching a forum.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "feature_ask-sm.mp4",
            description: "Ask Strawberry Matcha demo",
            mediaType: "video",
            ratio: "16/9",
          },
          {
            kind: "subheading",
            title: "Field Translator, fills the gap between your real life and the form.",
            body: "The applicant uploads a USCIS form PDF (any edition). The system reads the actual fields, cross-references the case data, and tells the user what to enter in each one, including the trickiest part: format conversion. A Korean address gets reshaped into US form structure. A Korean name gets matched to passport romanization. The values come out form-ready.",
          },
          { kind: "fieldTranslator" },
          {
            kind: "mediaPlaceholder",
            filename: "feature_field-translator.mp4",
            description: "Field Translator walkthrough",
            mediaType: "video",
            ratio: "16/9",
          },
          {
            kind: "subheading",
            title: "Timeline guidance, so you know where you are and what's next.",
            body: "Each milestone shows where the applicant is in the process, what the step actually means, and what usually happens next, so the case never feels like a black box.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "feature_timeline.png",
            description: "Timeline screen",
            mediaType: "image",
            ratio: "16/9",
          },
        ],
      },
      {
        id: "process",
        title: "Design process",
        eyebrow:
          "From concept to crafted product in five steps, plus two design decisions that defined the shape of it.",
        body: "",
        contentBlocks: [
          {
            kind: "numberedTimeline",
            steps: [
              {
                num: "01",
                name: "Define concept and Research to train the AI",
                note: "Mapped how immigration lawyers actually walk a couple through CR1 / F2A.",
              },
              {
                num: "02",
                name: "Design System Architecture",
                note: "Used Cursor's plan mode to map out the full system as a diagram, so I could see how every piece fit before writing code.",
              },
              {
                num: "03",
                name: "Fast validation",
                note: "Used Cursor to spin up a working prototype quickly, so I could test the idea with real applicants before investing more.",
              },
              {
                num: "04",
                name: "Iterations",
                note: "Reworked chat structure and onboarding based on where trust was breaking.",
              },
              {
                num: "05",
                name: "Craft refinement",
                note: "Polished the UI in Figma, tightening tone, pacing, and visual hierarchy across the whole product.",
              },
            ],
          },
          {
            kind: "subheading",
            kicker: "Decision 01",
            title: "Reducing cognitive overload in chat.",
            compact: true,
          },
          {
            kind: "annotatedCallout",
            label: "User insight",
            body: "Users were getting good answers but couldn't act on them. They couldn't tell what mattered most, and didn't know what to ask next.",
          },
          {
            kind: "prose",
            body: "The first version of the chat dumped each response into one long paragraph. The AI was answering well, but the answers weren't usable. People scanned, hesitated, and stopped.\n\nI explored three ways to give responses more shape before settling on one.",
          },
          {
            kind: "explorationCards",
            options: [
              {
                number: "01",
                title: "Single response paragraph.",
                pros: ["Fast to implement; no extra UI."],
                cons: [
                  "Buries what matters most.",
                  "Users don't know what to ask next.",
                ],
              },
              {
                number: "02",
                title: "Full doc-style hierarchy with headers and bullets.",
                pros: ["Maximum scannability."],
                cons: [
                  "Loses conversational warmth.",
                  "Overkill for short answers.",
                ],
              },
              {
                number: "03",
                title:
                  "Two-layer voice (serif acknowledgment + sans-serif info) with suggested follow-ups.",
                pros: [
                  "Reads warm and human.",
                  "Scannable at a glance.",
                  "Nudges the next question.",
                ],
                cons: ["More design and prompt work."],
              },
            ],
            finalPickLabel: "Final pick: Option 03",
            finalPickBody:
              "Two-layer voice keeps the chat warm but makes the answer scannable, and the suggested follow-ups stop users from getting stuck on what to ask next.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "v0_chat-before.png",
            description: "Single block of text. Hard to scan, no clear next step.",
            mediaType: "image",
            ratio: "16/9",
            captionLabel: "Before",
          },
          {
            kind: "mediaPlaceholder",
            filename: "v1_chat-after.png",
            description:
              "Layered response with personal acknowledgment, information, and suggested follow-ups.",
            mediaType: "image",
            ratio: "16/9",
            captionLabel: "After",
          },
          {
            kind: "subheading",
            kicker: "Decision 02",
            title: "Onboarding as the foundation of trust.",
            compact: true,
          },
          {
            kind: "annotatedCallout",
            label: "Design consideration",
            body: "The AI is only as accurate as what it knows about you. If onboarding leaks, every answer downstream leaks too.",
          },
          {
            kind: "prose",
            body: "The original onboarding was too short. Without enough context about the user's case, the AI was filling gaps by guessing, and the hallucinations broke trust fast.\n\nI studied how immigration lawyers actually intake their clients. The questions they ask up front aren't paperwork. They're how the lawyer learns the case before giving any advice. I rebuilt onboarding around those same questions, so the AI starts with enough context to be accurate from the first message.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "v1_onboarding.png",
            description: "Onboarding flow, modeled after lawyer intake.",
            mediaType: "image",
            ratio: "16/9",
          },
        ],
      },
      {
        id: "reflection",
        title: "Reflection",
        eyebrow:
          "What I took away from designing an AI agent for a high-stakes legal workflow.",
        body: "",
        contentBlocks: [
          {
            kind: "takeawayCards",
            cards: [
              {
                title: "Designing an AI agent is designing how it thinks.",
                body: "Most of the work happened underneath the screens. Prompts, follow-up logic, what the AI asks versus what it answers, what it stores about the user. The visible UI was the smallest part.",
              },
              {
                title: "Onboarding is data acquisition, not a signup.",
                body: "How well an AI agent performs depends on what it knows going in. Designing onboarding well is designing the AI's first impression of the user, and everything downstream flows from there.",
              },
              {
                title: "Conversational UX is about pacing, not just tone.",
                body: "Users filing alone don't need more information. They need information at the right moment, in a shape they can act on, with a clear next step. That's a design problem, not a content problem.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "vibemaker",
    title: "Vibemaker",
    tagline: "A public lab for vibe coding and building in the open.",
    summary:
      "Short-form experiments where I use AI coding tools to design, build, and document small products, websites, and creative interfaces.",
    category: "Creative Lab",
    role: "Designer · Builder · Storyteller",
    tools: ["Cursor", "React", "Framer", "YouTube"],
    focus: ["Vibe coding", "Creative tooling", "Build-in-public storytelling"],
    year: "2026",
    cover: {
      filename: "vibemaker_hero.jpg",
      description: "YouTube channel still / vibe-coding shot",
      ratio: "16/9",
    },
    featured: true,
    externalLink: {
      label: "Watch Vibemaker",
      href: "https://www.youtube.com/@Vibemaker_l0l",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "Vibemaker is my creative lab for documenting what it feels like to build with AI tools. It connects design, code, narrative, and the messy middle of making things quickly.",
      },
      {
        id: "direction",
        title: "Direction",
        body: "The project is less about tutorials and more about process: how ideas become prototypes, how tools change the pace of design, and how a designer can build without waiting for perfect conditions.",
      },
    ],
  },
];

export function getFeatured(): CaseStudy[] {
  return projects.filter((p) => p.featured).slice(0, 3);
}

export function getProject(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}

export function allSlugs(): string[] {
  return projects.map((p) => p.slug);
}
