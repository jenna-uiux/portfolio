import { RichText } from "./CaseStudyBlocks";

type Props = {
  title: string;
  body: string;
};

export function NextStepHighlight({ title, body }: Props) {
  return (
    <aside className="flex h-full flex-col rounded-2xl border border-[#FD8C37]/20 bg-[#FFFFFF] p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
          What’s next
        </p>
      </div>
      <h3 className="mt-7 max-w-[24ch] font-sans text-[24px] font-medium leading-[1.3] tracking-[-0.015em] text-ink">
        <RichText text={title} />
      </h3>
      <p className="mt-5 max-w-[54ch] text-[16px] font-light leading-[1.7] text-[color:var(--body)]">
        <RichText text={body} />
      </p>
    </aside>
  );
}
