"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import { R2_MEDIA, r2Url } from "@/lib/media";
import styles from "./AeonReflectionMoments.module.css";

const photos = [
  {
    src: "/images/aeon/reflection/team.jpg",
    alt: "Three AEON teammates taking a selfie in front of their vehicle design boards",
    label: "01 / The people",
    title: "amazing team, on & offline <3",
    caption: "The people who made AEON happen. Including our teammates on the other side of the screen.",
  },
  {
    src: "/images/aeon/reflection/autodesk.jpg",
    alt: "An online Autodesk session showing a vehicle design walkthrough",
    label: "02 / The process",
    title: "Autodesk session. fully locked in.",
    caption: "Learning from the people who do this for real.",
  },
] as const;

export function AeonReflectionMoments() {
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selected === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const photo = selected === null ? null : photos[selected];

  return (
    <div id="reflection-moments" className={`not-prose scroll-mt-24 ${styles.moments}`}>
      <div className={styles.heading}>
        <p className="t-eyebrow-mut">Behind the scenes</p>
        <h3>A few moments along the way.</h3>
      </div>

      <div className={styles.grid}>
        {photos.map((item, index) => (
          <figure key={item.src} className={styles.moment}>
            <button
              type="button"
              className={styles.photoButton}
              onClick={() => setSelected(index)}
              aria-label={`Enlarge photo: ${item.title}`}
              aria-haspopup="dialog"
            >
              <Image src={item.src} alt={item.alt} width={1920} height={1280}
                sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw" />
              <span className={styles.expand} aria-hidden="true"><ArrowUpRight size={18} /></span>
            </button>
            <figcaption className={styles.caption}>
              <span className={styles.label}>{item.label}</span>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.description}>{item.caption}</p>
            </figcaption>
          </figure>
        ))}

        <figure className={styles.moment}>
          <div className={styles.videoFrame}>
            <video
              ref={videoRef}
              src={r2Url(R2_MEDIA.aeonReflection)}
              poster="/images/aeon/reflection/waymo-poster.jpg"
              preload="none"
              playsInline
              controls={playing}
              muted
              aria-label="A Waymo ride that sparked ideas for AEON’s HUD"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onError={() => setVideoError(true)}
            />
            {!playing && !videoError && (
              <button type="button" className={styles.playButton}
                aria-label="Play Waymo ride video"
                onClick={() => { void videoRef.current?.play().catch(() => setVideoError(true)); }}>
                <span><Play size={17} fill="currentColor" /> Play moment <small>0:06</small></span>
              </button>
            )}
            {videoError && (
              <a className={styles.videoFallback} href={r2Url(R2_MEDIA.aeonReflection)} target="_blank" rel="noreferrer">
                Open Waymo video <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <figcaption className={styles.caption}>
            <span className={styles.label}>03 / The unexpected research</span>
            <p className={styles.title}>mentally wireframing the windshield.</p>
            <p className={styles.description}>One Waymo ride, a whole lot of “what if this were on the HUD?”</p>
          </figcaption>
        </figure>
      </div>

      <dialog ref={dialogRef} className={styles.lightbox} aria-label="AEON behind the scenes photo"
        onClose={() => setSelected(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        {photo && (
          <div className={styles.lightboxContent}>
            <button type="button" className={styles.closeButton} aria-label="Close photo" onClick={() => setSelected(null)}>
              <X size={22} />
            </button>
            <Image src={photo.src} alt={photo.alt} width={1920} height={1280} sizes="90vw" />
            <p>{photo.title}</p>
          </div>
        )}
      </dialog>
    </div>
  );
}
