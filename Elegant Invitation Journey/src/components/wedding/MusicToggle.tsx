import { useEffect, useState } from "react";
import { getMusicState, subscribeMusic, toggleMute } from "@/lib/music";

/** Small glass control — only mounts once music is actually playing. */
export function MusicToggle() {
  const [state, setState] = useState({ playing: false, muted: false });

  useEffect(() => {
    setState(getMusicState());
    return subscribeMusic(() => setState(getMusicState()));
  }, []);

  if (!state.playing) return null;

  return (
    <button
      type="button"
      // Acts on pointer-down rather than waiting for the click, so it responds
      // to the first tap instead of after Safari has finished deciding whether
      // a double-tap is coming.
      onPointerDown={toggleMute}
      onClick={(e) => {
        // Only keyboard and assistive activation reach here: those dispatch a
        // click with no pointer behind it, which is what detail === 0 means.
        // Running on every click as well would toggle twice per tap and look
        // like nothing happened.
        if (e.detail === 0) toggleMute();
      }}
      aria-label={state.muted ? "Unmute music" : "Mute music"}
      aria-pressed={state.muted}
      className="glass fixed right-4 z-[60] flex size-11 items-center justify-center rounded-full shadow-[0_10px_28px_-12px_oklch(0.28_0.02_60/0.4)] transition-transform active:scale-95"
      style={{
        bottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        // Tells Safari there is no double-tap gesture here, so it stops waiting.
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70">
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {state.muted ? (
          <path d="m17 9 4 6M21 9l-4 6" />
        ) : (
          <>
            <path d="M15.5 8.5a4.5 4.5 0 0 1 0 7" />
            <path d="M18.5 6a8 8 0 0 1 0 12" />
          </>
        )}
      </svg>
    </button>
  );
}
