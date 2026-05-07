import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  titleLines: string[];
  body: string;
  textSide: "left" | "right";
};

export function FiniKeyHighlight({
  src,
  alt,
  titleLines,
  body,
  textSide,
}: Props) {
  const paragraphs = body.split("\n\n").filter(Boolean);

  const textBlock = (
    <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
      <h3 className="text-[clamp(1.65rem,3.2vw,3rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink">
        {titleLines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h3>
      <div className="mt-6 space-y-4 text-[18px] font-normal leading-[1.4] text-[#646464] md:text-[24px]">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );

  const imageBlock = (
    <div className="relative flex min-h-[260px] items-center justify-center px-4 py-6 md:min-h-[380px] md:px-6 md:py-10">
      <div className="relative h-[min(72vw,420px)] w-full max-w-[640px] md:h-[min(52vw,520px)] md:max-w-none">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl bg-[#f0f0f0]">
      <div className="grid md:grid-cols-2 md:items-center">
        {textSide === "left" ? (
          <>
            {textBlock}
            {imageBlock}
          </>
        ) : (
          <>
            <div className="md:order-1">{imageBlock}</div>
            <div className="md:order-2">{textBlock}</div>
          </>
        )}
      </div>
    </div>
  );
}
