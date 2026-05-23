"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

type Principle = {
  number: string;
  title: string;
  tagline: string;
  videoSrc: string;
  iconSrc: string;
  hoverDescription?: string;
};

export function DesignPrinciples({ principles }: { principles: Principle[] }) {
  return (
    <div className="not-prose">
      <div
        className="grid grid-cols-1 overflow-hidden rounded-sm border border-white/[0.06] md:grid-cols-3"
        style={{ background: "#050505" }}
      >
        {principles.map((p, i) => (
          <Panel key={p.number} principle={p} variant={i} />
        ))}
      </div>
    </div>
  );
}

function Panel({ principle, variant }: { principle: Principle; variant: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(false);
  const descId = `principle-hover-${principle.number}`;

  return (
    <motion.div
      className="group relative cursor-default overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25"
      tabIndex={0}
      role="group"
      aria-label={principle.title}
      aria-describedby={principle.hoverDescription ? descId : undefined}
      style={{
        aspectRatio: "12 / 24",
        background: "#050505",
        borderRight:
          variant < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined,
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, delay: variant * 0.12 }}
    >
      {/* Screen readers: full description always available */}
      {principle.hoverDescription ? (
        <p id={descId} className="sr-only">
          {principle.hoverDescription}
        </p>
      ) : null}

      {/* Fallback atmosphere when video is missing or still loading */}
      {!videoOk && variant === 0 ? <SeamlessAtmosphere /> : null}
      {!videoOk && variant === 1 ? <MultisensoryAtmosphere /> : null}
      {!videoOk && variant === 2 ? <FreedomAtmosphere /> : null}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setVideoOk(true)}
        onError={() => setVideoOk(false)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: videoOk ? 1 : 0,
          transition: "opacity 0.55s ease-out",
          pointerEvents: "none",
        }}
      >
        <source src={principle.videoSrc} type="video/mp4" />
      </video>

      {/* Darken video — sits between footage and icon/label */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.58]"
        style={{ opacity: videoOk ? 1 : 0.72, transition: "opacity 0.5s ease-out" }}
      />

      {/* SVG icon */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <PrincipleIcon variant={variant} iconSrc={principle.iconSrc} />
      </div>

      {/* Title */}
      <div className="absolute inset-x-0 bottom-[20%] z-[2] flex justify-center md:bottom-[22%]">
        <p
          className="text-center"
          style={{
            color: "#fbfbfb",
            fontSize: "clamp(11px, 1.15vw, 15px)",
            fontWeight: 350,
            letterSpacing: "-0.005em",
            lineHeight: 1.25,
            textShadow: "0 1px 20px rgba(0,0,0,0.75)",
          }}
        >
          {principle.title.split(" ").length > 2 ? (
            <>
              {principle.title.split(" ").slice(0, -2).join(" ")}
              <br />
              {principle.title.split(" ").slice(-2).join(" ")}
            </>
          ) : (
            principle.title
          )}
        </p>
      </div>

      {/* Extra legibility at bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      />

      {/* Hover / focus: long description (md+ pointer / keyboard) */}
      {principle.hoverDescription ? (
        <div
          aria-hidden
          className="absolute inset-0 z-[5] flex items-center justify-center bg-black/[0.82] px-4 py-8 opacity-0 [visibility:hidden] transition-[opacity,visibility] duration-300 ease-out pointer-events-none md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-hover:[visibility:visible] md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:[visibility:visible]"
        >
          <p
            className="max-w-[32ch] text-center text-[12px] font-light leading-relaxed tracking-[-0.01em] text-white/95 md:text-[13px]"
            style={{ textShadow: "0 1px 18px rgba(0,0,0,0.8)" }}
          >
            {principle.hoverDescription}
          </p>
        </div>
      ) : null}
    </motion.div>
  );
}

/* ───────────── Atmospheres ───────────── */

function SeamlessAtmosphere() {
  return (
    <>
      {/* Two dark glassy lens shapes on left + right edges */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "-20%",
          top: "30%",
          width: "55%",
          aspectRatio: "1/1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, rgba(40,40,40,0.4) 30%, transparent 65%)",
          filter: "blur(2px)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          right: "-20%",
          top: "30%",
          width: "55%",
          aspectRatio: "1/1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.06) 0%, rgba(40,40,40,0.4) 30%, transparent 65%)",
          filter: "blur(2px)",
        }}
      />
      {/* Center glow behind the merged-circles SVG */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: "26%",
          aspectRatio: "1/1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)",
          translateX: "-50%",
          translateY: "-50%",
          filter: "blur(14px)",
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function MultisensoryAtmosphere() {
  return (
    <>
      {/* Scattered dark bubbles, very low contrast */}
      <Bubble x="10%" y="20%" size="22%" opacity={0.15} delay={0} />
      <Bubble x="-5%" y="60%" size="28%" opacity={0.18} delay={0.8} />
      <Bubble x="78%" y="14%" size="20%" opacity={0.13} delay={1.6} />
      <Bubble x="68%" y="68%" size="25%" opacity={0.16} delay={2.4} />
      <Bubble x="34%" y="86%" size="18%" opacity={0.14} delay={1.2} />
    </>
  );
}

function FreedomAtmosphere() {
  return (
    <>
      {/* Horizontal banded water-surface gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #060606 0%, #0a0a0a 30%, #0d0d0d 40%, #0a0a0a 50%, #060606 70%, #050505 100%), repeating-linear-gradient(to bottom, transparent 0px, transparent 8px, rgba(255,255,255,0.012) 9px, transparent 10px)",
        }}
      />
      {/* Big dark glassy bubble at center */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%]"
        style={{
          width: "72%",
          aspectRatio: "1/1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 30%, rgba(20,20,20,0.3) 60%, transparent 75%)",
          border: "1px solid rgba(255,255,255,0.04)",
          translateX: "-50%",
          translateY: "-50%",
          backdropFilter: "blur(2px)",
        }}
        animate={{
          y: ["-50%", "-48%", "-50%"],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "22%",
          top: "22%",
          width: "20%",
          aspectRatio: "1/1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </>
  );
}

function Bubble({
  x,
  y,
  size,
  opacity,
  delay,
}: {
  x: string;
  y: string;
  size: string;
  opacity: number;
  delay: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        width: size,
        aspectRatio: "1/1",
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,${opacity * 0.4}) 0%, rgba(255,255,255,${opacity * 0.1}) 30%, rgba(20,20,20,${opacity * 1.5}) 60%, transparent 75%)`,
        border: `1px solid rgba(255,255,255,${opacity * 0.3})`,
        filter: "blur(0.5px)",
      }}
      animate={{
        y: ["0%", "-3%", "0%"],
        opacity: [opacity, opacity * 1.3, opacity],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ───────────── Per-principle icon w/ animation ───────────── */

function PrincipleIcon({
  variant,
  iconSrc,
}: {
  variant: number;
  iconSrc: string;
}) {
  if (variant === 0) {
    // Seamless: two merged white circles — soft glow pulse
    return (
      <motion.div
        className="relative"
        style={{
          width: "28%",
          aspectRatio: "191 / 124",
          filter: "drop-shadow(0 0 30px rgba(255,255,255,0.7))",
        }}
        animate={{
          scale: [1, 1.04, 1],
          filter: [
            "drop-shadow(0 0 24px rgba(255,255,255,0.6))",
            "drop-shadow(0 0 40px rgba(255,255,255,0.9))",
            "drop-shadow(0 0 24px rgba(255,255,255,0.6))",
          ],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={iconSrc} alt="" fill className="object-contain" />
      </motion.div>
    );
  }

  if (variant === 1) {
    // Multisensory: 4-circle venn — slow rotation
    return (
      <motion.div
        className="relative"
        style={{ width: "32%", aspectRatio: "1/1", opacity: 0.85 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Image src={iconSrc} alt="" fill className="object-contain" />
      </motion.div>
    );
  }

  // Freedom: concentric rings — outward pulse
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "32%", aspectRatio: "1/1" }}
    >
      <Image src={iconSrc} alt="" fill className="object-contain" />
      {/* Pulse rings */}
      {[0, 1.2, 2.4].map((delay) => (
        <motion.div
          key={delay}
          className="absolute rounded-full border"
          style={{
            width: "55%",
            height: "55%",
            borderColor: "rgba(255,255,255,0.35)",
          }}
          animate={{
            scale: [1, 1.8],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: "easeOut",
            delay,
          }}
        />
      ))}
    </div>
  );
}
