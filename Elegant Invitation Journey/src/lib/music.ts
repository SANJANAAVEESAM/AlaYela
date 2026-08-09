/**
 * Ambient music for the invitation.
 *
 * The file lives in `public/` so a missing asset degrades to silence instead of
 * breaking the build. Playback only ever starts from the user's tap on the
 * envelope, which satisfies browser autoplay policies.
 *
 * Two iOS constraints shape everything below. `HTMLMediaElement.volume` is
 * read-only on iOS — assignments are silently ignored — so muting goes through
 * `.muted`, which is honoured, and the fade goes through a Web Audio gain node.
 * Where Web Audio is unavailable the fade falls back to `.volume`, which simply
 * does nothing on iOS; the music still plays and still mutes.
 */
// AAC in an .m4a container rather than MP3: the source was already AAC, so
// this avoids a second lossy hop through a different codec.
export const MUSIC_SRC = "/music/invitation.m4a";
const TARGET_VOLUME = 0.3;
const FADE_MS = 3500;

let audio: HTMLAudioElement | null = null;
let gain: GainNode | null = null;
let muted = false;
let current = MUSIC_SRC;

/**
 * One context for the page. Browsers cap how many can exist, and auditioning
 * tracks means starting playback repeatedly, so it is created once and reused.
 */
let ctx: AudioContext | null = null;
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

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

function stop() {
  audio?.pause();
  audio = null;
  gain = null;
}

/**
 * Begins `src`, fading up over `fadeMs`.
 * Resolves false when the file is missing or the browser refuses to play.
 */
async function play(src: string, fadeMs: number): Promise<boolean> {
  if (typeof window === "undefined") return false;
  stop();
  current = src;

  const el = new Audio(src);
  el.loop = true;
  el.preload = "auto";
  el.muted = muted;
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

  // A fresh gain node per element: createMediaElementSource may only be called
  // once for a given element, so each track gets its own path into the context.
  const context = getContext();
  let node: GainNode | null = null;
  if (context) {
    try {
      const source = context.createMediaElementSource(el);
      node = context.createGain();
      node.gain.value = 0;
      source.connect(node);
      node.connect(context.destination);
    } catch {
      node = null;
    }
  }

  try {
    await el.play();
    // Safari starts the context suspended even when created inside a gesture.
    if (context?.state === "suspended") await context.resume();
  } catch {
    emit();
    return false;
  }

  audio = el;
  gain = node;
  emit();

  const started = performance.now();
  const step = (now: number) => {
    if (audio !== el) return;
    const t = fadeMs <= 0 ? 1 : Math.min(1, (now - started) / fadeMs);
    const level = TARGET_VOLUME * t;
    if (node) node.gain.value = level;
    else el.volume = level; // ignored on iOS, honoured everywhere else
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

/** Swaps to another track almost immediately — used when auditioning. */
export async function playTrack(src: string) {
  return play(src, 400);
}

export function stopMusic() {
  stop();
  emit();
}

/**
 * Mutes and unmutes.
 *
 * Sets `.muted` rather than dropping the volume to zero: volume assignments are
 * ignored on iOS, which is why the control did nothing there.
 */
export function toggleMute() {
  if (!audio) return;
  muted = !muted;
  audio.muted = muted;
  if (gain) gain.gain.value = muted ? 0 : TARGET_VOLUME;
  else audio.volume = muted ? 0 : TARGET_VOLUME;
  emit();
}
