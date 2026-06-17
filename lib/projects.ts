export type ImageRatio = "16/9" | "4/3" | "4/5" | "1/1" | "3/2" | "21/9";

export type ImagePlaceholder = {
  filename: string;
  description: string;
  ratio?: ImageRatio;
  /** Public URL under `/public` (e.g. `/media/fini/thumbnail/demo.mp4`) */
  videoSrc?: string;
  /** Public URL under `/public` for a static image cover. */
  src?: string;
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
        body?: string;
        /** Optional bullet list rendered below the title (used by Fini's contrast grid). */
        examples?: string[];
        /** Optional verdict line rendered at the bottom (e.g. "Completed on schedule"). */
        verdict?: string;
        verdictTone?: "done" | "fail";
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
      /** Optional public URL under `/public` (e.g. `/media/...`). If present, renders real media instead of a placeholder. */
      src?: string;
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
        /** Optional small accent caption rendered above the title (e.g. "ANSWERS INSIGHT 03"). */
        label?: string;
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
      kind: "researchMeta";
      items: { value: string; label: string }[];
    }
  | {
      kind: "evidenceInsights";
      insights: {
        number: string;
        title: string;
        body: string;
        evidenceQuote?: string;
        evidenceSource?: string;
        footer?: string;
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
    }
  | {
      kind: "imageCarousel";
      images: { src: string; alt: string }[];
      ratio?: ImageRatio;
      caption?: string;
    }
  | {
      kind: "roadWaterToggle";
      defaultMode?: "road" | "water";
      caption?: string;
    }
  | { kind: "iaMatrix"; caption?: string }
  | {
      kind: "teamGrid";
      members: { name: string; role: string; photo: string }[];
    }
  | { kind: "jakartaContext" }
  | {
      kind: "designPrinciples";
      principles: {
        number: string;
        title: string;
        tagline: string;
        videoSrc: string;
        iconSrc: string;
        /** Shown on hover (md+) over the panel. */
        hoverDescription?: string;
      }[];
    }
  | {
      kind: "mediaStatement";
      src: string;
      alt?: string;
      eyebrow?: string;
      headline?: string;
      body?: string;
      source?: string;
      ratio?: "21/9" | "16/9" | "4/3" | "3/2";
      overlay?: number;
      align?: "center" | "left-bottom";
      /** Smaller headline for dense slides (e.g. Background research strip). */
      headlineSize?: "default" | "compact";
    }
  | {
      kind: "proseTwoColumn";
      left: string;
      right: string;
    }
  | { kind: "personaCollage" }
  | { kind: "modesShowcase" }
  | {
      kind: "backgroundPinnedDeck";
      /** Section kicker (e.g. "Background") — when set, render inside pin with the deck. */
      kicker?: string;
      /** Shown above the deck inside the pin region so it stays visible while scrubbing. */
      eyebrow?: string;
      slides: {
        src: string;
        alt: string;
        headline: string;
        body?: string;
        source?: string;
        overlay?: number;
        align?: "center" | "left-bottom";
      }[];
    }
  | {
      kind: "aeonTargetSpread";
      row1: {
        label: string;
        headline: string;
        supporting: string;
        mapSrc: string;
        mapAlt: string;
      };
      row2: {
        mapSrc: string;
        mapAlt: string;
        headline: string;
        source?: string;
      };
      row3: {
        statement: string;
      };
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
  /** Optional alternate cover for the home teaser (defaults to `cover`). */
  teaserCover?: ImagePlaceholder;
  featured: boolean;
  /** Short labels shown on the home teaser (e.g. "Agentic Coding"). */
  tags?: string[];
  /** Site-wide tone override while this case study is open. */
  theme?: "light" | "dark";
  externalLink?: { label: string; href: string };
  sections: CaseSection[];
};

export const projects: CaseStudy[] = [
  {
    slug: "fini",
    title: "Fini",
    tagline:
      "An accountability companion for the plans no one else is waiting on.",
    summary:
      "Designed and developed an AI productivity mobile app that adapts to users' energy levels using Apple Health data",
    category: "AI UX / Productivity",
    tags: ["Agentic Coding"],
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
      filename: "fini_thumbnail.mp4",
      description: "Fini hero, phone in hand with planner UI",
      ratio: "16/9",
      videoSrc:
        "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/fini_thumbnail.mp4",
    },
    teaserCover: {
      filename: "fini_thumbnail.mp4",
      description: "Fini home teaser, phone in hand with planner UI",
      ratio: "21/9",
      videoSrc:
        "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/fini_thumbnail.mp4",
    },
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        eyebrow:
          "Personal plans deserve the same accountability as everything else on your calendar.",
        body: "Fini is an accountability companion for the plans you make to yourself. The portfolio you keep meaning to update. The skill you wanted to learn. The plans no one else is waiting on.",
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
              titleLines: ["Understands your energy.", "Helps you start."],
              body: "Fini reads your daily energy using signals from Apple Health. When your energy is low, it breaks tasks into smaller steps to help you get started.",
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
              body: "Describe what you need to do in your own words. Fini understands your intent and turns it into a prioritized task plan.",
              textSide: "right",
              /** Net +16px vs default -48px column lift ≈ 64px lower than -translate-y-12 baseline. */
              textColumnYClass: "md:translate-y-4",
            },
          },
          {
            kind: "image",
            filename: "highlight-watch.png",
            description:
              "Next step on Apple Watch, glanceable, focused forward motion",
            src: "/images/fini/figma-highlights/highlight-watch.png",
            ratio: "16/9",
            finiHighlight: {
              titleLines: ["Your next step, on your wrist"],
              body: "Fini brings the right next step to your Apple Watch so you can stay focused and keep moving forward.",
              textSide: "right",
            },
          },
        ],
      },
      {
        id: "problem",
        title: "The Problem",
        eyebrow:
          "The plans that shape who you become are always the first to break.",
        body: "Look at the plans you finished this week. Then look at the ones you didn't. The pattern isn't random. The plans that finished were the ones with external accountability. The 10am meeting. The deadline your manager set.\n\nBut the plans that fell through had no deadlines, **even though they were the ones that actually grow you.**",
        contentBlocks: [
          {
            kind: "comparison",
            items: [
              {
                label: "PLANS THAT FINISHED",
                title: "External accountability",
                examples: [
                  "Team standup",
                  "Client deadline",
                  "Wednesday class",
                  "Doctor's appointment",
                ],
                verdict: "Completed on schedule",
                verdictTone: "done",
              },
              {
                label: "PLANS THAT DIDN'T",
                title: "Internal accountability",
                examples: [
                  "Update portfolio",
                  "Study Swift",
                  "Side project",
                  "Daily writing",
                ],
                verdict: "Postponed indefinitely",
                verdictTone: "fail",
              },
            ],
          },
        ],
      },
      {
        id: "research",
        title: "Research",
        eyebrow:
          "Why does this keep happening, even to people who genuinely want to grow?",
        body: "I ran a 6-day diary study to see what people actually do when they're alone with their own goals.",
        contentBlocks: [
          {
            kind: "researchMeta",
            items: [
              { value: "3", label: "Participants" },
              { value: "6", label: "Days each" },
              { value: "2×", label: "Daily check-ins" },
              { value: "5", label: "Patterns found" },
            ],
          },
          {
            kind: "subheading",
            compact: true,
            title: "",
            body: "Each participant logged energy, mood, intended tasks, and what they actually finished, twice a day. Three findings reframed the entire problem.",
          },
          {
            kind: "evidenceInsights",
            insights: [
              {
                number: "01",
                title: "The accountability gap is **real**, and it's binary.",
                body: "On the same day, with the same available time, participants completed nearly 100% of externally driven tasks (meetings, classes, deadlines) while postponing self-initiated tasks again and again.",
                evidenceQuote:
                  "Structured, externally driven tasks were consistently completed. Self-initiated tasks were frequently postponed. Users rely heavily on external accountability to maintain consistency.",
                evidenceSource: "Diary Study · Behavioral Pattern A",
                footer:
                  "The pattern is **structural**. Every work commitment lives inside a system of reminders, calendars, and witnesses. Self-promises live alone.",
              },
              {
                number: "02",
                title: "Starting is the hard part.",
                body: 'Once participants began a task, momentum sustained itself. The breakdown happened at the activation threshold. Vague tasks ("study," "work on portfolio") collapsed first because there was no concrete first step to execute.',
                evidenceQuote:
                  "The hardest step is starting. Once started, users sustain momentum easily. Vague task descriptions led to avoidance and procrastination.",
                evidenceSource: "Diary Study · Behavioral Patterns 3 & 5",
              },
              {
                number: "03",
                title: "Capacity is **measurable**. Intention isn't.",
                body: "The most consequential finding: participants abandoned plans when their **biological capacity** ran out, regardless of how much time they had left. Poor sleep, low recovery, and accumulated fatigue predicted abandonment more reliably than mood, motivation, or schedule density.",
                evidenceQuote:
                  "Recovery quality depended on sleep quality and emotional stability. Anxiety, stress, and sleep deprivation caused procrastination even when energy levels felt high. Users consistently overestimated their daily capacity, leading to over-scheduling and task fatigue.",
                evidenceSource: "Diary Study · Insights A, B, D",
                footer:
                  "People plan with their **aspirations**. They execute with their **biology**. Biology is the half of that equation already being measured every minute, by the device on their wrist.",
              },
            ],
          },
        ],
      },
      {
        id: "system-architecture",
        title: "Systems Architecture",
        eyebrow: "Let's see the Big Picture!",
        body: "Fini does two things. It gives self-initiated plans **external accountability**. It anchors every plan to the **biological capacity** your body actually has today. Before writing a line of SwiftUI, I mapped how those two promises had to flow through one shared engine.\n\n[[MEDIA_AFTER_BODY]]\n\nAt the heart of that engine is a single number: how much your body can actually carry today.",
        mediaAfterBody: [
          {
            kind: "video",
            filename: "system-layer.mp4",
            description:
              "System architecture, signals, inference, and planning surface",
            src: "https://youtu.be/XDqWAexK94A",
            ratio: "16/9",
            autoPlay: true,
            loop: true,
            muted: true,
            controls: true,
            objectFit: "contain",
          },
        ],
        contentBlocks: [
          {
            kind: "logicDemo",
            title: "The Logic: Quantifying Capacity",
            body: "Sleep, HRV, and Activity flow into a single function. The output is a personalized energy score that tells the plan what your body can actually carry today.",
          },
          {
            kind: "annotatedCallout",
            label: "DESIGN PRINCIPLE",
            body: "The plan follows the body's lead.",
          },
        ],
      },
      {
        id: "product",
        title: "The Product",
        eyebrow: "Three behaviors. One companion.",
        body: "Each behavior maps directly to a research finding. Every screen earned its place in the diary study.",
        contentBlocks: [
          {
            kind: "v2Items",
            items: [
              {
                number: "01",
                label: "ANSWERS INSIGHT 03",
                title: "Reads what your body can actually do today.",
                body: "Fini pulls sleep, HRV, and resting heart rate from Apple Health and computes a daily capacity score. On a low-capacity day, the plan adapts: a 90-minute deep work block becomes a 15-minute review. The day still moves forward.",
                imageSrc: "/images/fini/figma-highlights/highlight-energy.png",
                imageAlt:
                  "Capacity-aware planner adapts task scope to today's energy",
              },
              {
                number: "02",
                label: "ANSWERS INSIGHT 02",
                title: "Lowers the activation barrier to nearly zero.",
                body: "Manual task entry is a tax on people who are already depleted. Speak what's in your head; Fini parses, prioritizes, and breaks vague intentions into concrete first steps. 15 minutes of planning becomes 30 seconds of speaking.",
                videoSrc: "https://youtu.be/polxGcvmrB4",
              },
              {
                number: "03",
                label: "ANSWERS INSIGHT 01",
                title: "Becomes the witness your self-promises don't have.",
                body: "Work has Slack, calendar invites, colleagues asking where things stand. Self-initiated work has none of that. Fini surfaces the next step on your wrist in the moments you'd otherwise drift, the way a calendar invite makes a meeting visible.",
                imageSrc: "/images/fini/figma-highlights/highlight-watch.png",
                imageAlt:
                  "Apple Watch surfaces the next concrete step at the right moment",
              },
            ],
          },
        ],
      },
      {
        id: "build-iterate",
        title: "Build & Iterate",
        eyebrow: "From hypothesis to working system in 24 hours.",
        body: "Static mockups can't reveal whether a behavioral system actually works. With a clear PRD and the architecture mapped, I shipped a functional V1 in a day and put it in front of users.",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            kicker: "approach",
            title: "24-hour validation loop",
            body: "I designed in Cursor with the inference layer wired live, so user testing could run on real bio-data the next morning.",
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
                body: "A fully functional prototype, ready for the first real user test. Rough, but real.",
              },
            ],
          },
          {
            kind: "subheading",
            kicker: "v1",
            title: "What broke under real use",
            body: "User testing surfaced four gaps no Figma file would have caught.",
          },
          {
            kind: "flipCards",
            cards: [
              {
                label: "UX",
                title: "Cognitive Overload",
                front:
                  'The act of manual task entry (categorizing, typing, and assigning energy weights) became a "second job" for users who were already biologically depleted.',
                back: '"I\'m already exhausted. Having to type out my tasks and decide on energy levels feels like more work. I wish it could just hear my state and suggest the plan for me."',
              },
              {
                label: "Concept",
                title: 'The "Starting" Friction',
                front:
                  "Users were paralyzed by the sheer effort of starting while in a low-energy state. Flexible scheduling was a secondary need.",
                back: "\"Flexible deadlines are great, but I'm so drained I don't even know where to begin. I just need the system to pick one small thing I can actually handle right now.\"",
              },
              {
                label: "UI",
                title: "Invisible Systems are Untrustworthy",
                front:
                  "While the backend was processing complex bio-signals, the static UI didn't communicate this activity. The black-box approach led to skepticism about the AI's logic.",
                back: "\"It says it's connected to my Watch, but I don't see any of my data on the screen. How do I know if this plan is actually based on my recovery or just random suggestions?\"",
              },
              {
                label: "Performance",
                title: "Logic Lag & Latency",
                front:
                  "Technical audits revealed inefficient asynchronous calls and an unoptimized inference engine, resulting in data loading latencies of 0.8s to 1.2s.",
                back: "Projected to drop trust scores by 40% and lift drop-off by ~25%, since users equate latency with system unreliability.",
                backLabel: "Engineering Impact",
              },
            ],
          },
          {
            kind: "subheading",
            kicker: "v2",
            title: "Each gap, addressed",
            body: "Every change traces back to a specific user-testing finding.",
          },
          {
            kind: "v2Items",
            items: [
              {
                number: "01",
                title: "Voice Task Entry",
                body: "To eliminate the cognitive load of manual entry, I implemented Voice Capture. An Edge Function parses natural language into categorized, energy-weighted tasks, removing the friction of planning.",
                videoSrc: "https://youtu.be/polxGcvmrB4",
              },
              {
                number: "02",
                title: "Making It Easier to Start",
                body: "Energy-Matched Breakdown turns large, overwhelming tasks into small, doable steps based on real-time energy, **so users can take the first step, even on low-energy days.**",
                videoSrc: "https://youtu.be/gVS543_K-bs",
              },
              {
                number: "03",
                title: "Making the system visible",
                body: "I redesigned the Hero Section to surface raw bio-data (HRV, Stress, Sleep). When the system's reasoning is visible, the AI feels trustworthy. Choosing what to surface became the central UX decision.",
                imageSrc: "/media/fini/design-build/visualTrust.jpg?v=2",
                imageAlt:
                  "Making the system visible: before static UI vs after data-driven interface with bio-signals",
              },
              {
                number: "04",
                title: "Optimizing the Bio-Inference Model",
                body: "The initial energy model was skewed by workout data, leading to inaccurate scheduling. I directed Cursor to re-engineer the data ingestion layer, prioritizing Resting Heart Rate for biological accuracy and adding query caching to cut system latency.",
                hasConsole: true,
              },
            ],
          },
          {
            kind: "subheading",
            kicker: "v∞",
            title: "Solving the edge cases",
            body: "User testing keeps running. Each edge case ships back into the model and the UI.",
          },
          { kind: "edgeCaseExplorer" },
        ],
      },
      {
        id: "impact-vision",
        title: "Impact & Vision",
        eyebrow: "Help people keep promises to themselves.",
        body: "Through structure that adapts to how their body actually works, and accountability that finally exists for the plans no one else is waiting on.",
        contentBlocks: [
          {
            kind: "annotatedCallout",
            label: "REFLECTION",
            body: "Designing while shipping changed what I treat as 'done.' When the inference layer broke on a Tuesday-morning user, I fixed it the same hour because I'd also written the SwiftUI view it broke. Of the five patterns the diary study surfaced, three made V1 and two are waiting for the next sprint. That triage is the design engineer's job: weighing the user's evidence against the system's constraints, and shipping the version where they meet.",
          },
          {
            kind: "takeawayCards",
            cards: [
              {
                title: "What I gained",
                body: "Merging design and engineering into one person collapsed the iteration loop from days to hours. The design got better because the engineering kept pushing back.\n\n[View my note →](https://docs.google.com/document/d/12PMD79Cqjkw8ChC-CLue5E5lhuJFyfU7k8Eio9iWtCo/edit?usp=sharing)",
              },
              {
                title: "Recognition",
                body: "Selected for the Academy of Art University 2026 Spring Show.\n\n[View Spring Show page →](https://2026springshow.academyart.edu/student/jihyeon-jang/)",
              },
              {
                title: "What's next",
                body: "App Store launch. Goal: **500 users** and a **4.5★** rating in month one.",
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
      "Designed a trustworthy AI assistant for legal workflows, focusing on safety guardrails, transparency, and human oversight",
    category: "AI UX / Legal workflow",
    tags: ["Agentic Coding"],
    role: "AI UX Designer · Solo project",
    tools: ["Cursor", "Claude API", "Supabase", "Figma"],
    focus: ["Conversational AI", "Decision-support UX"],
    timeline: "3 weeks · v0 → v1",
    year: "2026",
    cover: {
      filename: "strawberryMatcha_thumbnail.mp4",
      description: "Strawberry Matcha hero demo",
      ratio: "16/9",
      videoSrc:
        "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/strawberryMatcha_thumbnail.mp4",
    },
    teaserCover: {
      filename: "strawberryMatcha_thumbnail.mp4",
      description: "Strawberry Matcha home teaser",
      ratio: "21/9",
      videoSrc:
        "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/strawberryMatcha_thumbnail.mp4",
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
        eyebrow: "Filing alone leads to mistakes. General AI makes it worse.",
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
        body: "",
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
            title:
              "Ask Strawberry Matcha, a conversation that knows your case.",
            body: "Users can ask anything, anytime. Strawberry Matcha answers based on the applicant's actual case status and preparation progress, and updates the case as the conversation continues.",
          },
          {
            kind: "annotatedCallout",
            label: "My goal",
            body: "Make immigration questions feel like talking to someone who already knows your case, not searching a forum.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "demo_01.mp4",
            description: "Ask Strawberry Matcha demo",
            mediaType: "video",
            ratio: "16/9",
            src: "https://youtu.be/xYQwGtphHus",
          },
          {
            kind: "subheading",
            title:
              "Field Translator, fills the gap between your real life and the form.",
            body: "The applicant uploads a USCIS form PDF (any edition). The system reads the actual fields, cross-references the case data, and tells the user what to enter in each one, including the trickiest part: format conversion. A Korean address gets reshaped into US form structure. A Korean name gets matched to passport romanization. The values come out form-ready.",
          },
          { kind: "fieldTranslator" },
          {
            kind: "mediaPlaceholder",
            filename: "demo_02.mp4",
            description: "Field Translator walkthrough",
            mediaType: "video",
            ratio: "16/9",
            src: "https://youtu.be/UpcUNjCdrGE",
          },
          {
            kind: "subheading",
            title:
              "Timeline guidance, so you know where you are and what's next.",
            body: "Each milestone shows where the applicant is in the process, what the step actually means, and what usually happens next, so the case never feels like a black box.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "demo_03.mp4",
            description: "Timeline screen",
            mediaType: "video",
            ratio: "16/9",
            src: "https://youtu.be/HdhcB66vtPU",
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
                name: "Define concept\n& Research to train the AI",
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
                image: {
                  filename: "conversationalAIUI/01.png",
                  description:
                    "Single response paragraph: a long block of text that buries the answer.",
                  src: "/images/strawberryMatcha/designDecision/conversationalAIUI/01.png",
                },
              },
              {
                number: "02",
                title: "Full doc-style hierarchy with headers and bullets.",
                pros: ["Maximum scannability."],
                cons: [
                  "Loses conversational warmth.",
                  "Overkill for short answers.",
                ],
                image: {
                  filename: "conversationalAIUI/02.png",
                  description:
                    "Doc-style response with bold headers and bullet lists.",
                  src: "/images/strawberryMatcha/designDecision/conversationalAIUI/02.png",
                },
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
                image: {
                  filename: "conversationalAIUI/03.png",
                  description:
                    "Two-layer response: serif acknowledgment, sans-serif body, suggested follow-up chips.",
                  src: "/images/strawberryMatcha/designDecision/conversationalAIUI/03.png",
                },
              },
            ],
            finalPickLabel: "Final pick: Option 03",
            finalPickBody:
              "Two-layer voice keeps the chat warm but makes the answer scannable, and the suggested follow-ups stop users from getting stuck on what to ask next.",
          },
          {
            kind: "image",
            src: "/images/strawberryMatcha/designDecision/conversationalAIUI/final.jpg",
            alt: "Final design: two-layer voice response with serif acknowledgment, sans-serif info, and suggested follow-up chips.",
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
            kind: "imageCarousel",
            ratio: "16/9",
            caption: "Onboarding flow, modeled after lawyer intake.",
            images: [
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/1.jpg",
                alt: "Step 1 — Welcome screen: Let's set up your immigration case.",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/2.jpg",
                alt: "Step 2 of 7 — Who are you in this case? (beneficiary, petitioner, helping someone else)",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/3.jpg",
                alt: "Step 3 of 7 — What type of relationship-based case is this? (marriage-based, family-based, not sure yet)",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/4.jpg",
                alt: "Step 4 of 9 — A few details about your case (U.S. citizen vs green card holder petitioner).",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/5.jpg",
                alt: "Step 5 of 9 — Where is the beneficiary living right now? (inside vs outside the United States)",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/6.jpg",
                alt: "Step 6 of 10 — What is the beneficiary's current immigration status?",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/7.jpg",
                alt: "Step 7 of 10 — About the petitioner: legal name, citizenship, address, income, household size.",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/8.jpg",
                alt: "Step 8 of 10 — About the beneficiary: legal name, country of birth, current address, prior denials, criminal record.",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/9.jpg",
                alt: "Step 9 of 10 — Marriage details: date, country, prior marriages.",
              },
              {
                src: "/images/strawberryMatcha/designDecision/onboarding/10.jpg",
                alt: "Step 10 of 10 — Review your case setup before creating the case file.",
              },
            ],
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
    slug: "aeon",
    title: "AEON",
    tagline: "Cruise Beyond the Future.",
    summary:
      "Led product direction and designed an adaptive vehicle interface for a 2050 amphibious mobility concept sponsored by Autodesk",
    category: "Mobility / HMI Design",
    tags: ["HMI", "Mobility"],
    role: "Product Designer · UI/UX lead in a 5-person team",
    team: "2 Industrial Designers, 1 Brand Strategist, 1 Interior Architect Designer, me",
    tools: ["Figma", "After Effects"],
    focus: ["Multimodal HMI", "Adaptive in-vehicle UI"],
    timeline: "Fall 2025 · concept → proof of concept",
    year: "2025",
    theme: "dark",
    cover: {
      filename: "aeon_thumbnail_1.jpg",
      description: "AEON concept car on water — case study hero",
      ratio: "16/9",
      src: "/images/aeon/hero/aeon_thumbnail_1.jpg",
    },
    teaserCover: {
      filename: "aeon_thumbnail_3.jpg",
      description: "AEON concept car on water — home teaser",
      ratio: "21/9",
      src: "/images/aeon/hero/aeon_thumbnail_3.jpg",
    },
    featured: true,
    externalLink: {
      label: "Academy of Art × Autodesk",
      href: "https://www.academyart.edu/",
    },
    sections: [
      {
        id: "context",
        title: "Context",
        eyebrow: "Sponsored by Autodesk: Design a concept vehicle for 2050",
        body: "",
        contentBlocks: [
          {
            kind: "proseTwoColumn",
            left: "AEON is a three month project sponsored by Autodesk. Our multidisciplinary team of five was challenged to design a vehicle for 2050.",
            right:
              "We explored how future climate conditions could reshape mobility, and as the team lead and product designer, I guided the project direction and designed the in-vehicle UI/UX system for an amphibious EV that moves seamlessly between land and water.",
          },
          {
            kind: "teamGrid",
            members: [
              {
                name: "Jinghan Yang",
                role: "Industrial Designer",
                photo: "/images/aeon/team/jinghan-yang.png",
              },
              {
                name: "Bishoy M Aboseif",
                role: "Industrial Designer",
                photo: "/images/aeon/team/bishoy-aboseif.png",
              },
              {
                name: "Jihyeon Jang",
                role: "Product Designer",
                photo: "/images/aeon/team/jihyeon-jang.png",
              },
              {
                name: "Lina Hanich",
                role: "Brand Strategist",
                photo: "/images/aeon/team/lina-hanich.png",
              },
              {
                name: "Veronica Gibson",
                role: "Interior Designer",
                photo: "/images/aeon/team/veronica-gibson.png",
              },
            ],
          },
        ],
      },
      {
        id: "background",
        title: "Background",
        body: "",
        contentBlocks: [
          {
            kind: "backgroundPinnedDeck",
            kicker: "Background",
            eyebrow: "What could happen in 2050?",
            slides: [
              {
                src: "/images/aeon/context/climate-city.png",
                alt: "Flooded modern city",
                headline: "Global sea level\nwill rise **30cm by 2050**",
                overlay: 0.55,
              },
              {
                src: "/images/aeon/context/climate-city.png",
                alt: "Long-term infrastructure decay",
                headline:
                  "Asphalt and concrete\n**degrade faster** under repeated saltwater exposure.",
                body: "Corrosion of steel reinforcements in bridges and elevated roads → structural failures. Maintenance cycles shrink from decades to years.",
                source: "IPCC AR6 (2021)",
                overlay: 0.6,
                align: "left-bottom",
              },
              {
                src: "/images/aeon/context/climate-traffic.png",
                alt: "Traffic delays in rain",
                headline:
                  "Rising sea levels and increased flooding\ncan damage roads, **leading to significant traffic delays.**",
                source: "EPA (2021). Appendix G: Roads.",
                overlay: 0.6,
              },
            ],
          },
        ],
      },
      {
        id: "concept",
        title: "Concept",
        eyebrow: "Turning water from barrier → path",
        body: "",
        contentBlocks: [
          {
            kind: "designPrinciples",
            principles: [
              {
                number: "01",
                title: "Seamless Transition",
                tagline: "One continuous experience, two terrains.",
                videoSrc: "/media/aeon/principles/principle_1.mp4",
                iconSrc: "/images/aeon/principles/seamless.svg",
                hoverDescription:
                  "Moving between land and water should feel like one continuous journey.",
              },
              {
                number: "02",
                title: "Multisensory Interaction System",
                tagline: "The right information, on the right surface.",
                videoSrc: "/media/aeon/principles/principle_2.mp4",
                iconSrc: "/images/aeon/principles/multisensory.svg",
                hoverDescription:
                  "The vehicle should communicate through multiple sensory cues to help users stay aware across changing environments.",
              },
              {
                number: "03",
                title: "Unlocked Freedom",
                tagline:
                  "The UI steps back when it can, shows up when it matters.",
                videoSrc: "/media/aeon/principles/principle_3.mp4",
                iconSrc: "/images/aeon/principles/freedom.svg",
                hoverDescription:
                  "Mobility should no longer be limited by traditional roads, giving users new ways to move and explore.",
              },
            ],
          },
        ],
      },
      {
        id: "target",
        title: "Target",
        eyebrow: "Where could the vehicle make the biggest impact?",
        body: "",
        contentBlocks: [
          {
            kind: "aeonTargetSpread",
            row1: {
              label: "Indonesia",
              headline: "**17,000+** islands",
              supporting:
                "Moving between places is already inconvenient and infrastructure dependent.",
              mapSrc: "/images/aeon/context/indonesia-map.png",
              mapAlt: "Indonesia archipelago map",
            },
            row2: {
              mapSrc: "/images/aeon/context/jakarta-flood-map.png",
              mapAlt: "Jakarta 2050 flood-risk map",
              headline:
                "By **2050**, much of Jakarta may become flood vulnerable.",
              source: "Climate Central · Coastal Risk Screening Tool",
            },
            row3: {
              statement:
                "Jakarta became our target because climate vulnerability and fragmented infrastructure make alternative mobility increasingly essential.",
            },
          },
          {
            kind: "subheading",
            title: "Meet Rafi — Field Engineer, Jakarta 2050.",
          },
          { kind: "personaCollage" },
        ],
      },
      {
        id: "ia",
        title: "Information Architecture",
        eyebrow: "Every surface carries a different layer of attention.",
        body: "",
        contentBlocks: [{ kind: "iaMatrix" }],
      },
      {
        id: "modes",
        title: "Modes",
        eyebrow: "Two terrains. One continuous drive.",
        body: "",
        contentBlocks: [{ kind: "modesShowcase" }],
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
