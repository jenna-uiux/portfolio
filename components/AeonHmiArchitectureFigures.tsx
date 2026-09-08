import Image from "next/image";

const FIGURES = [
  {
    label: "DISPLAY STRUCTURE",
    description:
      "Locations of the HUD, cluster, infotainment, and auxiliary displays",
    src: "/images/aeon/ia/Display_structure.jpg",
    alt: "AEON cockpit diagram showing the locations of the HUD, cluster, infotainment, and auxiliary displays",
  },
  {
    label: "INFORMATION PRIORITY",
    description: "Information priority assigned to each display",
    src: "/images/aeon/ia/Info_priority.jpg",
    alt: "AEON cockpit diagram showing the information priority assigned to each display",
  },
];

export function AeonHmiArchitectureFigures() {
  return (
    <div className="not-prose space-y-12 md:space-y-16">
      {FIGURES.map((figure) => (
        <figure key={figure.src} className="m-0">
          <figcaption className="mb-4 grid gap-2 sm:grid-cols-[1fr_3fr] sm:items-baseline sm:gap-6">
            <p className="text-[16px] font-medium leading-snug text-ink/80">
              {figure.label}
            </p>
            <p className="t-body">{figure.description}</p>
          </figcaption>

          <div className="relative aspect-video w-full overflow-hidden rounded-none bg-black">
            <Image
              src={figure.src}
              alt={figure.alt}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
