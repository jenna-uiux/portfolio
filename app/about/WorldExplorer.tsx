"use client";

import { useEffect, useRef } from "react";
import { MindWorld } from "./_mindworld/MindWorld";
import s from "./about.module.css";

export function WorldExplorer({ onClose, onScrollToSummary }: {
  onClose: () => void;
  onScrollToSummary: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let wheelDistance = 0;
    let lastWheelTime = 0;
    let leaving = false;
    let touchStart: { x: number; y: number } | null = null;
    const canLeave = () =>
      dialog.querySelector('[data-phase="map"]') !== null &&
      dialog.scrollTop + dialog.clientHeight >= dialog.scrollHeight - 4;
    const leave = () => {
      if (leaving) return;
      leaving = true;
      onScrollToSummary();
    };
    const onWheel = (event: WheelEvent) => {
      // Let mobile lists and island details keep their own scrolling.
      if (event.ctrlKey || event.deltaY <= 0 || Math.abs(event.deltaX) > event.deltaY || !canLeave()) {
        wheelDistance = 0;
        return;
      }
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelTime > 240) wheelDistance = 0;
      lastWheelTime = now;
      wheelDistance += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? dialog.clientHeight : 1);
      if (wheelDistance >= 100) leave();
    };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      touchStart = event.touches.length === 1 && canLeave() ? { x: touch.clientX, y: touch.clientY } : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touchStart || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const distance = touchStart.y - touch.clientY;
      if (distance > 0 && distance > Math.abs(touchStart.x - touch.clientX) && canLeave()) {
        event.preventDefault();
        if (distance >= 64) leave();
      }
    };
    const onTouchEnd = () => { touchStart = null; };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select')) return;
      if (!event.shiftKey && ["PageDown", "ArrowDown", " "].includes(event.key) && canLeave()) {
        event.preventDefault();
        leave();
      }
    };
    dialog.addEventListener("wheel", onWheel, { passive: false });
    dialog.addEventListener("touchstart", onTouchStart, { passive: true });
    dialog.addEventListener("touchmove", onTouchMove, { passive: false });
    dialog.addEventListener("touchend", onTouchEnd);
    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("wheel", onWheel);
      dialog.removeEventListener("touchstart", onTouchStart);
      dialog.removeEventListener("touchmove", onTouchMove);
      dialog.removeEventListener("touchend", onTouchEnd);
      dialog.removeEventListener("keydown", onKeyDown);
    };
  }, [onScrollToSummary]);

  return (
    <dialog
      ref={dialogRef}
      className={s.explorer}
      aria-label="Explore Jihyeon's Mind World"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <MindWorld startExploring onExit={onClose} />
    </dialog>
  );
}
