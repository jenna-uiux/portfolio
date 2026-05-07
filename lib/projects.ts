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
    tagline: "AI agent for marriage-based green card applicants.",
    summary:
      "A case-aware assistant that infers what each applicant actually needs and translates their real data into form-ready values.",
    category: "AI UX / Legal workflow",
    role: "AI UX Designer · Solo project",
    tools: [
      "Cursor",
      "Claude API",
      "Supabase",
      "Figma",
    ],
    focus: [
      "Conversational AI",
      "Multi-agent system design",
      "Decision-support UX",
    ],
    year: "2026",
    cover: {
      filename: "strawberry-matcha_hero.mp4",
      description: "Strawberry Matcha — hero demo",
      ratio: "16/9",
    },
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        eyebrow: "Case-aware clarity, not generic legal advice",
        body: "Strawberry Matcha is an AI agent for people filing their own marriage-based green card. The name maps to the domain: **strawberry** for marriage, **matcha** for the green card itself.\n\nMost guidance online is about immigration in general. The product goal here is the opposite — guidance about *your* case, grounded in the situation you actually have.",
      },
      {
        id: "problem",
        title: "The Problem",
        eyebrow: "Filing alone is harder than it should be.",
        body: "Applying for a marriage-based green card sounds simple. Fill out forms, upload documents, wait. The reality is messier.\n\nThe information exists, just scattered across USCIS pages, Reddit threads, and lawyer blogs from years ago. Forms keep changing editions, so guides that worked last year point to fields that no longer exist.",
        contentBlocks: [
          {
            kind: "numberedList",
            intro: "Three questions keep coming back:",
            items: [
              "What does my case actually need?",
              "How do I fill this field on this version of the form?",
              "Did I miss something important?",
            ],
          },
          {
            kind: "annotation",
            label: "Insight",
            body:
              "Information about immigration is everywhere. What's missing is ==information about your case==.",
          },
          {
            kind: "callout",
            body:
              "That gap is what a lawyer fills. They look at your situation, decide what applies, and walk you through every form field knowing your facts. I wanted to see if an AI agent could do the same translation work.",
          },
        ],
      },
      {
        id: "solution",
        title: "Solution",
        eyebrow: "A case translation engine.",
        body: "Strawberry Matcha doesn't ask the user to figure out what they need. It infers what they need from their situation, then translates their real data into form-ready values.",
        mediaAfterBody: [
          {
            kind: "image",
            filename: "solution_overview.png",
            description: "Product overview — case translation engine",
            ratio: "16/9",
          },
        ],
      },
      {
        id: "features",
        title: "Key Features",
        eyebrow: "Three features. Each replaces a moment of confusion.",
        body: "",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            kicker: "01",
            title: "Ask Strawberry Matcha",
            body: "A contextual explain layer. Tap any document, field, or milestone to get an answer specific to your case — not a generic FAQ entry.",
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
            kicker: "02",
            title: "Field Translator",
            body: "Upload your USCIS form PDF. The system reads the actual fields in your edition, cross-references your data, and tells you exactly what to enter.",
          },
          {
            kind: "comparison",
            items: [
              {
                label: "User input",
                title: "서울특별시 강남구 테헤란로 123 101동 202호",
                body: "Free-form Korean address as the applicant naturally writes it.",
              },
              {
                label: "USCIS form output",
                title: "Structured form fields",
                body: "Street Number: **123**\n\nStreet Name: **Teheran-ro**\n\nApt/Unit: **Dong 101, Ho 202**\n\nCity: **Gangnam-gu**\n\nState: **Seoul**",
              },
            ],
          },
          {
            kind: "mediaPlaceholder",
            filename: "feature_field-translator.mp4",
            description: "Field Translator walkthrough",
            mediaType: "video",
            ratio: "16/9",
          },
          {
            kind: "subheading",
            kicker: "03",
            title: "Timeline Guidance",
            body: "Each milestone shows where you are, what the step means, and what usually happens next — so the long wait stops feeling like a black box.",
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
        title: "How I Built It",
        eyebrow: "Three versions in three weeks.",
        body: "Each version surfaced what was wrong with the version before it.",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            kicker: "v1",
            title: "Product validation",
            body: "Wrote a one-page PRD with ChatGPT, locked in colors and fonts, then used Cursor's Plan Mode to generate the first build in about three hours. Goal was speed, not quality. I needed something real to react to.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "v1_architecture.png",
            description: "V1 system architecture",
            mediaType: "image",
            ratio: "16/9",
          },
          {
            kind: "subheading",
            kicker: "pivot",
            title: "It was a generic to-do app.",
            body: "Lawyers don't hand you a checklist. They understand your situation first, then guide your full process. I needed to stop building checklist software and start building a case-aware assistant.",
          },
          {
            kind: "subheading",
            kicker: "v2",
            title: "Closer to the real idea",
            body: "I researched how immigration attorneys actually handle marriage-based cases, then redesigned the system around that workflow.",
          },
          {
            kind: "comparison",
            items: [
              {
                label: "V1 problem",
                title: "Static checklist",
                body: "Seeded the same items for every user, regardless of their case.",
              },
              {
                label: "V2 decision",
                title: "Dynamic document list",
                body: "Onboarding feeds a Case Strategist agent that generates the document list dynamically from the user's situation.",
              },
            ],
          },
          {
            kind: "comparison",
            items: [
              {
                label: "V1 problem",
                title: "Generic chat",
                body: "Felt disconnected from the user's actual case data.",
              },
              {
                label: "V2 decision",
                title: "Case-aware prompts",
                body: "Every agent call ships the user's case data inside the system prompt, so answers are anchored to their facts.",
              },
            ],
          },
          {
            kind: "mediaPlaceholder",
            filename: "v2_architecture.png",
            description: "V2 event-driven architecture",
            mediaType: "image",
            ratio: "16/9",
          },
          {
            kind: "mediaPlaceholder",
            filename: "v2_onboarding.png",
            description: "V2 four-screen onboarding",
            mediaType: "image",
            ratio: "16/9",
          },
          {
            kind: "subheading",
            kicker: "v3",
            title: "Improving the conversation",
            body: "The system worked. The conversation didn't. Legal explanations got long fast, and users often didn't know what to ask next.\n\nI ran a quality review (High / Medium / Low priority) and redesigned the response format around two anchors: **what's missing** and **what's next**.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "v3_conversation.mp4",
            description: "V3 conversation redesign",
            mediaType: "video",
            ratio: "16/9",
          },
          {
            kind: "subheading",
            title: "Six agents, one product",
            body: "The user never sees the agents. They see one coherent product. That coherence has to be designed.",
          },
        ],
        bullets: [
          "**01 — Intake & Risk Screener** · turns onboarding answers into a risk profile.",
          "**02 — Case Strategist** · generates the dynamic document and milestone plan.",
          "**03 — Form Preparation** · translates user data into form-ready field values.",
          "**04 — Document Reviewer** · checks uploads against the user's case context.",
          "**05 — RFE Response** · drafts replies when USCIS asks for more evidence.",
          "**06 — Explain Agent** · powers the contextual Ask Strawberry Matcha layer.",
        ],
      },
      {
        id: "takeaway",
        title: "Takeaway",
        eyebrow: "From interface design to system design.",
        body: "This project moved me past designing only the screens. Most of the work happened in the system underneath.",
        contentBlocks: [
          {
            kind: "takeawayCards",
            cards: [
              {
                title: "Agent workflows",
                body: "Designed multi-agent architecture using Cursor Plan Mode. Defined how events route between agents and how state propagates back to the UI.",
              },
              {
                title: "LLM integration",
                body: "Connected Supabase Edge Functions with the Claude API for structured outputs. Treated system prompts and JSON schemas as part of the design surface.",
              },
              {
                title: "Personalized context",
                body: "Designed onboarding as the entry point for case context. Every downstream agent call ships with case-specific data.",
              },
              {
                title: "Decision-support UX",
                body: "Translated a complex legal workflow into a calm, structured interaction model. Replaced chat-first interfaces with contextual explanations tied to UI elements.",
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
