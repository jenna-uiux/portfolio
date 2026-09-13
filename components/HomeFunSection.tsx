"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { funItems } from "@/app/fun/items";
import { r2Url } from "@/lib/media";
import styles from "./HomeFunSection.module.css";

const rows = [
  { className: styles.opening, items: [funItems.liquid, funItems.heartbeat] },
  { className: styles.closing, items: [funItems.hani, funItems.demolight] },
] as const;

export function HomeFunSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="home-fun-title">
      <div className="container-ultra">
        <motion.h2
          id="home-fun-title"
          className={styles.heading}
          initial={reduceMotion ? false : { y: 28 }}
          whileInView={reduceMotion ? undefined : { y: 0 }}
          viewport={{ amount: 0.6 }}
          transition={{ duration: 1.05, ease: [0.33, 0, 0.2, 1] }}
        >
          <span className={styles.promptMark} aria-hidden="true">
            &gt;
          </span>
          Built for fun<span className="prompt-cursor" aria-hidden="true">_</span>
        </motion.h2>

        <div className={styles.gallery}>
          {rows.map((row, rowIndex) => (
            <div className={`${styles.row} ${row.className}`} key={rowIndex}>
              {row.items.map((item, itemIndex) => (
                <motion.article
                  className={styles.card}
                  key={item.id}
                  initial={reduceMotion ? false : { y: 36 }}
                  whileInView={reduceMotion ? undefined : { y: 0 }}
                  viewport={{ amount: 0.18 }}
                  transition={{
                    duration: 1.05,
                    delay: itemIndex * 0.08,
                    ease: [0.33, 0, 0.2, 1],
                  }}
                >
                  <div
                    className={styles.media}
                    style={{ "--media-ratio": item.ratio } as CSSProperties}
                  >
                    <video
                      src={r2Url(`fun/${item.video}`)}
                      poster={`/images/fun/${item.video?.replace(".mp4", ".jpg")}`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`${item.title} preview`}
                    />
                  </div>
                </motion.article>
              ))}
            </div>
          ))}
        </div>

        <Link href="/fun" className={styles.cta} data-cursor="read">
          <span>View all things I made</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
