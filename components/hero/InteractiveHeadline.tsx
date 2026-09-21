'use client';
import { useEffect, useRef, type MutableRefObject } from 'react';
import type { HeadlineInteraction } from './interaction';

export function InteractiveHeadline({ interaction }: {
  interaction: MutableRefObject<HeadlineInteraction>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const light = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = root.current!;
    const title = heading.current!;
    const anchor = word.current!;
    const halo = light.current!;
    const hero = container.closest('section')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const state = interaction.current;
    let frame = 0, last = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    let lightX = 0, lightY = 0, targetLightX = 0, targetLightY = 0;
    let presence = 0, targetPresence = 0;
    let wordX = 0, wordY = 0;
    let bounds = container.getBoundingClientRect();
    let heroBounds = hero.getBoundingClientRect();

    const measure = () => {
      bounds = container.getBoundingClientRect();
      heroBounds = hero.getBoundingClientRect();
      const rect = anchor.getBoundingClientRect();
      // Subtract the title's translation so pointer targets never chase their own motion.
      wordX = rect.left + rect.width / 2 - x;
      wordY = rect.top + rect.height / 2 - y;
    };
    const paint = () => {
      title.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const sourceX = wordX + x + lightX;
      const sourceY = wordY + y + lightY;
      halo.style.left = `${sourceX - heroBounds.left}px`;
      halo.style.top = `${sourceY - heroBounds.top}px`;
      halo.style.opacity = String(0.13 + presence * 0.87);
      halo.style.transform = `translate(-50%, -50%) scale(${0.82 + presence * 0.18})`;
      state.x = sourceX;
      state.y = sourceY;
      state.light = motion.matches ? 0 : presence;
    };
    const render = (now: number) => {
      frame = 0;
      const dt = Math.min((now - last) / 1000 || 1 / 60, 0.05);
      last = now;
      const follow = 1 - Math.exp(-dt * 9);
      // Fast enough to connect to the hand; a longer fade leaves a short afterglow.
      const fade = 1 - Math.exp(-dt * (targetPresence > presence ? 11 : 6));
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      lightX += (targetLightX - lightX) * follow;
      lightY += (targetLightY - lightY) * follow;
      presence += (targetPresence - presence) * fade;
      paint();
      const distance = Math.abs(targetX - x) + Math.abs(targetY - y) +
        Math.abs(targetLightX - lightX) + Math.abs(targetLightY - lightY);
      if (distance > 0.02 || Math.abs(targetPresence - presence) > 0.001) {
        frame = requestAnimationFrame(render);
      }
    };
    const wake = () => {
      if (frame || motion.matches || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      if (motion.matches) return;
      measure();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      // The two lines move as one intact composition, with no letter distortion.
      targetX = event.pointerType === 'touch' ? 0 : 24 * Math.tanh((event.clientX - centerX) / 260);
      targetY = event.pointerType === 'touch' ? 0 : 14 * Math.tanh((event.clientY - centerY) / 150);
      const dx = event.clientX - wordX, dy = event.clientY - wordY;
      const distance = Math.hypot(dx, dy * 1.2);
      const near = Math.max(0, Math.min(1, (320 - distance) / 240));
      targetPresence = near * near * (3 - 2 * near);
      targetLightX = Math.max(-110, Math.min(110, dx)) * targetPresence;
      targetLightY = Math.max(-70, Math.min(70, dy)) * targetPresence;
      wake();
    };
    const leave = () => {
      targetX = targetY = targetLightX = targetLightY = targetPresence = 0;
      wake();
    };
    const up = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') leave();
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      x = y = targetX = targetY = lightX = lightY = targetLightX = targetLightY = 0;
      presence = targetPresence = 0;
      title.style.transform = '';
      measure();
      paint();
    };
    const visibility = () => { if (document.hidden) reset(); };
    const observer = new ResizeObserver(reset);
    observer.observe(container);
    observer.observe(anchor);
    reset();
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerdown', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', leave);
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('resize', reset);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      state.light = 0;
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerdown', move);
      hero.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', leave);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('resize', reset);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', reset);
    };
  }, [interaction]);

  return (
    <>
      <span className="headline-light" ref={light} aria-hidden="true" />
      <div className="headline" ref={root}>
        <h1 ref={heading}>
          <span className="headline-entry">I design and build intuitive ways</span>
          <br />
          <span className="second-line headline-entry">
            for people to <span className="interact-word" ref={word}>interact</span> with AI
          </span>
        </h1>
      </div>
    </>
  );
}
