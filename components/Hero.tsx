'use client';
import { useEffect, useRef, useState } from 'react';
import { BinaryWorld } from './hero/BinaryWorld';
import { InteractiveHeadline } from './hero/InteractiveHeadline';
import styles from './hero/Hero.module.css';

export function Hero() {
  const energy = useRef(0),
    audio = useRef<{
      stream: MediaStream;
      ctx: AudioContext;
      frame: number;
    } | null>(null),
    request = useRef(0);
  const [voice, setVoice] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState(''),
    [want, setWant] = useState(false),
    [visible, setVisible] = useState(true);
  const stop = () => {
    const a = audio.current;
    if (a) {
      cancelAnimationFrame(a.frame);
      a.stream.getTracks().forEach((t) => t.stop());
      void a.ctx.close();
    }
    audio.current = null;
    energy.current = 0;
  };
  async function toggle(on: boolean) {
    const id = ++request.current;
    if (!on) {
      stop();
      setVoice(false);
      return;
    }
    setPending(true);
    setError('');
    let stream: MediaStream | null = null;
    let context: AudioContext | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (id !== request.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      context = new AudioContext();
      await context.resume();
      if (id !== request.current) {
        stream.getTracks().forEach((t) => t.stop());
        void context.close();
        return;
      }
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(256);
      audio.current = { stream, ctx: context, frame: 0 };
      const update = () => {
        if (!audio.current) return;
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++)
          sum += ((samples[i] - 128) / 128) ** 2;
        energy.current +=
          (Math.min(1, Math.sqrt(sum / 256) * 5) - energy.current) * 0.18;
        audio.current.frame = requestAnimationFrame(update);
      };
      update();
      setVoice(true);
    } catch {
      stream?.getTracks().forEach((t) => t.stop());
      if (context) void context.close();
      stop();
      setVoice(false);
      setError(
        'Microphone unavailable. You can still interact with your cursor.',
      );
    } finally {
      if (id === request.current) setPending(false);
    }
  }
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (!visible || matchMedia('(prefers-reduced-motion:reduce)').matches)
      return;
    const id = setTimeout(() => {
      if (!document.hidden) setWant((v) => !v);
    }, 5000);
    return () => clearTimeout(id);
  }, [want, visible]);
  useEffect(
    () => () => {
      request.current++;
      stop();
    },
    [],
  );
  return (
    <section className={styles.root} aria-label="Introduction">
      <BinaryWorld energy={energy} />
      <InteractiveHeadline want={want} />
      <a className={styles.scrollCue} href="#work" aria-label="Selected work">
        <span aria-hidden="true">↓</span>
      </a>
      <div className="voice">
        <div className="voice-switch">
          <button
            type="button"
            role="switch"
            id="hero-voice"
            aria-label="Sound Reactive"
            aria-checked={voice}
            aria-busy={pending}
            disabled={pending}
            data-slot="switch"
            data-checked={voice ? '' : undefined}
            onClick={() => void toggle(!voice)}
          >
            <span className={'switch-label ' + (voice ? 'on' : '')} aria-hidden="true">
              {pending ? '…' : voice ? 'ON' : 'OFF'}
            </span>
            <span data-slot="switch-thumb" data-checked={voice ? '' : undefined} aria-hidden="true">
              <span className="sound-icon"><i /><i /><i /><i /><i /></span>
            </span>
          </button>
        </div>
        <label htmlFor="hero-voice">Sound Reactive</label>
        <p className="voice-status" aria-live="polite">
          {error || (voice ? 'Listening · nothing recorded' : '')}
        </p>
      </div>
    </section>
  );
}
