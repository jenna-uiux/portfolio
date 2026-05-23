import Image from "next/image";

export function JakartaContext() {
  return (
    <div className="not-prose space-y-4">
      {/* Section 1 — Indonesia map card */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ borderColor: "rgba(245,245,245,0.08)", background: "#0a0a0a" }}
      >
        <div className="grid gap-0 md:grid-cols-[1fr_320px]">
          {/* Map image */}
          <div className="relative min-h-[220px]">
            <Image
              src="/images/aeon/context/indonesia-map.png"
              alt="Indonesia archipelago map"
              fill
              className="object-contain object-center p-6"
              sizes="(min-width: 768px) 60vw, 100vw"
            />
          </div>

          {/* Text */}
          <div
            className="flex flex-col justify-center border-t p-6 md:border-l md:border-t-0"
            style={{ borderColor: "rgba(245,245,245,0.08)" }}
          >
            <p
              className="text-[10px] font-medium tracking-[0.18em] uppercase"
              style={{ color: "rgba(245,245,245,0.4)" }}
            >
              Target Region
            </p>
            <h3
              className="mt-3 text-[15px] font-medium leading-snug"
              style={{ color: "rgba(245,245,245,0.9)" }}
            >
              The Ideal Testbed for Climate-Resilient Mobility
            </h3>
            <p
              className="mt-4 text-[13px] font-medium"
              style={{ color: "rgba(245,245,245,0.7)" }}
            >
              Jakarta, Indonesia
            </p>
            <p
              className="mt-2 text-[13px] leading-relaxed"
              style={{ color: "rgba(245,245,245,0.5)" }}
            >
              Over 17,000 islands with fragmented infrastructure. Everyday
              mobility depends on ferries and short-haul flights, limiting
              freedom and accessibility.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 — Flood risk map */}
      <div className="relative h-[420px] overflow-hidden rounded-2xl md:h-[480px]">
        <Image
          src="/images/aeon/context/jakarta-flood-map.png"
          alt="Jakarta coastal flood risk map, 2050 projection"
          fill
          className="object-cover"
          sizes="(min-width: 768px) 70vw, 100vw"
        />

        {/* Gradient overlays — matching Figma exactly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(183.261deg, rgba(0,0,0,0) 56%, rgb(0,0,0) 80%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(-53.757deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.66) 92%)",
          }}
        />

        {/* Top-left label */}
        <div className="absolute left-6 top-6 md:left-8 md:top-8">
          <p
            className="text-[10px] font-medium tracking-[0.18em] uppercase"
            style={{ color: "rgba(231,231,231,0.8)" }}
          >
            Target Region
          </p>
          <p
            className="mt-1 text-[15px] font-medium"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            The Ideal Testbed for Climate-Resilient Mobility
          </p>
        </div>

        {/* Bottom-left text */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <p
            className="max-w-[36ch] text-[14px] leading-relaxed md:text-[15px]"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            By 2050, over 23 million coastal residents may face regular
            flooding. Cities like Jakarta, Semarang, and Java&rsquo;s coastline
            already experience subsidence and seawater intrusion.
          </p>
          <p
            className="mt-3 text-[11px]"
            style={{ color: "rgba(166,166,166,0.8)" }}
          >
            Source: Climate Central — Coastal Risk Screening Tool (2050
            Projection) coastal.climatecentral.org
          </p>
        </div>
      </div>
    </div>
  );
}
