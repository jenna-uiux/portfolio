"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import s from "./IslandScene.module.css";
import type { Island } from "./data";
import { MemoryStrip } from "./MemoryStrip";

type Props = {
  island: Island;
  onClose: () => void;
};

/** Renders `**bold**` spans as <strong>; newlines use .description pre-line */
function formatDescription(text: string): ReactNode {
  const parts = text.split(/\*\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : (
      part
    )
  );
}

export function IslandScene({ island, onClose }: Props) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  // ── Reveal + ambient fog/shimmer ─────────────────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Scene container fade-in
      tl.fromTo(
        sceneRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      );

      // Background subtle scale-down into place
      tl.fromTo(
        bgRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 1.6, ease: "power3.out" },
        0
      );

      // Tag → title
      tl.fromTo(
        `.${s.tag}`,
        { y: 18, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power3.out",
        },
        0.35
      );
      tl.fromTo(
        `.${s.title}`,
        { y: 18, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power3.out",
        },
        0.48
      );

      tl.fromTo(
        `.${s.introBody}`,
        { y: 14, opacity: 0, filter: "blur(4px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
        },
        0.55
      );

      tl.fromTo(
        `.${s.memoryDock}`,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        0.85
      );

      // Drifting fog
      gsap.utils.toArray<HTMLElement>(`.${s.fogBlob}`).forEach((el, i) => {
        gsap.to(el, {
          xPercent: i % 2 === 0 ? 10 : -10,
          yPercent: i % 2 === 0 ? -6 : 6,
          duration: gsap.utils.random(40, 55),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(el, {
          opacity: gsap.utils.random(0.25, 0.55),
          duration: gsap.utils.random(12, 20),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: sceneRef }
  );

  // ── ESC to close ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close with fade-out ──────────────────────────────────────────────
  const handleClose = () => {
    if (!sceneRef.current) {
      onClose();
      return;
    }
    gsap.to(sceneRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: onClose,
    });
  };

  return (
    <section
      ref={sceneRef as never}
      className={s.scene}
      aria-label={`${island.title} — ${island.tag}`}
    >
      <div
        ref={bgRef}
        className={s.bg}
        style={{ backgroundImage: `url(${island.image})` }}
      />
      <div
        className={[
          s.bgTint,
          island.key === "learn" ? s.bgTintBrightTopRight : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      />

      <div className={s.fog} aria-hidden="true">
        <div className={`${s.fogBlob} ${s.fogBlob1}`} />
        <div className={`${s.fogBlob} ${s.fogBlob2}`} />
      </div>
      <div className={s.shimmer} aria-hidden="true" />

      <button
        type="button"
        className={s.close}
        onClick={handleClose}
        aria-label="Close island"
      >
        ×
      </button>

      <div className={s.scroll}>
        <div
          className={
            island.experience && island.education
              ? `${s.scrollBody} ${s.scrollBodyResume}`
              : s.scrollBody
          }
        >
          <div
            className={
              island.experience && island.education
                ? `${s.content} ${s.contentResume}`
                : s.content
            }
          >
            {island.experience && island.education ? (
              <div className={`${s.introBody} ${s.introRow}`}>
                <p className={s.tag}>{island.tag}</p>
                <h2 className={s.title}>{island.title}</h2>
                <div className={s.resumeAside}>
                  <div className={s.resumeBlock}>
                    <p className={s.resumeHeading}>Experience</p>
                    <ul className={s.resumeList}>
                      {island.experience.map((item, i) => (
                        <li key={i} className={s.resumeItem}>
                          <span className={s.resumeRole}>
                            <span>{item.role}</span>
                            <span className={s.resumeOrg}>{item.org}</span>
                          </span>
                          <span className={s.resumePeriod}>{item.period}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={s.resumeBlock}>
                    <p className={s.resumeHeading}>Education</p>
                    <ul className={s.resumeList}>
                      {island.education.map((item, i) => (
                        <li key={i} className={s.resumeItem}>
                          <span className={s.resumeRole}>
                            <span>{item.degree}</span>
                            <span className={s.resumeOrg}>{item.org}</span>
                          </span>
                          <span className={s.resumePeriod}>{item.period}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className={s.description}>
                  {formatDescription(island.description)}
                </p>
              </div>
            ) : (
              <>
                <div className={s.introHeader}>
                  <p className={s.tag}>{island.tag}</p>
                  <h2 className={s.title}>{island.title}</h2>
                </div>
                <div className={`${s.introBody} ${s.introSingle}`}>
                  <p className={s.description}>
                    {formatDescription(island.description)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={s.memoryDock} aria-label="Core memories">
          <MemoryStrip images={island.memories} dock />
        </div>
      </div>
    </section>
  );
}
