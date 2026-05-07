"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import s from "./MobileIslandList.module.css";
import type { Island, IslandKey } from "./data";

type Props = {
  islands: Island[];
  onSelect: (key: IslandKey) => void;
};

const shortDescription = (text: string, max = 140): string => {
  const plain = text.replace(/\*\*/g, "");
  if (plain.length <= max) return plain;
  const trimmed = plain.slice(0, max);
  return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "…";
};

export function MobileIslandList({ islands, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        `.${s.card}`,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.1,
        }
      );
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className={s.list}>
      <p className={s.heading}>About Jihyeon</p>
      {islands.map((island) => (
        <button
          key={island.key}
          type="button"
          className={s.card}
          onClick={() => onSelect(island.key)}
          aria-label={`Open ${island.title}`}
        >
          <div
            className={s.thumb}
            style={{ backgroundImage: `url(${island.image})` }}
          />
          <div className={s.cardBody}>
            <span className={s.tag}>{island.tag}</span>
            <h3 className={s.title}>{island.title}</h3>
            <p className={s.desc}>{shortDescription(island.description)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
