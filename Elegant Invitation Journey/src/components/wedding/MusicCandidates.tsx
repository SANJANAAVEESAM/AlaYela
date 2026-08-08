import { useEffect, useState } from "react";

import { getMusicState, playTrack, stopMusic, subscribeMusic } from "@/lib/music";

/**
 * Audition panel for choosing the invitation's music.
 *
 * Only appears when the page is opened with `?music` in the URL, so guests
 * never see it. Drop candidate files in public/music/candidates/ and list them
 * below; the panel marks any that fail to load.
 *
 * Delete this file — and the entry in Microsite — once a track is chosen.
 */
const CANDIDATES = [
  { file: "/music/candidates/1.mp3", label: "One" },
  { file: "/music/candidates/2.mp3", label: "Two" },
  { file: "/music/candidates/3.mp3", label: "Three" },
  { file: "/music/candidates/4.mp3", label: "Four" },
];

export function MusicCandidates() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState(getMusicState());
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).has("music"));
    return subscribeMusic(() => setState(getMusicState()));
  }, []);

  if (!enabled) return null;

  const choose = async (file: string) => {
    const ok = await playTrack(file);
    if (!ok) setMissing((m) => (m.includes(file) ? m : [...m, file]));
  };

  return (
    <div
      className="glass fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[24rem] rounded-2xl px-4 pt-3 ring-1 ring-white/60"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <p className="font-body text-[0.55rem] font-medium tracking-[0.22em] uppercase text-muted-foreground">
        Audition music
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {CANDIDATES.map((c) => {
          const on = state.playing && state.track === c.file;
          const gone = missing.includes(c.file);
          return (
            <button
              key={c.file}
              type="button"
              onClick={() => choose(c.file)}
              aria-pressed={on}
              className="rounded-full px-3.5 py-2 font-body text-[0.68rem] transition-colors"
              style={{
                background: on ? "var(--bronze)" : "color-mix(in srgb, white 72%, transparent)",
                color: on ? "var(--primary-foreground)" : "var(--foreground)",
                opacity: gone ? 0.45 : 1,
                boxShadow: "0 1px 3px oklch(0.28 0.02 60 / 0.12)",
              }}
            >
              {c.label}
              {gone && " · missing"}
            </button>
          );
        })}

        <button
          type="button"
          onClick={stopMusic}
          className="rounded-full px-3.5 py-2 font-body text-[0.68rem] text-foreground"
          style={{ background: "color-mix(in srgb, white 72%, transparent)" }}
        >
          Stop
        </button>
      </div>

      <p className="mt-2 font-body text-[0.62rem] text-muted-foreground">
        Scroll the invitation while it plays. Remove <code>?music</code> to hide this.
      </p>
    </div>
  );
}
