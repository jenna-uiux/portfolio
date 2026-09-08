'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';

function LetterLine({ text }: { text: string }) {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function move(event: PointerEvent<HTMLSpanElement>) {
    const line = event.currentTarget;
    const x = event.clientX;
    const y = event.clientY;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      for (const letter of line.querySelectorAll<HTMLElement>('.letter')) {
        const r = letter.getBoundingClientRect();
        const dx = x - (r.left + r.width / 2);
        const dy = y - (r.top + r.height / 2);
        const weight = Math.max(0, 1 - Math.hypot(dx, dy * 0.65) / 105);
        letter.style.transform = `translate3d(${dx * weight * 0.035}px,${-weight * 9}px,0) rotate(${dx * weight * 0.025}deg)`;
      }
    });
  }

  function leave(event: PointerEvent<HTMLSpanElement>) {
    cancelAnimationFrame(frame.current);
    for (const letter of event.currentTarget.querySelectorAll<HTMLElement>(
      '.letter',
    ))
      letter.style.transform = '';
  }

  return (
    <span
      className="letter-line"
      aria-label={text}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <span aria-hidden="true">
        {Array.from(text).map((char, index) => (
          <span className="letter" key={index}>
            {char === ' ' ? '\u00a0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}

function ChangingWord({ want }: { want: boolean }) {
  const target = want ? 'want' : 'need';
  const [display, setDisplay] = useState(target);
  const [binary, setBinary] = useState<{ value: string; opacity: number }[]>([]);
  const [phase, setPhase] = useState<'idle' | 'charge' | 'decode' | 'land'>(
    'idle',
  );
  const previousTarget = useRef(target);

  useEffect(() => {
    if (previousTarget.current === target) return;
    previousTarget.current = target;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target);
      return;
    }

    setPhase('charge');
    let digits: number | undefined;
    const decode = window.setTimeout(() => {
      setPhase('decode');
      const scramble = () => setBinary(
        Array.from({ length: 8 }, () => ({
          value: Math.random() > 0.5 ? '1' : '0',
          opacity: 0.3 + Math.random() * 0.7,
        })),
      );
      scramble();
      digits = window.setInterval(scramble, 40);
    }, 100);
    const land = window.setTimeout(() => {
      if (digits) window.clearInterval(digits);
      setDisplay(target);
      setPhase('land');
    }, 900);
    const idle = window.setTimeout(() => setPhase('idle'), 1250);
    return () => {
      window.clearTimeout(decode);
      window.clearTimeout(land);
      window.clearTimeout(idle);
      if (digits) window.clearInterval(digits);
    };
  }, [target]);

  return (
    <span className={`changing-word phase-${phase}`}>
      <span className="word-sizer" aria-hidden="true">want</span>
      <span className="word-sizer" aria-hidden="true">need</span>
      <span className="word-glyph" aria-hidden="true">
        {phase === 'decode'
          ? binary.map((digit, index) => (
              <span key={index} style={{ opacity: digit.opacity }}>{digit.value}</span>
            ))
          : display}
      </span>
      <span className="word-echo" aria-hidden="true">
        {target}
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {target}
      </span>
    </span>
  );
}

export function InteractiveHeadline({ want }: { want: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const headline = root.current;
    if (!headline) return;
    const element = headline;
    function move(event: globalThis.PointerEvent) {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        element.style.setProperty('--headline-x', `${x * 8}px`);
        element.style.setProperty('--headline-y', `${y * 5}px`);
      });
    }
    function leave() {
      element.style.setProperty('--headline-x', '0px');
      element.style.setProperty('--headline-y', '0px');
    }
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div className="headline" ref={root}>
      <h1>
        <span className="headline-entry">
          <LetterLine text="I design and build" />
        </span>
        <br />
        <span className="second-line headline-entry">
          <LetterLine text="what you" /> <ChangingWord want={want} />
        </span>
      </h1>
    </div>
  );
}
