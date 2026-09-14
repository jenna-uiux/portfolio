import { R2_MEDIA, r2Url } from "./media";

export type ImageRatio = "16/9" | "4/3" | "4/5" | "1/1" | "3/2" | "21/9";

export type ImagePlaceholder = {
  filename: string;
  description: string;
  ratio?: ImageRatio;
  /** Public URL under `/public` (e.g. `/media/fini/thumbnail/demo.mp4`) */
  videoSrc?: string;
  poster?: string;
  /** Public URL under `/public` for a static image cover. */
  src?: string;
};

export type ChartId =
  | "diary-structure"
  | "energy-rhythm"
  | "obligation-capacity"
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
      kind: "privateAccessTeaser";
      email: string;
    }
  | {
      kind: "serviceVision";
      current: { title: string; body: string };
      ambition: { title: string; body: string };
      foundations: { title: string; body: string }[];
      takeaway: string;
    }
  | {
      kind: "callout";
      title?: string;
      body: string;
    }
  | {
      kind: "decisionReasoning";
      title: string;
      items: { title: string; body: string }[];
    }
  | {
      kind: "logicDemo";
      title: string;
      body: string;
    }
  | {
      kind: "chart";
      id: ChartId;
      caption?: string;
      ratio?: ImageRatio;
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
      edgeCrop?: boolean;
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
      kind: "reflectionInsights";
      layout?: "editorial";
      items: {
        number: string;
        title: string;
        body: string;
      }[];
      photo?: {
        src: string;
        alt: string;
        caption: string;
        width: number;
        height: number;
        href?: string;
      };
    }
  | {
      kind: "nextStepHighlight";
      title: string;
      body: string;
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
      /** Secondary line under the h3 (rendered as h4). */
      subtitle?: string;
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
      kind: "processSteps";
      steps: {
        num: string;
        title: string;
        body: string;
        overview?: {
          label: string;
          output: string;
          tools: string[];
        };
        /** Editorial arrangement of the step's artifacts. Defaults to "single". */
        layout?: "stacked" | "asymmetric" | "photoPair" | "single" | "comparisons";
        images?: {
          src: string;
          alt: string;
          caption?: string;
          body?: string;
          /** Intrinsic pixel dimensions, used to preserve the natural aspect ratio. */
          width: number;
          height: number;
          /** Photos may fill their frame; text-heavy artifacts must not be cropped. */
          fit?: "cover" | "contain";
          compact?: boolean;
        }[];
      }[];
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
      kind: "finalProductFeatures";
      features: {
        number: string;
        title: string;
        body: string;
        videoSrc: string;
        videoDescription: string;
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
        evidenceSource?: string;
        footer?: string;
      }[];
    }
  | {
      kind: "affinityInsights";
      insights: {
        number: string;
        title: string;
        body: string;
        tone?: "accent" | "ink";
      }[];
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      objectFit?: "cover" | "contain";
      borderless?: boolean;
      /** When set with height, renders at the image's natural aspect instead of a fixed 16:9 frame. */
      width?: number;
      height?: number;
    }
  | {
      kind: "imageRow";
      images: { src: string; alt: string }[];
    }
  | {
      kind: "hoverImagePair";
      images: { src: string; alt: string }[];
    }
  | {
      kind: "insightDirectionMap";
      insights: string[];
      goal: string;
      principles: string[];
    }
  | {
      kind: "productLogicFlow";
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
      /** Dark inset panel (AEON mission strip). */
      variant?: "default" | "panel";
    }
  | {
      kind: "problemStatement";
      body: string;
    }
  | {
      kind: "numberedTimeline";
      steps: { num: string; name: string; note?: string; tag?: string }[];
    }
  | {
      kind: "responseFormatComparison";
      reasoning: { title: string; body: string }[];
      options: {
        number: string;
        title: string;
        body: string;
        image: { src: string; description: string };
      }[];
      selectedNumber: string;
      caption: string;
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
  | { kind: "aeonHmiInformationMap" }
  | { kind: "aeonHmiArchitectureFigures" }
  | { kind: "aeonDesignDevelopmentFigures" }
  | { kind: "aeonVisualLanguageFigure" }
  | { kind: "aeonMoodSoundBoard" }
  | { kind: "aeonFinalDesignFigures" }
  | { kind: "aeonOutcomeProof" }
  | { kind: "aeonReflectionMoments" }
  | {
      kind: "backgroundPinnedDeck";
      /** Section kicker (e.g. "Background") — when set, render inside pin with the deck. */
      kicker?: string;
      /** Shown above the deck inside the pin region so it stays visible while scrubbing. */
      eyebrow?: string;
      /** Intro copy between eyebrow and slides (stays in pin region). */
      intro?: string;
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
  status?: string;
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
      "AI planner designed to turn personal goals into manageable next steps",
    summary:
      "Designed and built an AI planner that uses Apple Health data to turn personal goals into manageable next steps",
    category: "AI UX / Productivity",
    tags: ["Agentic Coding"],
    role: "Sole Designer + Developer",
    tools: ["Cursor", "SwiftUI", "Supabase", "Figma"],
    focus: ["iPhone + Apple Watch working prototype"],
    year: "2026",
    cover: {
      filename: "fini_thumbnail.mp4",
      description: "Fini hero, phone in hand with planner UI",
      poster: "/images/home/fini-poster.jpg",
      ratio: "16/9",
      videoSrc: r2Url(R2_MEDIA.finiThumbnail),
    },
    teaserCover: {
      filename: "fini_thumbnail.mp4",
      description: "Fini home teaser, phone in hand with planner UI",
      poster: "/images/home/fini-poster.jpg",
      ratio: "21/9",
      videoSrc: r2Url(R2_MEDIA.finiThumbnail),
    },
    featured: true,
    sections: [
      {
        id: "outcome",
        title: "Outcome",
        eyebrow: "",
        body: "",
        contentBlocks: [
          {
            kind: "reflectionInsights",
            layout: "editorial",
            items: [
              {
                number: "01",
                title: "A working prototype, tested on real devices",
                body: "I designed and built Fini across iPhone and Apple Watch, connecting Apple Health data with AI-powered task breakdown and recommendations in a working prototype. Testing it in my daily routine guided refinements to permissions, missing-data states, and cross-device sync.",
              },
            ],
            photo: {
              src: "/images/fini/fini_reflection_2.jpg",
              alt: "Jihyeon presenting Fini on a large display at the Academy of Art University Spring Show",
              caption:
                "Selected for the Academy of Art University 2026 Spring Show!",
              width: 2400,
              height: 1602,
              href: "https://2026springshow.academyart.edu/student/jihyeon-jang/",
            },
          },
        ],
      },
      {
        id: "research",
        title: "Research",
        eyebrow:
          "Personal goals were pushed back until little energy remained",
        body: "Look at the plans you finished this week, then look at the ones you postponed. Personal goals rarely did, even when they mattered more to your long-term growth. Why does this keep happening?",
        contentBlocks: [
          {
            kind: "imageRow",
            images: [
              {
                src: "/images/fini/fini_research_p1.jpg",
                alt: "Participant filling out a diary study sheet during a research session",
              },
              {
                src: "/images/fini/fini_research_p2.jpg",
                alt: "Diary study template used to log tasks, energy, and daily reflections",
              },
            ],
          },
          {
            kind: "subheading",
            title: "Behavioral pattern analysis",
            body: "In a 6-day diary study, I found that users often returned to personal plans only after external obligations had already consumed their time and energy.",
          },
          {
            kind: "chart",
            id: "obligation-capacity",
          },
          {
            kind: "subheading",
            title: "Affinity Mapping",
            body: "I combined a 6-day diary study with semi-structured interviews to understand both what disrupted participants' plans and why. I mapped their diary entries and interview responses through affinity mapping, revealing two recurring patterns.",
          },
          {
            kind: "affinityInsights",
            insights: [
              {
                number: "01",
                title: "Follow-through rose and fell with daily capacity.",
                body: "Participants completed less of what they planned on days with poorer sleep, higher stress, or lower energy.",
                tone: "accent",
              },
              {
                number: "02",
                title: "Starting was the main point of failure.",
                body: "Once participants began a task, they usually kept going. Most unfinished plans broke down before any action, at the moment of deciding where and how to begin.",
                tone: "ink",
              },
            ],
          },
        ],
      },
      {
        id: "solution",
        title: "Solution",
        eyebrow: "Focus on the decision just before action",
        body: "The research pointed to a critical moment before action: users returned to personal plans with changing capacity and still had to decide what was realistic and where to begin. I translated these findings into one design goal and two principles for Fini.",
        contentBlocks: [
          {
            kind: "insightDirectionMap",
            insights: [
              "Follow-through rose and fell with daily capacity",
              "Starting was the main point of failure",
            ],
            goal: "Help users begin with a manageable next step that fits their current capacity.",
            principles: [
              "Recommend a next step based on estimated capacity.",
              "Make the starting point explicit.",
            ],
          },
          {
            kind: "subheading",
            title: "From a goal to a next step the user can review",
            body: "I designed the flow to turn a goal into smaller tasks and use an estimate of capacity to recommend where to begin. The flow includes the recommendation’s reasoning and options to edit or override it.",
          },
          {
            kind: "productLogicFlow",
          },
        ],
      },
      {
        id: "final-product",
        title: "Final Product",
        eyebrow:
          "Fini: an AI planner that turns personal goals into smaller steps and recommends where to start.",
        body: "Fini adapts task recommendations to the user's current capacity. It uses Apple Health data to prioritize tasks, breaks down larger tasks when capacity is low, and turns voice input into a structured plan.",
        contentBlocks: [
          {
            kind: "finalProductFeatures",
            features: [
              {
                number: "01",
                title: "Give users a smaller place to start",
                body: "Research pointed to difficulty getting started. I designed Fini to break larger tasks into smaller steps when estimated capacity is low, giving users a specific starting point.",
                videoSrc: r2Url(R2_MEDIA.finiProactiveAtomization),
                videoDescription:
                  "Fini breaks a large task into manageable next steps",
              },
              {
                number: "02",
                title: "Use health data to inform task priorities",
                body: "Because participants’ energy varied from day to day, I explored Apple Health data as an input to task recommendations. Fini uses sleep, heart rate variability (HRV), and activity signals to estimate capacity and suggest priorities.",
                videoSrc: r2Url(R2_MEDIA.finiThumbnail),
                videoDescription:
                  "Fini recommends and prioritizes tasks based on the user's current capacity",
              },
              {
                number: "03",
                title: "Capture the goal before organizing it",
                body: "Users describe what they want to do in their own words. Fini turns the spoken goal into tasks, subtasks, and a suggested priority.",
                videoSrc: r2Url(R2_MEDIA.finiVoiceTaskEntry),
                videoDescription:
                  "Fini converts a spoken goal into structured tasks and subtasks",
              },
            ],
          },
        ],
      },
      {
        id: "build-iterate",
        title: "Process",
        eyebrow: "Build the experience to test it on real devices",
        body: "I built a working iOS and watchOS prototype to test live AI responses, HealthKit data, and cross-device behavior. Using Cursor helped me get the core workflow running early so I could evaluate how these parts worked together.",
        contentBlocks: [
          {
            kind: "processSteps",
            steps: [
              {
                num: "01",
                title: "Define how the system works together",
                body: "I created the PRD and Systems Architecture first to map the data flow, device responsibilities, permissions, and fallback states before coding. Because Fini works across iOS, watchOS, HealthKit, AI, and a backend, designing each screen separately would not show where the experience could break.",
                overview: {
                  label: "Define",
                  output: "PRD + Systems Architecture",
                  tools: ["ChatGPT", "Cursor Plan Mode"],
                },
                layout: "stacked",
                images: [
                  {
                    src: "/images/fini/process/process_01_1.png",
                    alt: "Systems Architecture diagram connecting the iOS SwiftUI app, watchOS companion, HealthKit, Supabase Edge Functions, and the Anthropic API",
                    caption:
                      "Systems Architecture across iOS, watchOS, HealthKit, Supabase, and Anthropic.",
                    width: 2836,
                    height: 1218,
                  },
                  {
                    src: "/images/fini/process/process_01_2.png",
                    alt: "Fini product requirements document showing overview, problem, core insight, and target user sections",
                    caption:
                      "The PRD defined the problem, the core insight, and the target user before any screens existed.",
                    width: 1374,
                    height: 780,
                  },
                ],
              },
              {
                num: "02",
                title: "Build and review the core workflow",
                body: "I used the PRD and Systems Architecture as project context for the first working build. I reviewed the generated code and refined each feature against the product logic.",
                overview: {
                  label: "Build",
                  output: "Working iOS + watchOS prototype",
                  tools: ["Cursor", "SwiftUI", "Supabase", "Anthropic API"],
                },
                layout: "asymmetric",
                images: [
                  {
                    src: "/images/fini/process/process_02_1.png",
                    alt: "Cursor workspace showing an implementation plan, audit findings, and a review conversation about Fini's energy prediction logic",
                    caption:
                      "Each pass was reviewed against the product logic before it stayed in the build.",
                    body: "Anthropic’s API structured and prioritized tasks. I routed the API calls through a Supabase Edge Function, keeping the API key out of the client app. Supabase also stored the app data used for capacity estimation.",
                    width: 2784,
                    height: 1824,
                  },
                  {
                    src: "/images/fini/process/process_02_2.png",
                    alt: "Supabase dashboard listing the deployed AI edge functions used by Fini",
                    caption:
                      "Supabase Edge Functions handled the AI calls for task structuring and prioritization.",
                    width: 2342,
                    height: 1014,
                  },
                ],
              },
              {
                num: "03",
                title: "Test in daily use",
                body: "I used Fini in my daily routine and recorded issues in a QA log. I checked permissions, missing data, loading time, and iPhone–Watch behavior, then fixed the issues in short iterations.",
                overview: {
                  label: "Test",
                  output: "On-device QA findings",
                  tools: ["Xcode", "HealthKit", "iPhone", "Apple Watch"],
                },
                layout: "photoPair",
                images: [
                  {
                    src: "/images/fini/process/process_03_2.png",
                    alt: "Apple Watch on a wrist at night showing a Fini notification about tasks adjusted for tomorrow",
                    caption:
                      "Testing in daily use surfaced timing, permission, and sync issues.",
                    width: 1347,
                    height: 1165,
                    fit: "cover",
                  },
                  {
                    src: "/images/fini/process/process_03_1.jpg",
                    alt: "Four iPhone screens from the working build: today view, task list, week view, and AI dashboard",
                    caption:
                      "Working iOS screens used to verify live recommendations and cross-device states.",
                    width: 2138,
                    height: 1165,
                    fit: "cover",
                  },
                ],
              },
              {
                num: "04",
                title: "Refine hierarchy and interaction states",
                body: "Once the core workflow was working, I refined the information hierarchy, interaction states, and visual consistency in Figma, then applied those changes to the iOS and watchOS build.",
                overview: {
                  label: "Refine",
                  output: "Refined cross-device experience",
                  tools: ["Figma", "Cursor", "SwiftUI"],
                },
                layout: "comparisons",
                images: [
                  {
                    src: "/images/fini/process/task-entry-before-after.jpg",
                    alt: "Before and after task entry: an inline add control beside search becomes a prominent orange action in the bottom navigation",
                    caption:
                      "Task entry: from an inline control beside search to a prominent action in the bottom navigation.",
                    width: 3840,
                    height: 2160,
                    fit: "contain",
                  },
                  {
                    src: "/images/fini/process/visual-trust-before-after.jpg",
                    alt: "Before and after recommendation context: the refined design shows health signals alongside the recommended next step",
                    caption:
                      "Recommendation context: health signals are shown alongside the next step.",
                    width: 3840,
                    height: 2160,
                    fit: "contain",
                  },
                  {
                    src: "/images/fini/process/process_04_1.png",
                    compact: true,
                    alt: "Figma design system page with Fini's typography scale, color ramps, buttons, spacing, radius, and shadow tokens",
                    caption:
                      "A shared design system kept type, color, and spacing consistent across iOS and watchOS.",
                    width: 3024,
                    height: 1898,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "reflection",
        title: "Reflection",
        eyebrow: "",
        body: "",
        contentBlocks: [
          {
            kind: "reflectionInsights",
            layout: "editorial",
            items: [
              {
                number: "01",
                title: "Designing the connections between screens",
                body: "Testing Fini in daily use surfaced issues with timing, permissions, and sync. Those issues showed me how much the experience depended on the connections between devices and data sources.",
              },
            ],
          },
          {
            kind: "nextStepHighlight",
            title: "Launch on the App Store",
            body: "I’m preparing Fini for an App Store launch. After launch, I plan to gather feedback on how its recommendations fit into people’s daily routines.",
          },
        ],
      },
    ],
  },
  {
    slug: "strawberry-matcha",
    title: "Strawberry Matcha",
    tagline:
      "An AI assistant for people preparing a marriage-based green card application without a lawyer.",
    summary:
      "Designed, built, and shipped an AI assistant that helps people prepare a marriage-based green card application without a lawyer",
    category: "AI UX / Legal workflow",
    tags: ["Agentic Coding"],
    role: "AI Product Designer + Builder",
    tools: ["Cursor", "Claude API", "Supabase", "Figma"],
    focus: ["Conversational AI", "Decision-support UX"],
    status: "Shipped · Private access",
    year: "2026",
    cover: {
      filename: "strawberryMatcha_thumbnail.mp4",
      description: "Strawberry Matcha hero demo",
      poster: "/images/home/strawberry-matcha-poster.jpg",
      ratio: "16/9",
      videoSrc: r2Url(R2_MEDIA.strawberryMatchaThumbnail),
    },
    teaserCover: {
      filename: "strawberryMatcha_thumbnail.mp4",
      description: "Strawberry Matcha home teaser",
      poster: "/images/home/strawberry-matcha-poster.jpg",
      ratio: "21/9",
      videoSrc: r2Url(R2_MEDIA.strawberryMatchaThumbnail),
    },
    featured: true,
    sections: [
      {
        id: "outcome",
        title: "Outcome",
        eyebrow: "Designed, built, and shipped",
        body: "Strawberry Matcha is an AI assistant for people preparing a marriage-based green card application without a lawyer. It connects case intake, personalized guidance, form preparation, and next steps. I took it from research and design through development and deployment.",
        contentBlocks: [
          {
            kind: "privateAccessTeaser",
            email: "jihyeonjang102@gmail.com",
          },
        ],
      },
      {
        id: "problem",
        title: "Problem",
        eyebrow: "Filing alone leads to mistakes. General AI makes it worse",
        body: "Many couples applying for a marriage-based green card file without a lawyer. Legal fees run thousands of dollars, and the process looks doable, so they handle it themselves. Then the details catch up. 1 in 4 applicants gets a Request for Evidence for avoidable errors, and each one adds three to five months. General AI doesn't fill the gap. It hallucinates on legal details and answers for a generic case, not theirs.",
        contentBlocks: [
          {
            kind: "image",
            src: "/images/strawberryMatcha/designDecision/conversationalAIUI/problem_articles.jpg",
            alt: "Research articles about immigration lawyer costs, USCIS Requests for Evidence, and legal AI hallucinations.",
            objectFit: "contain",
            borderless: true,
          },
        ],
      },
      {
        id: "features",
        title: "Solutions",
        body: "",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            title:
              "Ask Strawberry Matcha, a conversation that knows your case",
            body: "Users can ask anything, anytime. Strawberry Matcha answers based on the applicant's actual case status and preparation progress, and updates the case as the conversation continues.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "demo_01.mp4",
            description: "Ask Strawberry Matcha demo",
            mediaType: "video",
            edgeCrop: true,
            ratio: "16/9",
            src: r2Url(R2_MEDIA.strawberryMatchaDemo01),
          },
          {
            kind: "subheading",
            title:
              "Field Translator, fills the gap between your real life and the form",
            body: "When users upload any edition of a USCIS form PDF, Strawberry Matcha reads the actual form fields, cross-references them with the user's case data, and tells them exactly what to enter in each field. It also handles tricky format conversions, such as restructuring a Korean address to fit U.S. form fields or matching a Korean name to its passport romanization.",
          },
          { kind: "fieldTranslator" },
          {
            kind: "mediaPlaceholder",
            filename: "demo_02.mp4",
            description: "Field Translator walkthrough",
            mediaType: "video",
            edgeCrop: true,
            ratio: "16/9",
            src: r2Url(R2_MEDIA.strawberryMatchaDemo02),
          },
          {
            kind: "subheading",
            title:
              "Timeline guidance, so you know where you are and what's next",
            body: "Each milestone shows where the applicant is in the process, what the step actually means, and what usually happens next, so the case never feels like a black box.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "demo_03.mp4",
            description: "Timeline screen",
            mediaType: "video",
            edgeCrop: true,
            ratio: "16/9",
            src: r2Url(R2_MEDIA.strawberryMatchaDemo03),
          },
        ],
      },
      {
        id: "process",
        title: "How I Built",
        eyebrow: "From concept to crafted product in five steps",
        body: "",
        contentBlocks: [
          {
            kind: "numberedTimeline",
            steps: [
              {
                num: "01",
                name: "Define concept\n& Research to train the AI",
                tag: "Domain research",
                note: "Mapped how immigration lawyers actually walk a couple through CR1 / F2A.",
              },
              {
                num: "02",
                name: "Design System Architecture",
                tag: "Cursor plan mode",
                note: "Used Cursor's plan mode to map out the full system as a diagram, so I could see how every piece fit before writing code.",
              },
              {
                num: "03",
                name: "Fast validation",
                tag: "Cursor prototype",
                note: "Used Cursor to spin up a working prototype quickly, so I could test the idea with real applicants before investing more.",
              },
              {
                num: "04",
                name: "Iterations",
                tag: "Real applicants",
                note: "Reworked chat structure and onboarding based on where trust was breaking.",
              },
              {
                num: "05",
                name: "Craft refinement",
                tag: "Figma polish",
                note: "Polished the UI in Figma, tightening tone, pacing, and visual hierarchy across the whole product.",
              },
            ],
          },
        ],
      },
      {
        id: "iterations",
        title: "Iterations",
        body: "",
        contentBlocks: [
          {
            kind: "subheading",
            title: "Restructuring answers around a next step",
            compact: true,
          },
          {
            kind: "responseFormatComparison",
            reasoning: [
              {
                title: "What testing revealed",
                body: "In testing, users skimmed long answers, asked me to repeat information already on screen, and abandoned tasks.",
              },
              {
                title: "Why I changed the format",
                body: "I explored three response formats. I chose an acknowledgment, structured information, a focused case question, and suggested follow-ups to keep the exchange conversational while giving users a clearer way to continue.",
              },
            ],
            options: [
              {
                number: "1",
                title: "Single paragraph",
                body: "Simple to implement, but key information was buried.",
                image: {
                  description:
                    "Single response paragraph: a long block of text that buries the answer.",
                  src: "/images/strawberryMatcha/designDecision/conversationalAIUI/01.png",
                },
              },
              {
                number: "2",
                title: "Document-style response",
                body: "Clear sections, but too heavy for short exchanges.",
                image: {
                  description:
                    "Doc-style response with bold headers and bullet lists.",
                  src: "/images/strawberryMatcha/designDecision/conversationalAIUI/02.png",
                },
              },
              {
                number: "3",
                title: "Structured answer with follow-ups",
                body: "My choice for balancing readability and conversational tone. Required more design and prompt work.",
                image: {
                  description:
                    "Two-layer response: serif acknowledgment, sans-serif body, suggested follow-up chips.",
                  src: "/images/strawberryMatcha/designDecision/conversationalAIUI/03.png",
                },
              },
            ],
            selectedNumber: "3",
            caption: "Three design explorations. Version 3 was selected for the prototype.",
          },
          {
            kind: "decisionReasoning",
            title: "Collecting case context before the first conversation",
            items: [
              {
                title: "What I learned",
                body: "The original onboarding left gaps in the applicant’s case information, and the AI filled them with assumptions. I studied how immigration lawyers intake clients and rebuilt onboarding around those questions.",
              },
              {
                title: "What I changed",
                body: "The revised flow collects case details upfront and ends with a summary users can review. I made this change to reduce assumptions at the start of the conversation.",
              },
            ],
          },
          {
            kind: "imageCarousel",
            ratio: "16/9",
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
        eyebrow: "This project made me rethink what makes a good product in the AI era",
        body: "My biggest takeaway was that being able to build a product is only part of deciding whether it is worth building. I now think more carefully about the work customers need done, what it costs to deliver, and why they would trust a business to do it.",
        contentBlocks: [
          {
            kind: "serviceVision",
            current: {
              title: "Help getting an application ready.",
              body: "I connected intake, guidance, and form preparation to address more of the work applicants seek from an immigration attorney.",
            },
            ambition: {
              title: "A service applicants could hire.",
              body: "[YC’s focus](https://podcasts.apple.com/us/podcast/how-to-pick-a-startup-idea/id1236907421?i=1000773139706) on selling outcomes shaped my ambition to provide the service itself. If AI lowers delivery costs, that help could become affordable to more applicants.",
            },
            foundations: [
              {
                title: "Demand and trust",
                body: "What would applicants pay to hand over, and trust us to do?",
              },
              {
                title: "Quality and cost",
                body: "How much human review is needed, and can the price cover it?",
              },
              {
                title: "Scope and permissions",
                body: "What can the service commit to delivering, and what qualifications and permissions would that require?",
              },
            ],
            takeaway: "I shipped the product. Now I need to test whether it can support a business.",
          },
        ],
      },
    ],
  },
  {
    slug: "aeon",
    title: "AEON",
    tagline:
      "Designed an HMI for a 2050 concept vehicle\nthat moves between road and water.",
    summary:
      "Led product direction and designed an adaptive vehicle interface for a 2050 amphibious mobility concept sponsored by Autodesk",
    category: "Mobility / HMI Design",
    tags: ["HMI", "Mobility"],
    role: "Team Lead · Product Designer",
    team: "2 Industrial Designers, 1 Brand Strategist, 1 Interior Architect Designer, me",
    tools: ["Figma", "After Effects"],
    focus: ["Multimodal HMI", "Adaptive in-vehicle UI"],
    year: "2025",
    theme: "dark",
    cover: {
      filename: "final_4_1.jpg",
      description:
        "AEON on water with gull-wing door open and seat extended — case study hero",
      ratio: "16/9",
      src: "/images/aeon/final/final_4_1.jpg",
    },
    teaserCover: {
      filename: "aeon_thumbnail.jpg",
      description: "AEON concept car on water — home teaser",
      ratio: "21/9",
      src: "/images/aeon/hero/aeon_thumbnail.jpg",
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
        body: "AEON is a three-month concept project **sponsored by Autodesk**. The brief was **to design a future vehicle for 2050 and take it from concept to proof of concept.** Our multidisciplinary team of five explored how future climate conditions could reshape mobility and developed AEON, an amphibious EV designed for road and water.",
        contentBlocks: [
          {
            kind: "annotatedCallout",
            label: "Autodesk Mission",
            body: "\u201CTo empower everyone, everywhere to design and make anything.\u201D",
            tone: "neutral",
            variant: "panel",
          },
          {
            kind: "prose",
            body: "As team lead and sole product designer, I guided the overall project direction and designed the vehicle\u2019s HMI, from information architecture to the final road and water modes.",
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
        id: "problem",
        title: "Problem",
        eyebrow: "Rising sea levels could make existing roads unreliable",
        body: "With Autodesk's mission as a starting point, we researched the challenges that could affect how people move in 2050. Rising sea levels became our focus because flooding could make existing roads increasingly unreliable.",
        contentBlocks: [
          {
            kind: "hoverImagePair",
            images: [
              {
                src: "/images/aeon/context/Problem_1_2.jpg",
                alt: "Global sea level rise and infrastructure degradation by 2050",
              },
              {
                src: "/images/aeon/context/Problem_2.jpg",
                alt: "Flooding and traffic delays on urban roads",
              },
            ],
          },
          {
            kind: "subheading",
            title: "Turning water from barrier → path",
            body: "We saw water as an alternative route when roads were disrupted. This became the basis for AEON, an amphibious vehicle designed to transition between road and water.",
          },
          {
            kind: "designPrinciples",
            principles: [
              {
                number: "01",
                title: "Seamless Transition",
                tagline: "One continuous experience, two terrains.",
                videoSrc: r2Url(R2_MEDIA.aeonPrinciple1),
                iconSrc: "/images/aeon/principles/seamless.svg",
                hoverDescription: "Move seamlessly between\nland and water.",
              },
              {
                number: "02",
                title: "Multisensory Interaction System",
                tagline: "The right information, on the right surface.",
                videoSrc: r2Url(R2_MEDIA.aeonPrinciple2),
                iconSrc: "/images/aeon/principles/multisensory.svg",
                hoverDescription: "Stay aware through multisensory cues.",
              },
              {
                number: "03",
                title: "Unlocked Freedom",
                tagline:
                  "The UI steps back when it can, shows up when it matters.",
                videoSrc: r2Url(R2_MEDIA.aeonPrinciple3),
                iconSrc: "/images/aeon/principles/freedom.svg",
                hoverDescription: "Move beyond traditional roads.",
              },
            ],
          },
        ],
      },
      {
        id: "ia",
        title: "HMI Design Process",
        body: "",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            title: "Display & Information Architecture",
            body: "During early HMI reviews, I learned about established automotive HMI practices from our design mentor. I used two factors to guide placement: the information\u2019s function and how quickly the driver needed to access it.",
          },
          { kind: "aeonHmiInformationMap" },
          {
            kind: "prose",
            body: "I defined the role of the HUD, cluster, infotainment, and auxiliary displays, then set the priority of the information shown on each one.",
          },
          { kind: "aeonHmiArchitectureFigures" },
          {
            kind: "subheading",
            title: "Visual Language",
            body: "I created a shared visual system for AEON\u2019s road and water modes. The layout and type hierarchy remain consistent, while form, color, and motion adapt to each environment.",
          },
          { kind: "aeonVisualLanguageFigure" },
          {
            kind: "prose",
            body: "Alongside the moodboard, I created an AI-generated track with Suno and shared it with the team. It helped us align on AEON\u2019s pace, atmosphere, and emotional tone while developing the visual language.",
          },
          { kind: "aeonMoodSoundBoard" },
          {
            kind: "subheading",
            compact: true,
            title: "Design Development",
            body: "I applied the display architecture and visual language to develop three HMI modes, adapting the information and controls for parking, road, and water.",
          },
          { kind: "aeonDesignDevelopmentFigures" },
        ],
      },
      {
        id: "final",
        title: "Final Design",
        body: "",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            title: "Keeping the Interface Familiar Across Modes",
            body: "Because drivers may transition between road and water during the same trip, I kept essential information in consistent locations so they would not need to relearn the interface. Road mode prioritizes traffic and route decisions, while water mode prioritizes heading, stability, and visual motion cues to help reduce motion sickness.",
          },
          { kind: "aeonFinalDesignFigures" },
        ],
      },
      {
        id: "outcome",
        title: "Outcome",
        body: "",
        contentBlocks: [
          {
            kind: "subheading",
            first: true,
            title: "Making a 2050 Concept Vehicle Believable",
            body: "Designing a concept vehicle for 2050 meant balancing imagination with credibility. To evaluate whether we achieved that balance, we conducted an adapted UEQ-S evaluation. This provides measurable support for the final proof of concept we presented to Autodesk\u2019s EMEA Automotive Team.",
          },
          { kind: "aeonOutcomeProof" },
        ],
      },
      {
        id: "reflection",
        title: "Reflection",
        body: "",
        contentBlocks: [
          {
            kind: "reflectionInsights",
            items: [
              {
                number: "01",
                title: "Designing Safety into the Experience",
                body: "Working on AEON\u2019s HMI challenged me to rethink how drivers process critical information under pressure. I learned that safety in HMI starts with restraint: limiting on-screen density, elevating key alerts, and maintaining consistent control logic across driving modes so every interaction feels effortless and safe.",
              },
              {
                number: "02",
                title: "Building Alignment Through Evidence",
                body: "When our team had different ideas about the target market, I returned to research to build consensus. Using data as an objective anchor helped move the conversation beyond personal preferences and toward a clear, shared strategy. This kept every discipline aligned through execution.",
              },
            ],
          },
          { kind: "aeonReflectionMoments" },
        ],
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
