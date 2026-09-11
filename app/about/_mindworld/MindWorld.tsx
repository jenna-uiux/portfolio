"use client";

import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import s from "./MindWorld.module.css";
import { islands, IslandKey, islandByKey } from "./data";
import { Hero } from "./Hero";
import { WorldMap } from "./WorldMap";
import { IslandScene } from "./IslandScene";
import { SoundToggle, type SoundToggleHandle } from "./SoundToggle";
import { MobileIslandList } from "./MobileIslandList";
import { ContactDock } from "./ContactDock";

gsap.registerPlugin(useGSAP);

type Phase = "hero" | "entering" | "map" | "zooming" | "island";

export function MindWorld() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mapWrapRef = useRef<HTMLDivElement | null>(null);
  const dimRef = useRef<HTMLDivElement | null>(null);
  const soundRef = useRef<SoundToggleHandle | null>(null);

  // Preload island background images so we don't mount a blank scene during
  // the in-world zoom transition.
  const preloadImage = useCallback((src: string) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = async () => {
        try {
          await img.decode?.();
        } catch {
          // noop
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  }, []);

  const [phase, setPhase] = useState<Phase>("hero");
  const [activeKey, setActiveKey] = useState<IslandKey | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [worldReady, setWorldReady] = useState(false);
  const [mapIntro, setMapIntro] = useState(false);
  const mapIntroShownRef = useRef(false);

  // ── Detect mobile (no hotspot map below 760px)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ── Atmospheric layer animations + cursor parallax
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Sea fog drift — wide travel, slow cycles, opposing directions ------
      if (!reduce) {
        const fogPaths: Array<{ x: number; y: number; dur: number; o: [number, number]; oDur: number }> = [
          { x: 28, y: -10, dur: 60, o: [0.55, 1], oDur: 22 },
          { x: -34, y: 14, dur: 72, o: [0.4, 0.95], oDur: 26 },
          { x: 18, y: 22, dur: 90, o: [0.5, 0.95], oDur: 30 },
        ];

        gsap.utils.toArray<HTMLElement>(`.${s.fogBlob}`).forEach((el, i) => {
          const p = fogPaths[i % fogPaths.length];
          gsap.fromTo(
            el,
            { xPercent: -p.x * 0.5, yPercent: -p.y * 0.5 },
            {
              xPercent: p.x,
              yPercent: p.y,
              duration: p.dur,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: i * 2,
            }
          );
          gsap.fromTo(
            el,
            { opacity: p.o[0] },
            {
              opacity: p.o[1],
              duration: p.oDur,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: i * 1.5,
            }
          );
        });

        // Water shimmer — slow drift + breath of brightness -----------------
        gsap.to(`.${s.shimmer}`, {
          backgroundPosition: "320px 200px, -260px 180px, 200px -240px",
          duration: 80,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.fromTo(
          `.${s.shimmer}`,
          { opacity: 0.06 },
          {
            opacity: 0.22,
            duration: 22,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }
        );

        // World breath — almost imperceptible map scale --------------------
        gsap.to(`.${s.map}`, {
          scale: 1.045,
          duration: 70,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Particles --------------------------------------------------------
        const particles = gsap.utils.toArray<HTMLElement>(`.${s.particle}`);
        particles.forEach((p) => {
          gsap.set(p, {
            x: gsap.utils.random(0, window.innerWidth),
            y: gsap.utils.random(0, window.innerHeight),
            opacity: 0,
          });
          const drift = () => {
            gsap.to(p, {
              x: `+=${gsap.utils.random(-80, 80)}`,
              y: `+=${gsap.utils.random(-50, 50)}`,
              opacity: gsap.utils.random(0.18, 0.55),
              duration: gsap.utils.random(8, 16),
              ease: "sine.inOut",
              onComplete: drift,
            });
          };
          gsap.delayedCall(gsap.utils.random(0, 6), drift);
        });

        // Cursor parallax on the map layer -------------------------------
        const xTo = gsap.quickTo(`.${s.map}`, "x", {
          duration: 1.6,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(`.${s.map}`, "y", {
          duration: 1.6,
          ease: "power3.out",
        });

        const onMove = (e: MouseEvent) => {
          const cx = (e.clientX / window.innerWidth - 0.5) * 2;
          const cy = (e.clientY / window.innerHeight - 0.5) * 2;
          xTo(-cx * 18);
          yTo(-cy * 14);
        };
        window.addEventListener("mousemove", onMove);

        return () => {
          window.removeEventListener("mousemove", onMove);
        };
      }
    },
    { scope: rootRef }
  );

  // ── Phase transitions ─────────────────────────────────────────────────

  const enterMap = useCallback(() => {
    if (!worldReady || phase !== "hero") return;
    soundRef.current?.enableSound();
    setPhase("entering");
  }, [worldReady, phase]);

  // Let the camera settle and the foreground mist clear before showing targets.
  useEffect(() => {
    if (phase !== "entering") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setPhase("map");
      if (!mapIntroShownRef.current) {
        mapIntroShownRef.current = true;
        setMapIntro(true);
      }
    }, reduce ? 0 : 1150);
    return () => window.clearTimeout(timer);
  }, [phase, isMobile]);

  const dismissMapIntro = useCallback(() => setMapIntro(false), []);

  // Auto-fade the intro hint, and dismiss on first interaction.
  useEffect(() => {
    if (!mapIntro) return;
    const t = window.setTimeout(dismissMapIntro, 4200);
    const onInteract = () => dismissMapIntro();
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, [mapIntro, dismissMapIntro]);

  const enterIsland = useCallback((key: IslandKey) => {
    const island = islandByKey(key);
    const mapWrap = mapWrapRef.current;
    const dim = dimRef.current;
    if (!mapWrap || !dim) {
      setActiveKey(key);
      setPhase("island");
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Start preloading immediately; we'll only mount IslandScene after it's ready.
    const islandImageReady = preloadImage(island.image);

    setPhase("zooming");

    if (reduce) {
      // Soft crossfade only — no zoom, no pan
      gsap.timeline({
        onComplete: () => {
          islandImageReady.then(() => {
            setActiveKey(key);
            setPhase("island");
            gsap.delayedCall(0.4, () => gsap.set(dim, { opacity: 0 }));
          });
        },
      }).to(dim, { opacity: 1, duration: 0.5, ease: "power2.in" });
      return;
    }

    // Camera-zoom timeline
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        islandImageReady.then(() => {
          setActiveKey(key);
          setPhase("island");
        });
        // reset map for next time once scene is on top
        gsap.delayedCall(0.6, () => {
          gsap.set(mapWrap, {
            scale: 1,
            xPercent: 0,
            yPercent: 0,
            transformOrigin: "50% 50%",
          });
          gsap.set(dim, { opacity: 0 });
        });
      },
    });

    // pan slightly toward island center for cinematic feel
    const offsetX = (50 - island.pos.x) * 0.25;
    const offsetY = (50 - island.pos.y) * 0.25;

    tl.set(mapWrap, {
      transformOrigin: `${island.pos.x}% ${island.pos.y}%`,
    })
      .to(
        mapWrap,
        {
          scale: 2.2,
          xPercent: offsetX,
          yPercent: offsetY,
          duration: 1.4,
        },
        0
      )
      .to(
        dim,
        {
          opacity: 1,
          duration: 0.7,
          ease: "power2.in",
        },
        0.7
      );
  }, [preloadImage]);

  const closeIsland = useCallback(() => {
    setActiveKey(null);
    setPhase("map");
  }, []);

  return (
    <div
      ref={rootRef}
      className={[s.root, worldReady ? s.ready : ""].filter(Boolean).join(" ")}
      aria-label="Mind World"
      data-phase={phase}
    >
      {/* World shell — fixed atmospheric stack */}
      <div
        className={[s.world, worldReady ? s.worldVisible : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <div ref={mapWrapRef} className={s.mapWrap}>
          <div className={s.map}>
            <NextImage
              src="/images/about/hero.webp"
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="106vw"
              unoptimized
              className={s.mapImage}
              onLoad={() => setWorldReady(true)}
              onError={() => setWorldReady(true)}
            />
          </div>
          <div className={s.mapTint} />
        </div>

        {/* Drifting clouds — real PNG textures with cast shadows on the terrain */}
        <div className={s.cloudLayer}>
          {[
            { src: "/images/about/cloud/cloud_1.webp", className: s.cloud1 },
            { src: "/images/about/cloud/cloud_2.webp", className: s.cloud2 },
            { src: "/images/about/cloud/cloud_3.webp", className: s.cloud3 },
          ].map(({ src, className }) => (
            <div key={src} className={`${s.cloudGroup} ${className}`}>
              <span
                className={s.cloudShadow}
                style={{
                  maskImage: `url(${src})`,
                  WebkitMaskImage: `url(${src})`,
                }}
                aria-hidden="true"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className={s.cloudImg}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          ))}
        </div>

        {/* Atmospheric haze — keeps the world feeling soft */}
        <div className={s.fog}>
          <div className={`${s.fogBlob} ${s.fogBlob1}`} />
          <div className={`${s.fogBlob} ${s.fogBlob2}`} />
          <div className={`${s.fogBlob} ${s.fogBlob3}`} />
        </div>

        <div className={s.shimmer} />

        <div className={s.particles}>
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className={s.particle} />
          ))}
        </div>

        <div className={s.vignette} />
      </div>

      <div className={s.entryShade} aria-hidden="true" />
      <div className={s.entryMist} aria-hidden="true" />

      {/* Dark transition overlay (sits above world, below content) */}
      <div ref={dimRef} className={s.dim} aria-hidden="true" />

      {/* Original first-entry guide: dimmed world, hotspot and tapping cue. */}
      <div
        className={[s.mapIntro, mapIntro ? s.mapIntroVisible : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!mapIntro}
      >
        <div className={s.mapIntroInner}>
          <h2 className={s.mapIntroTitle}>How to Explore</h2>

          {/* Animated hotspot + tapping hand affordance */}
          <div className={s.tapDemo} aria-hidden="true">
            <span className={s.tapDot}>
              <span className={s.tapRing} />
              <span className={`${s.tapRing} ${s.tapRing2}`} />
            </span>
            <svg
              className={s.tapHand}
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              {/* Simple cursor pointer */}
              <path
                d="M9 6l14 12-7 1.3 2.2 6.7-3 1-2.2-6.6-4.6 5.7L9 6Z"
                fill="rgba(248,241,226,0.22)"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className={s.mapIntroHint}>
            {isMobile
              ? "Tap an island card to explore its story."
              : "Tap a glowing point to open an island."}
          </p>
        </div>
      </div>

      {/* Content phases */}
      <div
        className={[s.content, worldReady ? s.contentVisible : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <Hero
          ready={worldReady}
          visible={phase === "hero"}
          onExplore={enterMap}
        />

        {!isMobile && (
          <WorldMap
            islands={islands}
            visible={phase === "map"}
            onSelect={enterIsland}
          />
        )}

        {isMobile && (phase === "map" || phase === "island") && (
          <MobileIslandList
            islands={islands}
            onSelect={(k) => {
              setActiveKey(k);
              setPhase("island");
            }}
          />
        )}

        {activeKey && (
          <IslandScene
            island={islandByKey(activeKey)}
            onClose={closeIsland}
          />
        )}
      </div>

      <ContactDock hidden={phase !== "map"} />
      <SoundToggle ref={soundRef} />
    </div>
  );
}
