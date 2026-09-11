"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { R2_MEDIA, r2Url } from "@/lib/media";

const TRACKS = [
  {
    id: "floating-lights",
    title: "Floating Lights",
    src: r2Url(R2_MEDIA.aeonFloatingLights),
  },
  {
    id: "gliding-through-the-mist",
    title: "Gliding Through the Mist",
    src: r2Url(R2_MEDIA.aeonGlidingThroughTheMist),
  },
  {
    id: "silver-glider",
    title: "Silver Glider",
    src: r2Url(R2_MEDIA.aeonSilverGlider),
  },
] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AeonMoodSoundBoard() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [armed, setArmed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setArmed(true);
          setActiveId((current) => current ?? TRACKS[0].id);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      const currentIndex = TRACKS.findIndex(
        (track) => track.id === activeIdRef.current,
      );
      const next = TRACKS[currentIndex + 1];
      if (!next) {
        setIsPlaying(false);
        setProgress(0);
        return;
      }

      audio.src = next.src;
      activeIdRef.current = next.id;
      setActiveId(next.id);
      setProgress(0);
      setDuration(0);
      void audio.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      });
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  const playTrack = async (id: string, src: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeId === id && audio.src) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        setHasStarted(true);
      }
      return;
    }

    audio.src = src;
    activeIdRef.current = id;
    setActiveId(id);
    setProgress(0);
    setDuration(0);
    await audio.play();
    setIsPlaying(true);
    setHasStarted(true);
  };

  const seek = (id: string, value: number) => {
    const audio = audioRef.current;
    if (!audio || activeId !== id) return;
    audio.currentTime = value;
    setProgress(value);
  };

  return (
    <section
      ref={sectionRef}
      className="not-prose text-[#f2f2f2]"
      aria-label="AEON moodboard and soundboard"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,1fr)] lg:items-stretch lg:gap-6">
        <figure className="m-0">
          <p className="mb-4 text-[13px] font-medium tracking-[0.04em] text-white/70">
            Moodboard
          </p>
          <div className="relative aspect-[5780/3436] overflow-hidden rounded-none bg-black">
            <Image
              src="/images/aeon/ia/visual-language/Moodboard.jpg"
              alt="AEON visual language moodboard with metallic, aerodynamic, and water forms"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 52vw, 100vw"
            />
          </div>
        </figure>

        <div className="flex min-w-0 flex-col">
          <p className="mb-4 text-[13px] font-medium tracking-[0.04em] text-white/70">
            <a
              href="https://youtu.be/YVOA1h6iL3Q?si=MI5TbsuCVMJLfqBF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              Soundboard
              <span aria-hidden className="text-[11px] leading-none">
                ↗
              </span>
            </a>
          </p>
          <div className="flex flex-1 flex-col justify-between border-t border-white/10">
            {TRACKS.map((track) => {
              const isActive = activeId === track.id;
              const playing = isActive && isPlaying;
              const waitingToStart =
                armed &&
                !hasStarted &&
                isActive &&
                !isPlaying &&
                track.id === TRACKS[0].id;
              const value = isActive ? progress : 0;
              const max = isActive && duration > 0 ? duration : 0;

              return (
                <div
                  key={track.id}
                  className="flex flex-1 flex-col justify-center border-b border-white/10 py-5"
                >
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => playTrack(track.id, track.src)}
                      className={[
                        "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                        playing
                          ? "border-white/70 bg-white/10 text-white"
                          : waitingToStart
                            ? "animate-pulse border-white/55 bg-white/10 text-white"
                            : "border-white/20 text-white hover:border-white/50 hover:bg-white/10",
                      ].join(" ")}
                      aria-label={
                        playing ? `Pause ${track.title}` : `Play ${track.title}`
                      }
                    >
                      {playing ? (
                        <span className="flex h-3 w-3 items-center justify-center gap-[3px]">
                          <span className="h-full w-[2px] bg-current" />
                          <span className="h-full w-[2px] bg-current" />
                        </span>
                      ) : (
                        <span className="ml-0.5 block h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          "truncate text-[15px] tracking-[-0.01em] transition-colors duration-300",
                          isActive ? "text-white" : "text-white/70",
                        ].join(" ")}
                        style={{ fontFamily: "Aspekta, sans-serif" }}
                      >
                        {track.title}
                      </p>
                      <input
                        type="range"
                        min={0}
                        max={max || 1}
                        step={0.1}
                        value={value}
                        onChange={(event) =>
                          seek(track.id, Number(event.target.value))
                        }
                        className="mt-3 h-[2px] w-full cursor-pointer appearance-none bg-white/15 accent-white [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        aria-label={`${track.title} playback position`}
                      />
                      <p className="mt-2 text-[10px] tracking-[0.04em] text-white/35">
                        {isActive
                          ? `${formatTime(progress)} / ${formatTime(duration)}`
                          : "Suno · AEON"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
