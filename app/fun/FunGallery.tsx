"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { r2Url } from "@/lib/media";
import { funItems, funRows, type FunItem } from "./items";
import styles from "./fun.module.css";
import { ImmersiveView } from "./ImmersiveView";
import { AwardBadge } from "./AwardBadge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function PreviewVideo({ item, paused }: { item: FunItem; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); loadObserver.disconnect(); }
    }, { rootMargin: "250px" });
    const playObserver = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: 0.1 });
    loadObserver.observe(video);
    playObserver.observe(video);
    return () => { loadObserver.disconnect(); playObserver.disconnect(); };
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !near) return;
    const sync = () => {
      if (visible && !paused && !document.hidden) {
        video.muted = true;
        void video.play().catch(() => { /* The poster remains when autoplay is blocked. */ });
      } else video.pause();
    };
    sync();
    video.addEventListener("loadeddata", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      video.pause();
      video.removeEventListener("loadeddata", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [near, visible, paused]);

  return <>
    <video
      ref={ref} src={near ? r2Url(`fun/${item.video}`) : undefined}
      poster={`/images/fun/${item.video?.replace(".mp4", ".jpg")}`}
      muted loop playsInline preload="none" aria-hidden="true"
      onError={() => setFailed(true)}
    />
    {failed && <span className={styles.loadNote}>Preview unavailable</span>}
  </>;
}

function ItemCaption({ item }: { item: FunItem }) {
  return <div className={styles.caption}>
    {item.highlight && <AwardBadge label={item.highlight} />}
    <h2>{item.title}</h2>
    <p className={styles.description}>{item.description}</p>
    <ul className={styles.tags} aria-label={`${item.title} tags`}>
      {item.tags?.map(tag => <li key={tag}>{tag}</li>)}
    </ul>
    {item.href && <a className={styles.projectCta} href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.linkLabel} (opens in a new tab)`}>
      {item.linkLabel}<ArrowUpRight size={14} aria-hidden="true" />
    </a>}
  </div>;
}

export function FunGallery() {
  const page = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [selected, setSelected] = useState<FunItem | null>(null);
  const [youtubePlaying, setYoutubePlaying] = useState(false);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [immersiveIndex, setImmersiveIndex] = useState<number | null>(null);
  const pointerType = useRef("mouse");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: "(min-width: 701px)",
      mobile: "(max-width: 700px)",
      reduce: "(prefers-reduced-motion: reduce)",
    }, context => {
      if (!page.current) return;
      // Layout cards stay fixed; only their clipped media surface moves.
      gsap.set(page.current.querySelectorAll("article"), { clearProps: "opacity,transform" });
      if (context.conditions?.reduce) return;

      const desktop = context.conditions?.desktop;
      const groups = page.current.querySelectorAll<HTMLElement>(desktop ? "[data-gallery-row]" : "article");
      groups.forEach(group => {
        const cards = desktop ? Array.from(group.querySelectorAll<HTMLElement>("article")) : [group];
        const surfaces = cards.map(card => card.firstElementChild as HTMLElement);
        const setY = gsap.quickSetter(surfaces, "y", "px");
        const reveal = gsap.to(surfaces, {
          y: 0, duration: 0.9, ease: "power2.out", paused: true,
          stagger: desktop ? 0.08 : 0,
        });
        const enter = (direction: number) => {
          reveal.pause();
          setY(direction * (desktop ? 36 : 28));
          reveal.invalidate().restart();
        };
        const leave = () => { reveal.pause(); setY(0); };
        // One controller per fixed row/card: no competing reset trigger or
        // transformed trigger bounds when the scroll direction changes.
        ScrollTrigger.create({
          trigger: group, start: "top bottom", end: "bottom top",
          onEnter: () => enter(1),
          onEnterBack: () => enter(-1),
          onLeave: leave,
          onLeaveBack: leave,
        });
      });
    }, page);
    return () => media.revert();
  }, { scope: page });

  useEffect(() => {
    if (!revealed) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(`[id="${revealed}"]`)) setRevealed(null);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [revealed]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(preference.matches);
    const changed = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", changed);
    return () => preference.removeEventListener("change", changed);
  }, []);

  useEffect(() => {
    if (!selected || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus();
    };
  }, [selected]);

  const open = (item: FunItem, target: HTMLElement) => {
    trigger.current = target.closest("article")?.querySelector<HTMLButtonElement>(`button.${styles.mediaButton}`) ?? target;
    setSelected(item);
  };

  const watch = (item: FunItem, target: HTMLElement) => {
    if (item.youtube) setYoutubePlaying(true);
    else open(item, target);
  };

  const activate = (item: FunItem, target: HTMLElement) => {
    if (pointerType.current === "touch" && item.tags && revealed !== item.id) {
      setRevealed(item.id);
      return;
    }
    watch(item, target);
  };

  return <div ref={page} className={`container-ultra ${styles.page}`}>
    <header className={styles.header}>
      <h1 aria-label="Things I made">
        <span className={styles.promptMark} aria-hidden="true">&gt;</span>Things I made<span className="prompt-cursor" aria-hidden="true">_</span>
      </h1>
      <button type="button" className={styles.immersiveButton} aria-label="Immersive view" onClick={() => {
        const ordered = funRows.flatMap(row => [...row.items]);
        const visible = ordered.findIndex(id => {
          const rect = document.getElementById(id)?.getBoundingClientRect();
          return rect && rect.bottom > 100 && rect.top < window.innerHeight * .8;
        });
        setYoutubePlaying(false);
        setImmersiveIndex(Math.max(0, visible));
      }}>
        <span>Immersive view</span>
        <Maximize2 size={15} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </header>

    <div className={styles.gallery}>
      {funRows.map((row, rowIndex) => <div className={`${styles.row} ${styles[row.layout]}`} key={rowIndex} data-gallery-row>
        {row.items.map(key => {
          const item = funItems[key];
          const isPrint = !item.video && !item.youtube;
          const isPlaying = !!item.youtube && youtubePlaying;
          return <article key={item.id} className={styles.card} id={item.id}
            data-revealed={revealed === item.id} data-playing={isPlaying}
            style={{ "--media-ratio": item.ratio } as CSSProperties}>
            <div className={`${styles.media} ${isPrint ? styles.print : ""}`}>
              {isPlaying ? <>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=1&playsinline=1`}
                  title={item.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
                />
                <button className={styles.stopYoutube} onClick={() => setYoutubePlaying(false)} aria-label="Close music video"><X size={16} /></button>
              </> : <button type="button" className={styles.mediaButton}
              onPointerDown={event => { pointerType.current = event.pointerType; }}
              onKeyDown={() => { pointerType.current = "keyboard"; }}
              onClick={event => activate(item, event.currentTarget)} aria-label={`${isPrint ? "Enlarge" : "Watch"} ${item.title}`}>
              {item.video ? <PreviewVideo item={item} paused={reducedMotion || !!selected || youtubePlaying || immersiveIndex !== null} /> :
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.image} alt={item.description} loading="lazy"
                  width={item.youtube ? 1280 : 832} height={item.youtube ? 720 : 1248} />}
              {isPrint && <span className={styles.hoverAction} aria-hidden="true"><Maximize2 size={18} /></span>}
            </button>}
            {!isPrint && !isPlaying && <ItemCaption item={item} />}
            </div>
          </article>;
        })}
      </div>)}
    </div>

    {immersiveIndex !== null && <ImmersiveView initialIndex={immersiveIndex} reducedMotion={reducedMotion}
      onClose={() => setImmersiveIndex(null)} />}

    {selected && <dialog ref={dialog} className={styles.dialog} aria-labelledby="fun-dialog-title"
      onCancel={() => setSelected(null)}
      onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      <div className={styles.dialogContent}>
        <button type="button" className={styles.close} onClick={() => setSelected(null)} aria-label="Close viewer" autoFocus><X size={22} /></button>
        {selected.video ? <video key={selected.id} src={r2Url(`fun/${selected.video}`)}
          controls autoPlay playsInline className={styles.fullMedia} aria-label={selected.title} /> :
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={selected.image} alt={selected.description} className={styles.fullMedia} />}
        <div className={styles.dialogCaption}>
          <h2 id="fun-dialog-title">{selected.title}</h2>
          {selected.tags && <p>{selected.description}</p>}
          {selected.details && <p className={styles.details}>{selected.details}</p>}
          {selected.tags && <ul className={styles.tags}>{selected.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
          {selected.href && <a href={selected.href} target="_blank" rel="noreferrer">{selected.linkLabel} <ArrowUpRight size={15} /></a>}
          {selected.storyHref && <a href={selected.storyHref} target="_blank" rel="noreferrer">Behind the project <ArrowUpRight size={15} /></a>}
          {selected.id === "vibemaker" && <a href="mailto:vibemaker.ai@gmail.com">Send your photo <ArrowUpRight size={15} /></a>}
        </div>
      </div>
    </dialog>}
  </div>;
}
