'use client';
import { useEffect, useRef, useState } from 'react';
import { BinaryWorld } from './hero/BinaryWorld';
import { InteractiveHeadline } from './hero/InteractiveHeadline';
import { createHeadlineInteraction } from './hero/interaction';
import styles from './hero/Hero.module.css';

export function Hero() {
  const interaction = useRef(createHeadlineInteraction());
  const energy = useRef(0),
    audio = useRef<{
      stream: MediaStream;
      ctx: AudioContext;
      frame: number;
    } | null>(null),
    request = useRef(0);
  const [voice, setVoice] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState('');
  const stop = () => {
    const a = audio.current;
    if (a) {
      cancelAnimationFrame(a.frame);
      a.stream.getTracks().forEach((t) => t.stop());
      void a.ctx.close();
    }
    audio.current = null;
    energy.current = 0;
    interaction.current.soundEnabled = false;
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
        const level = Math.min(1, Math.sqrt(sum / 256) * 9);
        energy.current += (level - energy.current) * (level > energy.current ? .4 : .1);
        audio.current.frame = requestAnimationFrame(update);
      };
      update();
      interaction.current.soundEnabled = true;
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
  useEffect(
    () => () => {
      request.current++;
      stop();
    },
    [],
  );
  return (
    <section className={styles.root} aria-label="Introduction">
      <BinaryWorld energy={energy} interaction={interaction} />
      <InteractiveHeadline interaction={interaction} />
      <a className={styles.scrollCue} href="#work" aria-label="Selected work"
        onPointerEnter={() => { interaction.current.scrollPreview = 1; }}
        onPointerLeave={() => { interaction.current.scrollPreview = 0; }}
        onFocus={() => { interaction.current.scrollPreview = 1; }}
        onBlur={() => { interaction.current.scrollPreview = 0; }}
        onClick={(event) => {
          if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            interaction.current.scrollAt = performance.now();
          }
        }}
      >
        <span className={styles.scrollLabel} aria-hidden="true">Selected work</span>
        <span className={styles.scrollArrow} aria-hidden="true">↓</span>
      </a>
      <div className="voice"
        onPointerEnter={() => { interaction.current.soundPreview = 1; }}
        onPointerLeave={() => { interaction.current.soundPreview = 0; }}
        onFocus={() => { interaction.current.soundPreview = 1; }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) interaction.current.soundPreview = 0;
        }}
      >
          <button
            type="button"
            role="switch"
            id="hero-voice"
            aria-label="Sound reactive microphone"
            aria-describedby="hero-voice-caption"
            title={voice ? 'Turn off microphone' : 'Use your microphone to animate the particles'}
            aria-checked={voice}
            aria-busy={pending}
            disabled={pending}
            data-slot="switch"
            data-checked={voice ? '' : undefined}
            onClick={() => void toggle(!voice)}
          >
            <span className="sound-icon" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <span className="switch-label" aria-hidden="true">
              {pending ? 'Connecting' : 'Sound reactive'}
            </span>
          </button>
        <span
          id="hero-voice-caption"
          className={error ? 'voice-error' : 'sr-only'}
          aria-live="polite"
        >
          {error || (pending ? 'Requesting microphone access' : voice ? 'Listening. Make a sound to animate the particles. Nothing recorded.' : 'Enable your microphone to animate the particles with sound.')}
        </span>
      </div>
    </section>
  );
}
