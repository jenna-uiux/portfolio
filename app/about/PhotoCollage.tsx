"use client";

import Image from "next/image";
import { useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import s from "./summary.module.css";

const photos = [
  { src: "/images/about/memories/background/1.jpg", alt: "Jihyeon in a white shirt", caption: "Hi, it's me!", angle: "-6deg" },
  { src: "/images/about/memories/learn/5.jpg", alt: "Jihyeon working on her laptop at a hackathon", caption: "At a hackathon", angle: "7deg" },
  { src: "/images/about/memories/background/4.jpg", alt: "Jihyeon teaching in a classroom", caption: "My teaching days", angle: "-4deg" },
];

export function PhotoCollage() {
  const collageRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const collage = collageRef.current;
    if (!collage) return;
    const bounds = collage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    collage.style.setProperty("--tilt-x", `${x * 3}deg`);
    collage.style.setProperty("--tilt-y", `${y * -3}deg`);
  };

  const resetTilt = () => {
    const collage = collageRef.current;
    if (!collage) return;
    collage.style.setProperty("--tilt-x", "0deg");
    collage.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div className={s.photoGroup}>
      <div
        ref={collageRef}
        className={s.collage}
        aria-label="A few moments from my life"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        {photos.map((photo) => (
          <figure
            key={photo.src}
            className={s.photo}
            style={{ "--angle": photo.angle } as CSSProperties}
          >
            <span className={s.photoImage}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 55vw, 290px" />
            </span>
            <figcaption className={s.photoCaption}>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className={s.photoHint}>A few moments along the way.</p>
    </div>
  );
}
