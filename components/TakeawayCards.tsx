import { RichText } from "./CaseStudyBlocks";

type Card = {
  title: string;
  body: string;
};

type Props = {
  cards: Card[];
};

export function TakeawayCards({ cards }: Props) {
  const cols =
    cards.length === 2
      ? "md:grid-cols-2"
      : cards.length === 1
        ? "md:grid-cols-1"
        : "md:grid-cols-3";

  return (
    <div className={`mt-10 grid gap-4 ${cols} md:gap-6`}>
      {cards.map((card) => (
        <article
          key={card.title}
          className="flex h-full flex-col rounded-xl border border-ink/10 bg-ink/[0.02] px-6 py-7 md:px-8 md:py-8"
        >
          <h3 className="text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
            {card.title}
          </h3>
          <div className="mt-4 flex-1 prose-rhythm t-body-sm">
            {card.body
              .split("\n\n")
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>
                  <RichText text={para} />
                </p>
              ))}
          </div>
        </article>
      ))}
    </div>
  );
}
