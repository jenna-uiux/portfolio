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
        layout?: "stacked" | "asymmetric" | "photoPair" | "single";
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
    }
  | {
      kind: "imageRow";
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
      "An AI planner that makes personal goals\neasier to start and easier to achieve.",
    summary:
      "Designed and developed an AI productivity mobile app that adapts to users' energy levels using Apple Health data",
    category: "AI UX / Productivity",
    tags: ["Agentic Coding"],
    role: "Sole Designer + Developer",
    tools: [
      "Cursor",
      "SwiftUI",
      "Supabase",
      "Figma",
    ],
    focus: [
      "Agentic Coding",
      "Bio-adaptive UX",
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
        id: "research",
        title: "Research",
        eyebrow:
          "Personal goals kept losing to work, school, and deadlines.",
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
        eyebrow: "Design direction",
        body: "The research pointed to a critical moment before action: users returned to personal plans with changing capacity and still had to decide what was realistic and where to begin. I translated these findings into one design goal and two principles for Fini.",
        contentBlocks: [
          {
            kind: "insightDirectionMap",
            insights: [
              "Follow-through rose and fell with daily capacity",
              "Starting was the main point of failure",
            ],
            goal:
              "Help users begin with a manageable next step that fits their current capacity.",
            principles: [
              "Adapt the plan to the user's current capacity.",
              "Make the next step clear and immediately actionable.",
            ],
          },
          {
            kind: "subheading",
            title: "Product logic flow",
            body: "Based on the design principles, I mapped Fini's product logic, including the inputs it uses, how it processes them, and where users can review or override the result.",
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
          "Fini: making personal goals easier to start and easier to achieve.",
        body: "Fini adapts task recommendations to the user's current capacity. It uses Apple Health data to prioritize tasks, breaks down larger tasks when capacity is low, and turns voice input into a structured plan.",
        contentBlocks: [
          {
            kind: "finalProductFeatures",
            features: [
              {
                number: "01",
                title: "Capacity-aware recommendations",
                body: "Fini estimates the user's current capacity using sleep, HRV, and activity data from Apple Health. Tasks are prioritized based on that estimate.",
                videoSrc:
                  "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/fini_thumbnail.mp4",
                videoDescription:
                  "Fini recommends and prioritizes tasks based on the user's current capacity",
              },
              {
                number: "02",
                title: "Adaptive task breakdown",
                body: "When capacity is low, Fini breaks large tasks into smaller steps and shows where to start.",
                videoSrc: "https://youtu.be/gVS543_K-bs",
                videoDescription:
                  "Fini breaks a large task into manageable next steps",
              },
              {
                number: "03",
                title: "Voice-based task capture",
                body: "Users can describe a goal by voice. Fini converts it into tasks, subtasks, and a default priority.",
                videoSrc: "https://youtu.be/polxGcvmrB4",
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
        eyebrow: "How I built Fini with an agentic coding workflow",
        body: "I built and tested the iOS and watchOS apps with Cursor. An agentic coding workflow helped me get the core system working early, so I could test live AI responses, HealthKit data, and cross-device behavior on real devices.",
        contentBlocks: [
          {
            kind: "processSteps",
            steps: [
              {
                num: "01",
                title: "Define the Product and System",
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
                title: "Build a Working Prototype",
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
                title: "Test On-Device",
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
                title: "Refine the Experience",
                body: "Once the core workflow was stable, I used Figma to refine the information hierarchy, interaction states, and visual consistency across iOS and watchOS. I then applied those changes to the working build.",
                overview: {
                  label: "Refine",
                  output: "Refined cross-device experience",
                  tools: ["Figma", "Cursor", "SwiftUI"],
                },
                layout: "single",
                images: [
                  {
                    src: "/images/fini/process/process_04_1.png",
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
            items: [
              {
                number: "01",
                title: "0→1 Product Development",
                body: "I took Fini from research and product definition to a working iOS and watchOS product, gaining experience across design, architecture, and implementation.",
              },
              {
                number: "02",
                title: "Multimodal Systems Thinking",
                body: "Working across voice input, health data, iOS, and watchOS taught me that friction often appears between touchpoints. Looking at the full system helped me make better product decisions.",
              },
            ],
            photo: {
              src: "/images/fini/fini_reflection_2.jpg",
              alt: "Jihyeon presenting Fini on a large display at the Academy of Art University Spring Show",
              caption:
                "Selected for the Academy of Art University 2026 Spring Show!",
              width: 4324,
              height: 2886,
              href: "https://2026springshow.academyart.edu/student/jihyeon-jang/",
            },
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
        id: "problem",
        title: "Problem",
        eyebrow: "Filing alone leads to mistakes. General AI makes it worse.",
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
              "Ask Strawberry Matcha, a conversation that knows your case.",
            body: "Users can ask anything, anytime. Strawberry Matcha answers based on the applicant's actual case status and preparation progress, and updates the case as the conversation continues.",
          },
          {
            kind: "mediaPlaceholder",
            filename: "demo_01.mp4",
            description: "Ask Strawberry Matcha demo",
            mediaType: "video",
            ratio: "16/9",
            src: "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/strawberryMatcha_demo_01.mp4",
          },
          {
            kind: "subheading",
            title:
              "Field Translator, fills the gap between your real life and the form.",
            body: "When users upload any edition of a USCIS form PDF, Strawberry Matcha reads the actual form fields, cross-references them with the user's case data, and tells them exactly what to enter in each field. It also handles tricky format conversions, such as restructuring a Korean address to fit U.S. form fields or matching a Korean name to its passport romanization.",
          },
          { kind: "fieldTranslator" },
          {
            kind: "mediaPlaceholder",
            filename: "demo_02.mp4",
            description: "Field Translator walkthrough",
            mediaType: "video",
            ratio: "16/9",
            src: "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/strawberryMatcha_demo_02.mp4",
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
            src: "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev/strawberryMatcha_demo_03.mp4",
          },
        ],
      },
      {
        id: "process",
        title: "How I Built",
        eyebrow: "From concept to crafted product in five steps.",
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
            title: "Reducing cognitive overload in chat.",
            compact: true,
          },
          {
            kind: "prose",
            body: "The first version dumped each response into one long paragraph. In user testing, the answers were accurate but people didn't act on them. They skimmed, asked me to repeat things the AI had already said, and gave up mid-task. I explored three response formats before settling on one.",
          },
          {
            kind: "explorationCards",
            options: [
              {
                number: "1",
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
                number: "2",
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
                number: "3",
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
            finalPickLabel: "Final pick: Version 3",
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
            title: "Redesigning onboarding to stop hallucinations.",
            compact: true,
          },
          {
            kind: "prose",
            body: "The original onboarding was too short. The AI guessed to fill gaps, and hallucinations broke trust fast. So I studied how immigration lawyers intake clients. Their upfront questions are how a lawyer learns the case before giving advice. I rebuilt onboarding around those same questions, so the AI starts with enough context to be accurate from the first message.",
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
