import Image from "next/image";
import type {
  CaseBlock,
  CaseContentBlock,
  ImageRatio,
  MediaItem,
} from "@/lib/projects";
import { AgenticConsole } from "./AgenticConsole";
import { EdgeCaseExplorer } from "./EdgeCaseExplorer";
import { FieldTranslatorDemo } from "./FieldTranslatorDemo";
import { PivotComparison } from "./PivotComparison";
import { ChallengeStoryBeats } from "./ChallengeStoryBeats";
import { Chart } from "./FiniCharts";
import { EnergyAdaptiveDemo } from "./EnergyAdaptiveDemo";
import { EnergyLogicDemo } from "./EnergyLogicDemo";
import { FiniKeyHighlight } from "./FiniKeyHighlight";
import { InsightFlipCards } from "./InsightFlipCards";
import { ImageSlot } from "./ImageSlot";
import { MediaImage } from "./MediaImage";
import { MediaVideo } from "./MediaVideo";
import { TimelineStepper } from "./TimelineStepper";
import { PillarGrid } from "./PillarGrid";
import { AnnotatedCallout } from "./AnnotatedCallout";
import { ProblemStatementCallout } from "./ProblemStatementCallout";
import { NumberedTimeline } from "./NumberedTimeline";
import { ExplorationCards } from "./ExplorationCards";
import { ImageCarousel } from "./ImageCarousel";
import { ResearchMeta } from "./ResearchMeta";
import { EvidenceInsights } from "./EvidenceInsights";
import { ContrastGrid } from "./ContrastGrid";
import { RoadWaterToggle } from "./RoadWaterToggle";
import { IAPriorityMatrix } from "./IAPriorityMatrix";
import { TeamIntro } from "./TeamIntro";
import { JakartaContext } from "./JakartaContext";
import { DesignPrinciples } from "./DesignPrinciples";
import { MediaStatement } from "./MediaStatement";
import { PersonaCollage } from "./PersonaCollage";
import { ModesShowcase } from "./ModesShowcase";
import { BackgroundPinnedDeck } from "./BackgroundPinnedDeck";
import { AeonTargetSpread } from "./AeonTargetSpread";

type RichTextProps = {
  text: string;
};

const RICH_TEXT_TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|\[[^\]]+\]\([^)]+\))/g;

export function RichText({ text }: RichTextProps) {
  const parts = text.split(RICH_TEXT_TOKEN).filter((p) => p.length > 0);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-medium text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("==") && part.endsWith("==")) {
          return (
            <mark
              key={i}
              className="bg-transparent font-medium text-ink"
              style={{
                backgroundImage:
                  "linear-gradient(transparent 60%, var(--accent-soft) 60%)",
                padding: "0 2px",
              }}
            >
              {part.slice(2, -2)}
            </mark>
          );
        }
        const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/30 underline-offset-[0.2em] transition-colors hover:decoration-ink/70"
            >
              {linkMatch[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const KICKER = "t-eyebrow-mut";
const KICKER_ACCENT = "t-eyebrow";

const AGENTIC_METRICS = [
  {
    label: "UI latency",
    value: "840ms → 95ms",
    note: "Async HealthKit fetch + cached inference reduced the visible wait.",
  },
  {
    label: "Cache policy",
    value: "1 hour TTL",
    note: "Avoids repeated HealthKit reads during navigation and refresh.",
  },
  {
    label: "Model signal",
    value: "Resting HR",
    note: "Prioritizes biological baseline over workout-influenced averages.",
  },
];

function AgenticMetricPanel() {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      {AGENTIC_METRICS.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-4"
        >
          <p className="t-eyebrow-mut">{metric.label}</p>
          <p className="mt-2 t-h4">{metric.value}</p>
          <p className="mt-2 t-caption">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}

export function ContentBlockRenderer({ block }: { block: CaseContentBlock }) {
  if (block.kind === "logicDemo") {
    return (
      <div className="border-t hairline pt-10">
        <h3 className="t-h3">{block.title}</h3>
        <p className="mt-4 t-body">
          <RichText text={block.body} />
        </p>
        <div className="mt-8">
          <EnergyLogicDemo />
        </div>
      </div>
    );
  }

  if (block.kind === "callout") {
    return (
      <figure className="border-t hairline pt-8">
        {block.title ? (
          <p className={KICKER_ACCENT}>{block.title}</p>
        ) : null}
        <blockquote
          className={[
            "max-w-[34ch] font-light leading-[1.1] tracking-[-0.04em] text-ink",
            "text-[clamp(1.6rem,3.2vw,2.6rem)]",
            block.title ? "mt-4" : "",
          ].join(" ")}
        >
          <RichText text={block.body} />
        </blockquote>
      </figure>
    );
  }

  if (block.kind === "comparison") {
    const hasContrastShape = block.items.some(
      (item) => item.examples?.length || item.verdict
    );

    if (hasContrastShape) {
      return <ContrastGrid items={block.items} />;
    }

    return (
      <div className="grid gap-x-12 gap-y-10 border-t hairline pt-8 md:grid-cols-2">
        {block.items.map((item, i) => (
          <div
            key={i}
            className={
              i === 1
                ? "md:border-l hairline md:pl-12"
                : ""
            }
          >
            <p className={KICKER}>{item.label}</p>
            <h3 className="mt-4 max-w-[18ch] t-h3">
              <RichText text={item.title} />
            </h3>
            {item.body ? (
              <p className="mt-4 max-w-[36ch] t-body-sm">
                <RichText text={item.body} />
              </p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "insightCards") {
    return (
      <div className="grid grid-cols-1 gap-x-[8px] gap-y-10 border-t hairline pt-8 md:grid-cols-3">
        {block.cards.map((card, i) => (
          <article
            key={i}
            className="flex h-full flex-col rounded-lg border border-ink/10 bg-white/30 p-6"
          >
            <p className={KICKER_ACCENT}>
              Insight {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 t-h4">
              <RichText text={card.title} />
            </h3>
            <p className="mt-3 t-body-sm">
              <RichText text={card.body} />
            </p>
            {card.evidence ? (
              <p className="mt-4 t-mono">{card.evidence}</p>
            ) : null}
          </article>
        ))}
      </div>
    );
  }

  if (block.kind === "miniTable") {
    return (
      <div className="border-t hairline pt-2">
        <div
          className="grid border-b hairline py-3"
          style={{ gridTemplateColumns: `repeat(${block.columns.length}, 1fr)` }}
        >
          {block.columns.map((column) => (
            <div key={column} className={KICKER}>
              {column}
            </div>
          ))}
        </div>
        {block.rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid border-b hairline py-4 last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${block.columns.length}, 1fr)` }}
          >
            {row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className="pr-6 t-body-sm"
              >
                <RichText text={cell} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "mediaPlaceholder") {
    return (
      <MediaPlaceholder
        filename={block.filename}
        description={block.description}
        ratio={block.ratio ?? "16/9"}
        mediaType={block.mediaType ?? "image"}
        src={block.src}
        sourceCaption={block.sourceCaption}
        captionLabel={block.captionLabel}
      />
    );
  }

  if (block.kind === "storyBeats") {
    return <ChallengeStoryBeats beats={block.beats} />;
  }

  if (block.kind === "interactiveDemo") {
    if (block.variant === "energySlider") {
      return (
        <figure className="border-t hairline pt-8">
          <EnergyAdaptiveDemo />
          {block.caption ? (
            <figcaption className="mt-4 max-w-[60ch] t-caption">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    return null;
  }

  if (block.kind === "subheading") {
    const topMargin = block.first
      ? 0
      : block.compact
        ? undefined
        : "var(--rhythm-xl)";
    return (
      <div
        style={topMargin !== undefined ? { marginTop: topMargin } : undefined}
        className={block.compact ? "subheading-decision" : undefined}
      >
        {block.kicker ? (
          <div>
            <span className="t-eyebrow inline-flex rounded-full border border-[color:var(--accent-orange)] px-2.5 py-0.5">
              {block.kicker}
            </span>
            <h3 className="mt-3 t-h3">{block.title}</h3>
          </div>
        ) : (
          <h3 className="t-h3">{block.title}</h3>
        )}
        {block.body ? (
          <p className="mt-3 t-body">
            <RichText text={block.body} />
          </p>
        ) : null}
      </div>
    );
  }

  if (block.kind === "timelineStepper") {
    return <TimelineStepper steps={block.steps} />;
  }

  if (block.kind === "flipCards") {
    return <InsightFlipCards cards={block.cards} />;
  }

  if (block.kind === "edgeCaseExplorer") {
    return <EdgeCaseExplorer />;
  }

  if (block.kind === "fieldTranslator") {
    return <FieldTranslatorDemo />;
  }

  if (block.kind === "pivotComparison") {
    return <PivotComparison items={block.items} />;
  }

  if (block.kind === "pillarGrid") {
    return <PillarGrid pillars={block.pillars} />;
  }

  if (block.kind === "researchMeta") {
    return <ResearchMeta items={block.items} />;
  }

  if (block.kind === "evidenceInsights") {
    return <EvidenceInsights insights={block.insights} />;
  }

  if (block.kind === "annotatedCallout") {
    return (
      <AnnotatedCallout
        label={block.label}
        body={block.body}
        tone={block.tone}
      />
    );
  }

  if (block.kind === "problemStatement") {
    return <ProblemStatementCallout body={block.body} />;
  }

  if (block.kind === "numberedTimeline") {
    return <NumberedTimeline steps={block.steps} />;
  }

  if (block.kind === "explorationCards") {
    return (
      <ExplorationCards
        intro={block.intro}
        options={block.options}
        finalPickLabel={block.finalPickLabel}
        finalPickBody={block.finalPickBody}
      />
    );
  }

  if (block.kind === "imageCarousel") {
    return (
      <ImageCarousel
        images={block.images}
        ratio={block.ratio}
        caption={block.caption}
      />
    );
  }

  if (block.kind === "roadWaterToggle") {
    return (
      <RoadWaterToggle
        defaultMode={block.defaultMode}
        caption={block.caption}
      />
    );
  }

  if (block.kind === "iaMatrix") {
    return <IAPriorityMatrix />;
  }

  if (block.kind === "teamGrid") {
    return <TeamIntro members={block.members} />;
  }

  if (block.kind === "jakartaContext") {
    return <JakartaContext />;
  }

  if (block.kind === "designPrinciples") {
    return <DesignPrinciples principles={block.principles} />;
  }

  if (block.kind === "mediaStatement") {
    return (
      <MediaStatement
        src={block.src}
        alt={block.alt}
        eyebrow={block.eyebrow}
        headline={block.headline}
        body={block.body}
        source={block.source}
        ratio={block.ratio}
        overlay={block.overlay}
        align={block.align}
        headlineSize={block.headlineSize}
      />
    );
  }

  if (block.kind === "proseTwoColumn") {
    return (
      <div className="not-prose grid gap-8 md:grid-cols-2 md:gap-12">
        <p className="t-body max-w-none">
          <RichText text={block.left} />
        </p>
        <p className="t-body max-w-none">
          <RichText text={block.right} />
        </p>
      </div>
    );
  }

  if (block.kind === "aeonTargetSpread") {
    return (
      <AeonTargetSpread
        row1={block.row1}
        row2={block.row2}
        row3={block.row3}
      />
    );
  }

  if (block.kind === "backgroundPinnedDeck") {
    return (
      <BackgroundPinnedDeck
        kicker={block.kicker}
        eyebrow={block.eyebrow}
        slides={block.slides}
      />
    );
  }

  if (block.kind === "personaCollage") {
    return <PersonaCollage />;
  }

  if (block.kind === "modesShowcase") {
    return <ModesShowcase />;
  }

  if (block.kind === "bulletList") {
    return (
      <div>
        {block.intro ? (
          <p className="t-body">
            <RichText text={block.intro} />
          </p>
        ) : null}
        <ul
          className={[
            "max-w-[60ch] space-y-1.5",
            block.intro ? "mt-3" : "",
          ].join(" ")}
        >
          {block.items.map((item, i) => (
            <li key={i} className="flex items-baseline gap-3 t-body-sm">
              <span
                aria-hidden
                className="shrink-0 select-none font-medium leading-none"
                style={{ color: "var(--accent)" }}
              >
                ·
              </span>
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.kind === "numberedList") {
    return (
      <div>
        {block.intro ? (
          <p className="t-body">
            <RichText text={block.intro} />
          </p>
        ) : null}
        <ol
          className={[
            "w-full max-w-none divide-y hairline border-y hairline",
            block.intro ? "mt-5" : "",
          ].join(" ")}
        >
          {block.items.map((item, i) => (
            <li key={i} className="flex items-baseline gap-6 py-4">
              <span className="t-mono shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="t-h4 font-normal text-ink">
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (block.kind === "prose") {
    return (
      <div className="w-full max-w-none prose-rhythm t-body">
        {block.body
          .split("\n\n")
          .filter(Boolean)
          .map((para, i) => (
            <p key={i}>
              <RichText text={para} />
            </p>
          ))}
      </div>
    );
  }

  if (block.kind === "annotation") {
    return (
      <div className="flex flex-col gap-4 border-t hairline pt-8 md:flex-row md:items-start md:gap-10">
        <p className="t-eyebrow shrink-0 md:pt-3 md:w-[120px]">{block.label}</p>
        <p className="max-w-[34ch] text-[clamp(1.35rem,2.4vw,1.75rem)] font-light leading-[1.35] tracking-[-0.015em] text-ink">
          <RichText text={block.body} />
        </p>
      </div>
    );
  }

  if (block.kind === "image") {
    return (
      <div
        className={[
          "mt-6 overflow-hidden rounded-2xl border",
          block.borderless ? "border-transparent" : "border-ink/6",
        ].join(" ")}
      >
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <Image
            src={block.src}
            alt={block.alt}
            fill
            className={block.objectFit === "cover" ? "object-cover" : "object-contain"}
          />
        </div>
      </div>
    );
  }

  if (block.kind === "v2Items") {
    return (
      <div className="space-y-0">
        {block.items.map((item, i) => (
          <div key={i} className="border-t hairline pt-7 pb-2">
            <div className="flex items-start gap-5">
              <span className="mt-0.5 shrink-0 select-none font-sans text-[30px] font-light leading-none tabular-nums text-ink/10 tracking-[-0.04em]">
                {item.number}
              </span>
              <div className="min-w-0 flex-1">
                {item.label ? (
                  <p className={`${KICKER_ACCENT} mb-2`}>{item.label}</p>
                ) : null}
                <h4 className="t-h4">{item.title}</h4>
                <p className="mt-2 t-body">
                  <RichText text={item.body} />
                </p>
                {item.imageSrc || item.videoSrc || item.videoPlaceholder ? (
                  <div className="mt-5">
                    {item.imageSrc ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-ink/8 bg-[#fafafa]">
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt ?? item.title}
                          fill
                          className="object-contain"
                          sizes="(min-width: 768px) 70vw, 100vw"
                        />
                      </div>
                    ) : item.videoSrc ? (
                      <MediaVideo
                        src={item.videoSrc}
                        description={`Demo — ${item.title}`}
                        ratio="16/9"
                        className="rounded-2xl border border-ink/8"
                        autoPlay
                        loop
                      />
                    ) : (
                      <MediaPlaceholder
                        filename={`demo-${item.number}.mp4`}
                        description={`Demo video — ${item.title}`}
                        ratio="16/9"
                        mediaType="video"
                      />
                    )}
                  </div>
                ) : null}
                {item.hasConsole ? (
                  <>
                    <AgenticConsole />
                    <AgenticMetricPanel />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-x-10 gap-y-8 border-t hairline pt-8 md:grid-cols-3">
      {block.cards.map((card) => (
        <article key={card.title}>
          <p className="max-w-[28ch] text-[15px] font-medium leading-[1.4] tracking-normal text-ink normal-case">
            {card.title}
          </p>
          {card.body.split("\n\n").map((para, j) => (
            <p
              key={j}
              className={[
                "max-w-[34ch] t-body-sm",
                j === 0 ? "mt-4" : "mt-3",
              ].join(" ")}
            >
              <RichText text={para} />
            </p>
          ))}
        </article>
      ))}
    </div>
  );
}

export function SectionBlock({ block }: { block: CaseBlock }) {
  const hasDecisionStructure =
    Boolean(block.problem) || Boolean(block.designMove) || Boolean(block.buildProof);

  return (
    <div className="border-t hairline pt-8">
      {block.label ? (
        <p className={KICKER_ACCENT}>{block.label}</p>
      ) : null}
      <h3
        className={[
          "max-w-[40ch] t-h2",
          block.label ? "mt-3" : "",
        ].join(" ")}
      >
        <RichText text={block.title} />
      </h3>
      {block.body ? (
        <div className="mt-5 w-full max-w-none prose-rhythm t-body">
          {block.body.split("\n\n").map((para, i) => (
            <p key={i}>
              <RichText text={para} />
            </p>
          ))}
        </div>
      ) : null}

      {hasDecisionStructure ? (
        <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-3">
          <DecisionCell label="Problem" value={block.problem} />
          <DecisionCell label="Design move" value={block.designMove} />
          <DecisionCell label="Build proof" value={block.buildProof} />
        </div>
      ) : null}

      {block.bullets ? (
        <ul className="mt-7 w-full max-w-none divide-y hairline border-y hairline">
          {block.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 py-3 t-body-sm"
            >
              <span className="t-mono text-accent">→</span>
              <span>
                <RichText text={b} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {block.media && block.media.length > 0 ? (
        <div className="mt-8 space-y-8">
          {block.media.map((m, i) => (
            <MediaRenderer key={i} media={m} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DecisionCell({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div>
      <p className={KICKER_ACCENT}>{label}</p>
      <p className="mt-3 max-w-[34ch] t-body-sm">
        <RichText text={value} />
      </p>
    </div>
  );
}

export function MediaRenderer({ media }: { media: MediaItem }) {
  if (media.kind === "image") {
    if (media.src && media.finiHighlight) {
      return (
        <FiniKeyHighlight
          src={media.src}
          alt={media.description}
          titleLines={media.finiHighlight.titleLines}
          body={media.finiHighlight.body}
          textSide={media.finiHighlight.textSide}
        />
      );
    }
    return media.src ? (
      <MediaImage
        src={media.src}
        alt={media.description}
        ratio={media.ratio}
        maxWidth={media.maxWidth}
        fallbackHint={media.src}
        objectFit={media.objectFit}
      />
    ) : (
      <ImageSlot
        filename={media.filename}
        description={media.description}
        ratio={media.ratio ?? "16/9"}
      />
    );
  }

  if (media.kind === "video") {
    return (
      <MediaVideo
        src={media.src}
        description={media.description}
        ratio={media.ratio}
        poster={media.poster}
        autoPlay={media.autoPlay}
        loop={media.loop}
        muted={media.muted}
        controls={media.controls}
        objectFit={media.objectFit}
      />
    );
  }

  return (
    <Chart
      id={media.id}
      caption={media.caption}
      ratio={media.ratio ?? "16/9"}
    />
  );
}

function MediaPlaceholder({
  filename,
  description,
  ratio = "16/9",
  mediaType,
  src,
  sourceCaption,
  captionLabel,
}: {
  filename: string;
  description: string;
  ratio: ImageRatio;
  mediaType: "image" | "video";
  src?: string;
  sourceCaption?: string;
  captionLabel?: string;
}) {
  if (src && mediaType === "video") {
    return (
      <div>
        <MediaVideo
          src={src}
          description={description}
          ratio={ratio}
          autoPlay
          loop
          muted
          controls={false}
          className="rounded-2xl border border-ink/10"
        />
        {sourceCaption ? <p className="mt-3 t-mono">{sourceCaption}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <div
        className={[
          "relative w-full overflow-hidden rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.18)]",
          ratioClass[ratio],
        ].join(" ")}
      >
        <div aria-hidden className="absolute inset-0 grain opacity-15" />
        {captionLabel ? (
          <span
            className="absolute left-4 top-4 inline-flex items-center rounded-full px-2.5 py-0.5 t-mono"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            {captionLabel}
          </span>
        ) : (
          <span className="absolute left-4 top-4 t-mono text-ink/45">
            {`Demo ${mediaType}`}
          </span>
        )}
        <span className="absolute right-4 top-4 t-mono text-ink/35">
          {filename}
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <p className="max-w-[34ch] t-caption text-ink/55">{description}</p>
        </div>
      </div>
      {sourceCaption ? (
        <p className="mt-3 t-mono">{sourceCaption}</p>
      ) : null}
    </div>
  );
}

const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};
