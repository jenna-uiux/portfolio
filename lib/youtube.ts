/** Typical YouTube video id length and charset. */
const VIDEO_ID_RE = /^[\w-]{11}$/;

export function isYouTubeMediaUrl(url: string): boolean {
  const t = url.trim();
  if (!/^https?:\/\//i.test(t)) return false;
  const lower = t.toLowerCase();
  return lower.includes("youtube.com") || lower.includes("youtu.be");
}

/**
 * Extracts a YouTube video id from common URL shapes:
 * `youtu.be/ID`, `youtube.com/watch?v=ID`, `youtube.com/embed/ID`.
 */
export function parseYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const segment = u.pathname.split("/").filter(Boolean)[0];
      if (segment && VIDEO_ID_RE.test(segment)) return segment;
      return null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.slice("/embed/".length).split("/")[0];
        if (id && VIDEO_ID_RE.test(id)) return id;
      }
      const v = u.searchParams.get("v");
      if (v && VIDEO_ID_RE.test(v)) return v;
    }
  } catch {
    return null;
  }

  return null;
}

export type YouTubeEmbedSrcOptions = {
  autoPlay?: boolean;
  loop?: boolean;
  /** When false, passes `controls=0` on the embed URL. */
  showControls?: boolean;
};

export function buildYouTubeEmbedSrc(
  videoId: string,
  options: YouTubeEmbedSrcOptions = {}
): string {
  const params = new URLSearchParams();
  if (options.showControls === false) params.set("controls", "0");
  if (options.autoPlay) {
    params.set("autoplay", "1");
    params.set("mute", "1");
  }
  if (options.loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }
  const qs = params.toString();
  return `https://www.youtube.com/embed/${videoId}${qs ? `?${qs}` : ""}`;
}
