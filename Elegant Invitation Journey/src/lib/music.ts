/**
 * Ambient music for the invitation.
 *
 * The file lives in `public/` so a missing asset degrades to silence instead of
 * breaking the build. Playback only ever starts from the user's tap on the
 * envelope, which satisfies browser autoplay policies.
 */
// TODO(music): drop an audio file at this path — public/music/invitation.mp3
const SRC = "/music/invitation.mp3";
const TARGET_VOLUME = 0.3;
const FADE_MS = 3500;

let audio: HTMLAudioElement | null = null;
let muted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribeMusic(fn: () => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

export function getMusicState() {
  return { playing: audio !== null, muted };
}

export async function startMusic() {
  if (typeof window === "undefined" || audio) return;

  const el = new Audio(SRC);
  el.loop = true;
  el.preload = "auto";
  el.volume = 0;

  // A missing/unreachable file must not surface as an unhandled rejection.
  el.addEventListener(
    "error",
    () => {
      if (audio === el) {
        audio = null;
        emit();
      }
    },
    { once: true },
  );

  try {
    await el.play();
  } catch {
    return;
  }

  audio = el;
  emit();

  const start = performance.now();
  const fade = (now: number) => {
    if (audio !== el) return;
    const t = Math.min(1, (now - start) / FADE_MS);
    el.volume = muted ? 0 : TARGET_VOLUME * t;
    if (t < 1) requestAnimationFrame(fade);
  };
  requestAnimationFrame(fade);
}

export function toggleMute() {
  if (!audio) return;
  muted = !muted;
  audio.volume = muted ? 0 : TARGET_VOLUME;
  emit();
}
