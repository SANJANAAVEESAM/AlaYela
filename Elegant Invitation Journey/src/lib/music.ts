/**
 * Ambient music for the invitation.
 *
 * The file lives in `public/` so a missing asset degrades to silence instead of
 * breaking the build. Playback only ever starts from the user's tap on the
 * envelope, which satisfies browser autoplay policies.
 */
// AAC in an .m4a container rather than MP3: the source was already AAC, so
// this avoids a second lossy hop through a different codec, and every browser
// that matters plays it.
export const MUSIC_SRC = "/music/invitation.m4a";
const TARGET_VOLUME = 0.3;
const FADE_MS = 3500;

let audio: HTMLAudioElement | null = null;
let current = MUSIC_SRC;
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
  return { playing: audio !== null, muted, track: current };
}

function stop() {
  audio?.pause();
  audio = null;
}

/**
 * Begin playback of `src`, fading up over `fadeMs`.
 * Resolves false when the file is missing or the browser refuses to play.
 */
async function play(src: string, fadeMs: number): Promise<boolean> {
  if (typeof window === "undefined") return false;
  stop();
  current = src;

  const el = new Audio(src);
  el.loop = true;
  el.preload = "auto";
  el.volume = 0;

  // A missing or unreachable file must not surface as an unhandled rejection.
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
    emit();
    return false;
  }

  audio = el;
  emit();

  const started = performance.now();
  const step = (now: number) => {
    if (audio !== el) return;
    const t = fadeMs <= 0 ? 1 : Math.min(1, (now - started) / fadeMs);
    el.volume = muted ? 0 : TARGET_VOLUME * t;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  return true;
}

/** Starts the invitation's own track. Called from the tap that opens it. */
export async function startMusic() {
  if (audio) return;
  await play(MUSIC_SRC, FADE_MS);
}

/** Swaps to another track immediately — used when auditioning candidates. */
export async function playTrack(src: string) {
  return play(src, 400);
}

export function stopMusic() {
  stop();
  emit();
}

export function toggleMute() {
  if (!audio) return;
  muted = !muted;
  audio.volume = muted ? 0 : TARGET_VOLUME;
  emit();
}
