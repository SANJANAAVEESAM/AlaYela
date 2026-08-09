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
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
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

/**
 * Routes the element through a gain node so the fade works on iOS.
 * Returns null when Web Audio is unavailable — the caller then falls back.
 */
function buildGraph(el: HTMLAudioElement): GainNode | null {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;

    ctx = new Ctor();
    const source = ctx.createMediaElementSource(el);
    const node = ctx.createGain();
    node.gain.value = 0;
    source.connect(node);
    node.connect(ctx.destination);
    return node;
  } catch {
    // Some browsers refuse a second source per element, or block the context
    // outright. Silence here is fine; playback does not depend on it.
    ctx = null;
    return null;
  }
}

/** Starts the invitation's track. Called from the tap that opens it. */
export async function startMusic() {
  if (audio || typeof window === "undefined") return;

  const el = new Audio(MUSIC_SRC);
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

  gain = buildGraph(el);

  try {
    await el.play();
    // Safari starts the context suspended even when created inside a gesture.
    if (ctx?.state === "suspended") await ctx.resume();
  } catch {
    emit();
    return;
  }

  audio = el;
  emit();

  const started = performance.now();
  const step = (now: number) => {
    if (audio !== el) return;
    const t = Math.min(1, (now - started) / FADE_MS);
    const level = TARGET_VOLUME * t;
    if (gain) gain.gain.value = level;
    else el.volume = level; // ignored on iOS, honoured everywhere else
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Mutes and unmutes.
 *
 * Sets `.muted` rather than dropping the volume to zero: volume assignments are
 * ignored on iOS, which is why the control did nothing there. The gain node is
 * moved in step so unmuting does not jump back to full level mid-fade.
 */
export function toggleMute() {
  if (!audio) return;
  muted = !muted;
  audio.muted = muted;
  if (gain) gain.gain.value = muted ? 0 : TARGET_VOLUME;
  else audio.volume = muted ? 0 : TARGET_VOLUME;
  emit();
}
