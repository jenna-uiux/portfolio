/** Public R2 bucket URL for portfolio video assets (Cloudflare). */
export const R2_PUBLIC_BASE =
  "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev";

/** Build a public URL for a file stored in the portfolio-media R2 bucket. */
export function r2Url(key: string) {
  const clean = key.replace(/^\//, "");
  return `${R2_PUBLIC_BASE}/${clean
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

/** R2 object keys for videos hosted outside the Vercel deployment. */
export const R2_MEDIA = {
  finiThumbnail: "fini_thumbnail.mp4",
  finiProactiveAtomization: "fini_proactiveAtomization.mp4",
  finiVoiceTaskEntry: "fini_voiceTaskEntry.mp4",
  finiSystemLayer: "fini_system-layer.mp4",
  strawberryMatchaThumbnail: "strawberryMatcha_thumbnail.mp4",
  strawberryMatchaDemo01: "strawberryMatcha_demo_01.mp4",
  strawberryMatchaDemo02: "strawberryMatcha_demo_02.mp4",
  strawberryMatchaDemo03: "strawberryMatcha_demo_03.mp4",
  aeonPrinciple1: "aeon_principle_1.mp4",
  aeonPrinciple2: "aeon_principle_2.mp4",
  aeonPrinciple3: "aeon_principle_3.mp4",
  aeonReflection: "aeon_reflection_3.mp4",
  aeonFloatingLights: "audio/Floating Lights.mp3",
  aeonGlidingThroughTheMist: "audio/Gliding Through the Mist.mp3",
  aeonSilverGlider: "audio/Silver Glider.mp3",
} as const;
