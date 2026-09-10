"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { R2_MEDIA, r2Url } from "@/lib/media";
import styles from "./AeonReflectionMoments.module.css";

const photos = [
  {
    src: "/images/aeon/reflection/team.jpg",
    alt: "Three AEON teammates taking a selfie in front of their vehicle design boards",
    title: "love this team <3",
    caption: "the AEON crew, in person + online. couldn’t have done it without them.",
  },
  {
    src: "/images/aeon/reflection/autodesk.jpg",
    alt: "An online Autodesk session showing a vehicle design walkthrough",
    title: "a little masterclass from Autodesk",
    caption: "getting a walkthrough from the pros. so much to soak in.",
  },
] as const;

export function AeonReflectionMoments() {
  const [selected, setSelected] = useState<number | null>(null);
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
    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden) {
        video.muted = true;
        // Browser autoplay restrictions may leave the poster visible.
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      syncPlayback();
    }, { threshold: [0, 0.35] });
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
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
              <p className={styles.title}>{item.title}</p>
              <p className={styles.description}>{item.caption}</p>
            </figcaption>
          </figure>
        ))}

        <figure className={styles.moment} tabIndex={0} aria-labelledby="waymo-moment-title">
          <div className={styles.videoFrame}>
            <video
              ref={videoRef}
              src={r2Url(R2_MEDIA.aeonReflection)}
              poster="/images/aeon/reflection/waymo-poster.jpg"
              preload="none"
              playsInline
              loop
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              muted
              aria-label="A Waymo ride that sparked ideas for AEON’s HUD"
              onError={() => setVideoError(true)}
            />
            {videoError && (
              <a className={styles.videoFallback} href={r2Url(R2_MEDIA.aeonReflection)} target="_blank" rel="noreferrer">
                Open Waymo video <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <figcaption className={styles.caption}>
            <p id="waymo-moment-title" className={styles.title}>thinking about AEON’s HUD on a Waymo ride</p>
            <p className={styles.description}>figuring out what info I’d want right in front of me.</p>
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
