"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { BinaryInterfaceHero } from "./BinaryInterfaceHero";

const SWAP_WORDS = ["need", "want"] as const;
const SWAP_INTERVAL_MS = 2600;

export function Hero() {
  const [micEnabled, setMicEnabled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const px = useSpring(parallaxX, { stiffness: 110, damping: 18, mass: 0.6 });
  const py = useSpring(parallaxY, { stiffness: 110, damping: 18, mass: 0.6 });

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % SWAP_WORDS.length);
    }, SWAP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      // Keep it subtle: 0..~8px range
      parallaxX.set(nx * 8);
      parallaxY.set(ny * 5);
    };
    const onLeave = () => {
      parallaxX.set(0);
      parallaxY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [parallaxX, parallaxY]);

  const word = SWAP_WORDS[wordIndex];

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <BinaryInterfaceHero className="absolute inset-0" audioEnabled={micEnabled} />

      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ x: px, y: py }}
        >
          <div className="text-center font-[300] text-ink">
            <motion.h1
              className="text-[clamp(36px,4.8vw,64px)] leading-[1.02] tracking-[-0.035em]"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.22, duration: 1.05, ease: "easeOut" }}
            >
              I design and build
            </motion.h1>

            <motion.p
              className="mt-3 text-[clamp(36px,4.8vw,64px)] leading-[1.02] tracking-[-0.02em]"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.95, duration: 0.9, ease: "easeOut" }}
            >
              <span className="mr-2">what you</span>
              <span className="relative inline-block h-[1.05em] min-w-[2.2em] overflow-hidden align-bottom">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={word}
                    className="absolute inset-0 flex items-center justify-center italic text-ink/80 will-change-transform"
                    initial={{ y: "-100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.p>
          </div>
        </motion.div>

        <div className="container-ultra relative flex flex-1 flex-col justify-end py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-6 md:bottom-12"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-3 whitespace-nowrap text-sm font-light text-ink/80 transition-colors hover:text-ink"
            >
              <span className="underline-grow">Selected work</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                ↓
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20 pointer-events-auto select-none">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setMicEnabled((v) => !v)}
            aria-pressed={micEnabled}
            aria-label={`Voice interaction ${micEnabled ? "on" : "off"}`}
            className={[
              "group relative h-9 w-[76px] rounded-full border transition-colors duration-300",
              micEnabled
                ? "border-black bg-black shadow-[0_10px_26px_rgba(0,0,0,0.22)]"
                : "border-ink/10 bg-white/70 shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-md hover:bg-white/85",
            ].join(" ")}
          >
            <span
              aria-hidden
              className={[
                "absolute top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-300",
                micEnabled ? "left-3 text-white/90" : "right-3 text-ink/55",
              ].join(" ")}
            >
              {micEnabled ? "On" : "Off"}
            </span>

            <span
              aria-hidden
              className={[
                "absolute top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white",
                "shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-all duration-300",
                micEnabled ? "right-1" : "left-1",
              ].join(" ")}
            >
              <svg
                viewBox="0 0 24 24"
                className={[
                  "h-[14px] w-[14px] transition-colors",
                  micEnabled ? "text-ink" : "text-ink/70",
                ].join(" ")}
                fill="currentColor"
              >
                <rect x="4.5" y="9" width="2.2" height="6" rx="1.1" />
                <rect x="8.0" y="7" width="2.2" height="10" rx="1.1" />
                <rect x="11.5" y="5" width="2.2" height="14" rx="1.1" />
                <rect x="15.0" y="7" width="2.2" height="10" rx="1.1" />
                <rect x="18.5" y="9" width="2.2" height="6" rx="1.1" />
              </svg>
            </span>
          </button>

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink/45">
            Voice interaction
          </p>
        </div>
      </div>

    </section>
  );
}
