"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

import s from "./SoundToggle.module.css";

const TARGET_VOLUME = 0.4;

export type SoundToggleHandle = {
  enableSound: () => void;
};

export const SoundToggle = forwardRef<SoundToggleHandle, object>(
  function SoundToggle(_, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [on, setOn] = useState(false);
    const onRef = useRef(false);
    onRef.current = on;

    useEffect(() => {
      if (!audioRef.current) {
        const a = new Audio("/media/audio/ocean.mp3");
        a.loop = true;
        a.preload = "metadata";
        a.volume = 0;
        audioRef.current = a;
      }
      return () => {
        const a = audioRef.current;
        if (a) {
          a.pause();
          a.src = "";
          audioRef.current = null;
        }
      };
    }, []);

    const enableSound = () => {
      const a = audioRef.current;
      if (!a || onRef.current) return;
      a.play().catch(() => {});
      gsap.to(a, {
        volume: TARGET_VOLUME,
        duration: 1.2,
        ease: "power2.out",
      });
      setOn(true);
    };

    useImperativeHandle(ref, () => ({
      enableSound,
    }));

    const toggle = () => {
      const a = audioRef.current;
      if (!a) return;
      if (!on) {
        enableSound();
      } else {
        gsap.to(a, {
          volume: 0,
          duration: 1.2,
          ease: "power2.out",
          onComplete: () => a.pause(),
        });
        setOn(false);
      }
    };

    return (
      <button
        type="button"
        className={s.btn}
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Mute ambient sound" : "Play ambient sound"}
        data-on={on ? "true" : "false"}
      >
        <span className={s.label}>{on ? "Sound on" : "Sound off"}</span>
        <svg
          className={s.icon}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M3 6h2.5L9 3v10L5.5 10H3z"
            fill="currentColor"
            stroke="none"
          />
          <path className={s.wave} d="M11.2 5.4c1.1 1.4 1.1 3.8 0 5.2" />
          <path
            className={s.wave}
            d="M12.8 3.8c2 2.4 2 6 0 8.4"
            opacity="0.7"
          />
          <line
            className={s.slash}
            x1="11"
            y1="4"
            x2="14.5"
            y2="12"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>
    );
  }
);
