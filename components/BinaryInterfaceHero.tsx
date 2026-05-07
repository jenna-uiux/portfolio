"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* =========================================================================
   Math helpers
   ========================================================================= */

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothDamp(current: number, target: number, lambda: number, dt: number) {
  const t = 1 - Math.exp(-lambda * dt);
  return lerp(current, target, t);
}

/* =========================================================================
   cursorController
   ========================================================================= */

function createCursorController(mount: HTMLElement) {
  const state = {
    x: 0.62,
    y: 0.45,
    hasMoved: false,
    lastMoveAt: 0,
  };

  const onMove = (e: PointerEvent) => {
    const rect = mount.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    state.x = clamp01((e.clientX - rect.left) / rect.width);
    state.y = clamp01((e.clientY - rect.top) / rect.height);
    state.hasMoved = true;
    state.lastMoveAt = performance.now();
  };

  window.addEventListener("pointermove", onMove, { passive: true });

  return {
    get x() {
      return state.x;
    },
    get y() {
      return state.y;
    },
    get hasMoved() {
      return state.hasMoved;
    },
    /** seconds since the last pointer movement (Infinity until first move) */
    get idleSeconds() {
      if (!state.hasMoved) return Infinity;
      return (performance.now() - state.lastMoveAt) / 1000;
    },
    destroy() {
      window.removeEventListener("pointermove", onMove);
    },
  };
}

/* =========================================================================
   micController
   ========================================================================= */

function createMicController({ fftSize = 1024 }: { fftSize?: number } = {}) {
  const state = {
    supported:
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function",
    permitted: false,
    active: false,
    energy: 0,
  };

  let audioCtx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let stream: MediaStream | null = null;
  let freq: Uint8Array<ArrayBuffer> | null = null;
  let timeDomain: Uint8Array<ArrayBuffer> | null = null;
  let bins: Float32Array | null = null;
  let wave: Float32Array | null = null;
  let lastT = performance.now();

  async function start() {
    if (!state.supported || state.active) return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const Ctx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) throw new Error("AudioContext unsupported");

      audioCtx = new Ctx();
      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = 0.7;
      freq = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      timeDomain = new Uint8Array(analyser.fftSize) as Uint8Array<ArrayBuffer>;
      bins = new Float32Array(analyser.frequencyBinCount);
      wave = new Float32Array(analyser.fftSize);
      source.connect(analyser);

      state.permitted = true;
      state.active = true;
      lastT = performance.now();
    } catch {
      state.active = false;
      state.permitted = false;
    }
  }

  function update() {
    if (!state.active || !analyser || !freq || !bins || !timeDomain || !wave) return null;
    analyser.getByteFrequencyData(freq);
    analyser.getByteTimeDomainData(timeDomain);

    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    let sum = 0;
    const lambda = 22;
    const t = 1 - Math.exp(-lambda * dt);
    for (let i = 0; i < freq.length; i++) {
      const v = freq[i] / 255;
      bins[i] = lerp(bins[i], v, t);
      sum += bins[i];
    }
    const avg = sum / freq.length;
    state.energy = smoothDamp(state.energy, avg, 12, dt);

    // Normalize waveform to [-1, 1] with light smoothing
    const wl = wave.length;
    let rms = 0;
    for (let i = 0; i < wl; i++) {
      const v = (timeDomain[i] - 128) / 128; // [-1..1]
      wave[i] = lerp(wave[i], v, t);
      rms += wave[i] * wave[i];
    }
    rms = Math.sqrt(rms / wl); // 0..~1

    // Make small sounds feel bigger (soft-knee gain curve)
    // - keep it stable (uses dt smoothing above)
    // - compress high inputs a bit to avoid extreme spikes
    const boosted = clamp01(Math.pow(rms * 3.2, 0.62)); // small -> larger
    state.energy = smoothDamp(state.energy, boosted, 18, dt);

    return { bins, wave };
  }

  function stop() {
    if (!state.active && !audioCtx) return;
    state.active = false;
    state.energy = 0;

    try {
      source?.disconnect();
    } catch {
      /* noop */
    }
    source = null;
    analyser = null;
    freq = null;
    timeDomain = null;
    bins = null;
    wave = null;

    if (stream) {
      for (const track of stream.getTracks()) track.stop();
    }
    stream = null;

    if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
    audioCtx = null;
  }

  return { state, start, stop, update };
}

/* =========================================================================
   particleMorphController
   - Fields:
     - sphereField: Fibonacci 3D sphere (intro + cursor "bottom" zone)
     - flowerField: 3D rose curve with subtle z-undulation
   - Cursor blend: flower (top) ↔ sphere (bottom)
   ========================================================================= */

function createParticleMorphController({ count }: { count: number }) {
  const depth = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    depth[i] = (Math.random() - 0.5) * 1.0;
  }

  const sphereField = new Float32Array(count * 3);
  const flowerField = new Float32Array(count * 3);
  const blended = new Float32Array(count * 3);
  const spectrum = new Float32Array(count * 3);
  const waveCols = new Float32Array(256);

  // 3D sphere via Fibonacci/golden angle distribution
  {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const radius = 4.7;
    for (let i = 0; i < count; i++) {
      const yNorm = 1 - (i / (count - 1)) * 2; // -1..1
      const r = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const theta = golden * i;
      sphereField[i * 3 + 0] = Math.cos(theta) * r * radius;
      sphereField[i * 3 + 1] = yNorm * radius;
      sphereField[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
  }

  // Flower (rose curve) with gentle z undulation for 3D feel
  {
    const petals = 7;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 4.2 + Math.sin(a * petals) * 1.95;
      flowerField[i * 3 + 0] = Math.cos(a) * r;
      flowerField[i * 3 + 1] = Math.sin(a) * r;
      flowerField[i * 3 + 2] = Math.sin(a * petals * 0.5) * 0.4;
    }
  }

  function computeSpectrum({
    time,
    bins,
    wave,
    energy,
  }: {
    time: number;
    bins: Float32Array | null;
    wave: Float32Array | null;
    energy: number;
  }) {
    // Oscilloscope-style waveform across X with subtle thickness.
    const columns = 220;
    const width = 18;
    const nBins = bins ? bins.length : 0;
    const waveLen = wave ? wave.length : 0;

    // Build per-column waveform value from time-domain samples (fallback to bins).
    for (let c = 0; c < columns; c++) {
      const u = c / (columns - 1);
      let v = 0;
      if (wave && waveLen > 0) {
        const wi = Math.min(waveLen - 1, Math.floor(u * (waveLen - 1)));
        v = wave[wi];
      } else if (bins && nBins > 0) {
        const bi = Math.min(nBins - 1, Math.floor(u * nBins));
        v = (bins[bi] - 0.45) * 1.6;
      }
      waveCols[c] = v;
    }

    // Light 3-tap smoothing (in-place into spectrum evaluation via reads)
    // Higher sensitivity so quiet voice still draws a strong waveform
    const amp = 2.6 + energy * 15.5;
    const thickness = 0.22 + energy * 0.85;

    const layers = Math.max(4, Math.floor(count / columns)); // thickness stacks
    for (let i = 0; i < count; i++) {
      const c = i % columns;
      const layer = Math.floor(i / columns);
      const u = c / (columns - 1);
      const x = (u - 0.5) * width;

      const p0 = waveCols[Math.max(0, c - 1)];
      const p1 = waveCols[c];
      const p2 = waveCols[Math.min(columns - 1, c + 1)];
      const wv = (p0 + p1 * 2 + p2) * 0.25;

      // Stack particles around the line to form a thicker stroke
      const k = layers <= 1 ? 0 : layer / (layers - 1);
      const centered = (k - 0.5) * 2;
      const spread = centered * thickness;

      const y = wv * amp + spread;
      const z = Math.sin(u * 9 + time * 1.2) * 0.18 + centered * 0.12;

      spectrum[i * 3 + 0] = x;
      spectrum[i * 3 + 1] = y;
      spectrum[i * 3 + 2] = z;
    }

    return spectrum;
  }

  function computeCursorBlend(cx: number, cy: number) {
    const y = clamp01(cy);
    // y small (top) → flower, y large (bottom) → sphere
    const wFlower = 1 - smoothstep(0.25, 0.75, y);
    const wSphere = 1 - wFlower;

    // cursor X gently shears the flower's z to add subtle parallax
    const shear = (clamp01(cx) - 0.5) * 0.6;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      blended[ix + 0] = flowerField[ix + 0] * wFlower + sphereField[ix + 0] * wSphere;
      blended[ix + 1] = flowerField[ix + 1] * wFlower + sphereField[ix + 1] * wSphere;
      blended[ix + 2] =
        (flowerField[ix + 2] + flowerField[ix + 0] * shear * 0.05) * wFlower +
        sphereField[ix + 2] * wSphere;
    }
    return blended;
  }

  return {
    depth,
    sphereField,
    computeCursorBlend,
    computeSpectrum,
  };
}

/* =========================================================================
   Component
   ========================================================================= */

export function BinaryInterfaceHero({
  className,
  audioEnabled = false,
}: {
  className?: string;
  audioEnabled?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const COUNT = 1400;
  const morph = useMemo(
    () => createParticleMorphController({ count: COUNT }),
    [],
  );

  const audioEnabledRef = useRef(audioEnabled);
  const micControllerRef = useRef<ReturnType<typeof createMicController> | null>(
    null,
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const createBinaryTexture = (char: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("2D context unavailable");
      ctx.fillStyle = "#111";
      ctx.font = "300 64px Outfit, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(char, 48, 50);
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      return tex;
    };

    const tex0 = createBinaryTexture("0");
    const tex1 = createBinaryTexture("1");

    const group = new THREE.Group();
    scene.add(group);

    const particles: THREE.Sprite[] = [];
    const baseOpacity = new Float32Array(COUNT);

    // Per-particle intro state: rain → assemble onto sphereField
    // Each particle starts above its sphere target with a downward velocity.
    const introFallSpeed = new Float32Array(COUNT);
    const introOffsetX = new Float32Array(COUNT);
    const introOffsetZ = new Float32Array(COUNT);
    const introSettled = new Uint8Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      baseOpacity[i] = 0.42 + Math.random() * 0.42;
      introFallSpeed[i] = 5.0 + Math.random() * 5.5; // units per second
      introOffsetX[i] = (Math.random() - 0.5) * 1.6; // small x jitter during fall
      introOffsetZ[i] = (Math.random() - 0.5) * 1.6;

      const mat = new THREE.SpriteMaterial({
        map: i % 2 === 0 ? tex0 : tex1,
        transparent: true,
        opacity: 0, // fade in during intro
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      const s = 0.2 + Math.random() * 0.1;
      sprite.scale.set(s, s, s);

      // Start position: at sphere x/z but high above with random extra height
      const sx = morph.sphereField[i * 3 + 0];
      const sz = morph.sphereField[i * 3 + 2];
      const startY = 7 + Math.random() * 9; // between 7..16, above the screen
      sprite.position.set(sx + introOffsetX[i], startY, sz + introOffsetZ[i]);

      group.add(sprite);
      particles.push(sprite);
    }

    const cursorController = createCursorController(mount);
    const micController = createMicController();
    micControllerRef.current = micController;

    let raf = 0;
    let lastTime = performance.now();
    const startTime = performance.now();
    let smoothedRotX = 0;
    let smoothedRotY = 0;

    // Phases: 'intro' (rain → sphere) → 'live' (cursor / spectrum)
    let phase: "intro" | "live" = "intro";
    let allSettledAt = 0; // ms timestamp when last particle settled
    const introHoldMs = 600; // hold the sphere briefly before handing off

    const animate = (time: number) => {
      raf = requestAnimationFrame(animate);

      const t = time * 0.001;
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      // Audio mode (only after intro is fully done)
      const audioOn =
        phase === "live" && audioEnabledRef.current && micController.state.active;
      const mode: "intro" | "spectrum" | "cursor" =
        phase === "intro" ? "intro" : audioOn ? "spectrum" : "cursor";

      // ---- Group rotation (skip during intro for stability) ----
      if (phase === "live") {
        const cx = cursorController.x;
        const cy = cursorController.y;

        // Idle weight: 0 right after the user moves, ramps to 1 after ~1.6s of stillness.
        const idleW = smoothstep(0.6, 1.6, cursorController.idleSeconds);

        // Continuous slow spin (always running) + gentle wobble, blended in by idleW.
        const spinY = t * 0.08 + Math.sin(t * 0.35) * 0.06;
        const wobbleX = Math.cos(t * 0.28) * 0.05;

        const cursorRotY = (cx - 0.5) * 0.36;
        const cursorRotX = (cy - 0.5) * 0.22;

        const targetRotY = cursorRotY * (1 - idleW) + spinY * idleW;
        const targetRotX = cursorRotX * (1 - idleW) + wobbleX * idleW;

        smoothedRotY = smoothDamp(smoothedRotY, targetRotY, 6, dt);
        smoothedRotX = smoothDamp(smoothedRotX, targetRotX, 6, dt);
      } else {
        // gentle idle rotation while assembling
        smoothedRotY = smoothDamp(smoothedRotY, Math.sin(t * 0.4) * 0.08, 4, dt);
        smoothedRotX = smoothDamp(smoothedRotX, 0, 4, dt);
      }
      group.rotation.y = smoothedRotY;
      group.rotation.x = smoothedRotX;

      // ---- Field selection for live phase ----
      let field: Float32Array | null = null;
      if (mode === "spectrum") {
        const audio = micController.update();
        field = morph.computeSpectrum({
          time: t,
          bins: audio?.bins ?? null,
          wave: audio?.wave ?? null,
          energy: micController.state.energy,
        });
      } else if (mode === "cursor") {
        field = morph.computeCursorBlend(cursorController.x, cursorController.y);
      }

      // ---- Per-particle update ----
      if (mode === "intro") {
        let allSettled = true;
        for (let i = 0; i < COUNT; i++) {
          const p = particles[i];
          const sx = morph.sphereField[i * 3 + 0];
          const sy = morph.sphereField[i * 3 + 1];
          const sz = morph.sphereField[i * 3 + 2];

          if (!introSettled[i]) {
            // Falling phase
            const newY = p.position.y - introFallSpeed[i] * dt;
            // Tiny x wobble for rain texture
            const wobble = Math.sin(t * 3.0 + i * 0.7) * 0.06;
            p.position.x = sx + introOffsetX[i] + wobble;
            p.position.z = sz + introOffsetZ[i] + wobble * 0.5;

            if (newY <= sy) {
              p.position.y = sy;
              introSettled[i] = 1;
            } else {
              p.position.y = newY;
              allSettled = false;
            }

            // Fade in as it nears its target
            const fadeT = clamp01(1 - (p.position.y - sy) / 6);
            (p.material as THREE.SpriteMaterial).opacity = baseOpacity[i] * fadeT;
          } else {
            // Settled: ease residual offsets to exact sphere position
            p.position.x = lerp(p.position.x, sx, 0.18);
            p.position.z = lerp(p.position.z, sz, 0.18);
            (p.material as THREE.SpriteMaterial).opacity = baseOpacity[i];
          }
        }

        if (allSettled && allSettledAt === 0) {
          allSettledAt = now;
        }
        if (allSettledAt > 0 && now - allSettledAt > introHoldMs) {
          phase = "live";
        }

        // Safety: if anything stalls, force live after 6s
        if (elapsed > 6) phase = "live";
      } else if (field) {
        const l = mode === "spectrum" ? 0.085 : 0.09;
        for (let i = 0; i < COUNT; i++) {
          const p = particles[i];
          const tx = field[i * 3 + 0];
          const ty = field[i * 3 + 1];
          const tz = field[i * 3 + 2] + morph.depth[i];

          p.position.x = lerp(p.position.x, tx, l);
          p.position.y = lerp(p.position.y, ty, l);
          p.position.z = lerp(p.position.z, tz, l);

          const shimmer = 0.06 * Math.sin(t * 0.9 + i * 0.17);
          const lift =
            mode === "spectrum" ? micController.state.energy * 0.24 : 0;
          (p.material as THREE.SpriteMaterial).opacity = clamp01(
            baseOpacity[i] + shimmer + lift,
          );
        }
      }

      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(animate);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);

      cursorController.destroy();
      micController.stop();
      micControllerRef.current = null;

      for (const p of particles) (p.material as THREE.Material).dispose();
      tex0.dispose();
      tex1.dispose();
      group.clear();
      scene.clear();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morph]);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
    const mic = micControllerRef.current;
    if (!mic) return;
    if (audioEnabled) {
      mic.start();
    } else {
      mic.stop();
    }
  }, [audioEnabled]);

  return <div ref={mountRef} className={className} />;
}
