import Image from "next/image";

type Photo = {
  src: string;
  alt: string;
};

type Props = {
  images: Photo[];
};

function BentoCell({
  image,
  className,
  sizes,
}: {
  image: Photo;
  className: string;
  sizes: string;
}) {
  return (
    <div
      className={[
        "relative min-h-0 overflow-hidden rounded-xl bg-ink/[0.04]",
        className,
      ].join(" ")}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
    </div>
  );
}

export function ResearchPhotoRow({ images }: Props) {
  const [first, second] = images;

  if (!first || !second) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:grid sm:h-[320px] sm:grid-cols-12 sm:gap-3 md:h-[360px]">
      <BentoCell
        image={first}
        className="h-[180px] sm:col-span-7 sm:h-auto"
        sizes="(min-width: 640px) 42vw, 100vw"
      />
      <BentoCell
        image={second}
        className="h-[160px] sm:col-span-5 sm:h-auto"
        sizes="(min-width: 640px) 28vw, 100vw"
      />
    </div>
  );
}
