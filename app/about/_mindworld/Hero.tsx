"use client";

import s from "./Hero.module.css";

type Props = {
  ready: boolean;
  visible: boolean;
  onExplore: () => void;
};

export function Hero({ ready, visible, onExplore }: Props) {
  return (
    <section
      className={[s.wrap, ready ? s.ready : "", visible ? s.visible : ""].join(" ")}
      aria-hidden={!visible || !ready}
      inert={!visible || !ready}
    >
      <div className={s.inner}>
        <p className={s.eyebrow}>About Me</p>
        <h1 className={s.headline}>
          <span>The world</span>
          <span>behind my work.</span>
        </h1>
        <div className={s.ctaWrap}>
          <button type="button" className={s.cta} onClick={onExplore}>
            <span>Explore Islands</span>
            <span className={s.arrow} aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
