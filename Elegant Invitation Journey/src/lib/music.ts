/**
 * Ambient music for the invitation.
 *
 * The file lives in `public/` so a missing asset degrades to silence instead of
 * breaking the build. Playback only ever starts from the user's tap on the
 * envelope, which satisfies browser autoplay policies.
 *
 * The fade is the awkward part, and it is handled differently per platform for
 * a reason. iOS makes `HTMLMediaElement.volume` read-only — assignments are
 * silently ignored — so there the element is routed through a Web Audio gain
 * node instead. Everywhere else `volume` works, and Web Audio is deliberately
 * avoided: `createMediaElementSource` moves the element's output into the audio
 * context, so if that context is ever suspended the track plays to nobody. That
 * is exactly what silenced Android. Rather than guess at platforms, the code
 * asks the browser whether volume is settable and takes the simpler path when
 * it is.
 */
export const MUSIC_SRC = "/music/invitation.m4a";
const TARGET_VOLUME = 0.3;
const FADE_MS = 3500;

let audio: HTMLAudioElement | null = null;
let gain: GainNode | null = null;
let ctx: AudioContext | null = null;
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

/** True when the browser honours volume assignments — false on iOS. */
function volumeIsSettable(el: HTMLAudioElement) {
  el.volume = 0.5;
  const ok = Math.abs(el.volume - 0.5) < 0.01;
  el.volume = 0;
  return ok;
}

/**
 * Routes the element through a gain node, for platforms that ignore `volume`.
 *
 * Only ever connects a context that is already running. Routing an element into
 * a suspended context is a one-way door: its output moves into the graph, and
 * if that graph never starts, the track plays to nobody with no way back. Music
 * that cannot fade is a small loss; music nobody can hear is not.
 */
function buildGraph(el: HTMLAudioElement): GainNode | null {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;

    const context = new Ctor();
    void context.resume();
    if (context.state !== "running") {
      void context.close();
      return null;
    }

    ctx = context;
    const source = context.createMediaElementSource(el);
    const node = context.createGain();
    node.gain.value = 0;
    source.connect(node);
    node.connect(context.destination);
    return node;
  } catch {
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

  const canSetVolume = volumeIsSettable(el);
  const node = canSetVolume ? null : buildGraph(el);
  // No fade available: start audible rather than at zero, or a platform that
  // ignores volume and has no graph would stay silent forever.
  if (!canSetVolume && !node) el.volume = TARGET_VOLUME;

  try {
    await el.play();
  } catch {
    emit();
    return;
  }

  audio = el;
  gain = node;
  emit();

  const started = performance.now();
  const step = (now: number) => {
    if (audio !== el) return;
    const t = Math.min(1, (now - started) / FADE_MS);
    const level = TARGET_VOLUME * t;
    if (node) node.gain.value = level;
    else el.volume = level;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Mutes and unmutes.
 *
 * Goes through `.muted`, which every platform honours — dropping the volume to
 * zero does nothing on iOS.
 */
export function toggleMute() {
  if (!audio) return;
  muted = !muted;
  audio.muted = muted;
  if (gain) gain.gain.value = muted ? 0 : TARGET_VOLUME;
  else audio.volume = muted ? 0 : TARGET_VOLUME;
  emit();
}
