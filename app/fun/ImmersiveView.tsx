"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Play, X } from "lucide-react";
import { r2Url } from "@/lib/media";
import { funItems, funRows } from "./items";
import styles from "./immersive.module.css";
import { AwardBadge } from "./AwardBadge";

const items = funRows.flatMap(row => row.items.map(key => funItems[key]));

export function ImmersiveView({ initialIndex, reducedMotion, onClose }: {
  initialIndex: number; reducedMotion: boolean; onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(reducedMotion);
  const [failed, setFailed] = useState(false);
  const [youtubeStarted, setYoutubeStarted] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closingRef = useRef(false);
  const lockedUntil = useRef(0);
  const wheel = useRef({ last: 0, sum: 0 });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = items[index];
  const poster = item.video ? `/images/fun/${item.video.replace(".mp4", ".jpg")}` : item.image;
  const ratio = item.ratio.split("/").map(Number).reduce((a, b) => a / b);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (reducedMotion) { onClose(); return; }
    setPaused(true);
    setClosing(true);
    closeTimer.current = setTimeout(onClose, 460);
  }, [onClose, reducedMotion]);

  const move = useCallback((direction: number) => {
    if (closingRef.current || performance.now() < lockedUntil.current) return;
    lockedUntil.current = performance.now() + 650;
    setIndex(current => Math.max(0, Math.min(items.length - 1, current + direction)));
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    element.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const now = performance.now();
      const idle = now - wheel.current.last > 140;
      wheel.current.last = now;
      if (idle) wheel.current.sum = 0;
      if (now < lockedUntil.current) { wheel.current.sum = 0; return; }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.sign(delta) !== Math.sign(wheel.current.sum)) wheel.current.sum = 0;
      wheel.current.sum += delta;
      if (Math.abs(wheel.current.sum) >= 40) {
        move(Math.sign(wheel.current.sum));
        // A bounded cooldown replaces the gesture latch that swallowed later scrolls.
        wheel.current.sum = 0;
      }
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      clearTimeout(closeTimer.current);
      element.removeEventListener("wheel", onWheel);
      element.close();
      document.body.style.overflow = previousOverflow;
      focused?.focus({ preventScroll: true });
    };
  }, [move]);

  useEffect(() => {
    setFailed(false);
    setYoutubeStarted(false);
  }, [index]);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = true;
    const sync = () => {
      if (paused || document.hidden) element.pause();
      else void element.play().catch((error: unknown) => {
        // React cleanup can interrupt an outstanding play request during mounting.
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPaused(true);
      });
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { element.pause(); document.removeEventListener("visibilitychange", sync); };
  }, [index, paused]);

  useEffect(() => {
    if (reducedMotion) setPaused(true);
  }, [reducedMotion]);

  useEffect(() => {
    // Use the already-decoded video; no second video stream or pixel readback.
    const surface = canvas.current;
    const element = video.current;
    const context = surface?.getContext("2d");
    if (!surface || !element || !context || reducedMotion || paused) return;
    let frame = 0;
    let last = 0;
    const draw = (time: number) => {
      if (!document.hidden && element.readyState >= 2 && time - last > 83) {
        context.drawImage(element, 0, 0, surface.width, surface.height);
        last = time;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [index, reducedMotion, paused]);

  return <dialog ref={dialog} className={styles.room} aria-label="Immersive project viewer" tabIndex={-1}
    data-closing={closing}
    onCancel={event => { event.preventDefault(); close(); }}
    onKeyDown={event => {
      if (closingRef.current) return;
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        setIndex(event.key === "Home" ? 0 : items.length - 1);
        return;
      }
      if (["ArrowDown", "ArrowRight", "PageDown", "ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        move(["ArrowDown", "ArrowRight", "PageDown"].includes(event.key) ? 1 : -1);
      }
    }}
    onTouchStart={event => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY }; }}
    onTouchEnd={event => {
      const start = touch.current; touch.current = null;
      if (!start) return;
      const point = event.changedTouches[0];
      const delta = start.y - point.clientY;
      if (Math.abs(delta) > 55 && Math.abs(delta) > Math.abs(start.x - point.clientX)) move(Math.sign(delta));
    }}>
    <div className={styles.atmosphere} aria-hidden="true">
    <div className={styles.ambient} style={{ backgroundImage: `url("${poster}")` }}>
      {item.video && !reducedMotion && <canvas key={item.id} ref={canvas} width={96} height={54} />}
    </div>
    </div>
    <div className={styles.vignette} aria-hidden="true" />
    <div className={styles.topbar}>
      <span className={styles.mode} aria-hidden="true"><span className={styles.promptMark}>&gt;</span>Things I made_</span>
      <button onClick={close} aria-label="Close immersive view"><span className={styles.backLabel}>Back to gallery</span> <X size={17} /></button>
    </div>
    <div className={styles.stage}>
    <div key={item.id} className={styles.scene} style={{ "--ratio": ratio } as CSSProperties}>
      {item.video ? <video ref={video} src={r2Url(`fun/${item.video}`)} poster={poster}
        muted loop playsInline preload="auto" aria-label={item.title}
        onError={() => setFailed(true)} /> : youtubeStarted ?
        <iframe src={`https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=1&playsinline=1&mute=1`}
          title={item.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin" /> :
        <button className={styles.youtubePoster} onClick={() => setYoutubeStarted(true)} aria-label="Play music video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt={item.title} />
          <span><Play size={18} /> Play music video</span>
        </button>}
      {failed && <div className={styles.error}>This preview couldn’t load. Try another project or reopen this view.</div>}
    </div>
    </div>
    <div className={styles.info}>
      <div>
        {item.highlight && <AwardBadge label={item.highlight} />}
        <h2>{item.href ? <a className={styles.titleLink} href={item.href} target="_blank" rel="noreferrer"
          aria-label={`${item.title} — ${item.linkLabel} (opens in a new tab)`} title={item.linkLabel}>
          <span>{item.title}</span>{"\u00a0"}<ArrowUpRight aria-hidden="true" />
        </a> : item.title}</h2>
      </div>
      <div className={styles.description}>
        <p>{item.description}</p>
      </div>
      <div className={styles.projectMeta}>
        <div className={styles.tags}>{item.tags?.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
    </div>
    <footer className={styles.bottom}>
      <span className={styles.hint}>Scroll or use <ArrowUp size={13} aria-label="up" /> <ArrowDown size={13} aria-label="down" /></span>
      <nav className={styles.navigation} aria-label="Immersive projects">
        <button onClick={() => move(-1)} disabled={index === 0} aria-label="Previous project"><ArrowUp size={17} /></button>
        <span className={styles.count} aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, "0")} / {items.length}</span>
        <button onClick={() => move(1)} disabled={index === items.length - 1} aria-label="Next project"><ArrowDown size={17} /></button>
      </nav>
    </footer>
    <span className={styles.announcement} aria-live="polite">{item.title}</span>
  </dialog>;
}
