import Image from "next/image";

/**
 * Persona mood board matching Figma 1153:1518.
 * Asymmetric collage: one hero tile (with quote overlay), plus 7 supporting tiles
 * arranged in a grid that reads like an editorial spread.
 */
export function PersonaCollage() {
  return (
    <div className="not-prose">
      <div className="grid grid-cols-12 grid-rows-[260px_220px_220px] gap-3 md:gap-4">
        {/* Hero tile — Rafi with quote (col 1-7, row 1-2) */}
        <div className="relative col-span-12 row-span-2 overflow-hidden rounded-2xl md:col-span-7">
          <Image
            src="/images/aeon/persona/rafi-hero.png"
            alt="Rafi Nugroho, Field Engineer, Jakarta 2050"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 56vw, 100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(228deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.62) 90%)",
            }}
          />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
            <p
              className="italic leading-tight"
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "clamp(14px, 1.6vw, 18px)",
                fontFamily: "'New York', Georgia, serif",
                maxWidth: "42ch",
              }}
            >
              &ldquo;In Jakarta, time and terrain are never predictable. AEON
              gives me back control and the freedom to move on my own terms.&rdquo;
            </p>
            <p
              className="mt-3 text-[12px] md:text-[13px]"
              style={{ color: "rgba(203,203,203,0.85)" }}
            >
              — Rafi Nugroho, Field Engineer, Jakarta 2050
            </p>
          </div>
        </div>

        {/* Palm trees — col 8-9, row 1 */}
        <Tile
          src="/images/aeon/persona/rafi-palm.png"
          label="Enjoy hang out with friends"
          className="col-span-6 row-span-1 md:col-span-3"
        />

        {/* Sunset grass — col 10-12, row 1 (small square) */}
        <Tile
          src="/images/aeon/persona/rafi-sunset.png"
          className="col-span-6 row-span-1 md:col-span-2"
        />

        {/* Iguana — col 10-12, row 2 */}
        <Tile
          src="/images/aeon/persona/rafi-iguana.png"
          className="col-span-6 row-span-1 md:col-span-2"
        />

        {/* Beach — col 8-9, row 2 */}
        <Tile
          src="/images/aeon/persona/rafi-beach.png"
          className="col-span-6 row-span-1 md:col-span-3"
        />

        {/* Explorer mountain — col 1-3, row 3 */}
        <Tile
          src="/images/aeon/persona/rafi-explorer.png"
          label="Explorer"
          className="col-span-6 row-span-1 md:col-span-3"
        />

        {/* Jakarta night — col 4-5, row 3 */}
        <Tile
          src="/images/aeon/persona/rafi-jakarta.png"
          label="Jakarta, 2025"
          className="col-span-6 row-span-1 md:col-span-3"
        />

        {/* Traffic — col 6-12, row 3 */}
        <Tile
          src="/images/aeon/persona/rafi-traffic.png"
          label="Constant delays make him feel like his time is being wasted."
          className="col-span-12 row-span-1 md:col-span-6"
        />
      </div>
    </div>
  );
}

function Tile({
  src,
  label,
  className = "",
}: {
  src: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Image
        src={src}
        alt={label ?? ""}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 25vw, 50vw"
      />
      {label ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(192deg, rgba(0,0,0,0) 65%, rgba(0,0,0,0.62) 92%)",
            }}
          />
          <p
            className="absolute bottom-3 left-3 right-3 italic md:bottom-4 md:left-5"
            style={{
              color: "rgba(255,255,255,0.95)",
              fontFamily: "'New York', Georgia, serif",
              fontSize: "clamp(12px, 1vw, 14px)",
              lineHeight: 1.25,
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            }}
          >
            {label}
          </p>
        </>
      ) : null}
    </div>
  );
}
