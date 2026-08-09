import { useEffect, useRef, useState } from "react";
import { COUPLE } from "./data";
import { startMusic } from "@/lib/music";
import backdrop from "@/assets/backdrop.jpg";
import monogram from "@/assets/monogram.png";

/**
 * Scene 1 — the couple's illustration behind frosted glass, with the monogram
 * over it.
 *
 * Deliberately still: tapping hands straight over to the hero, and the overlay
 * in index.tsx cross-fades the two. There is no clearing or focusing sequence
 * in between — the guest should reach the invitation, not watch an animation.
 *
 * The illustration sits at scale 1, exactly where the page's fixed backdrop
 * sits, so it stays registered through the cross-fade and only the frost and
 * monogram dissolve.
 */
export function Envelope({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    startMusic();
    timer.current = window.setTimeout(onOpened, 80);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="relative h-full w-full overflow-hidden outline-none"
      style={{ cursor: opening ? "default" : "pointer" }}
    >
      {/* Opaque base: the frost above is only partly opaque, so without this the
          page shows through before the illustration has decoded. */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--background)" }} />

      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        width={653}
        height={1000}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* The frost */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(20px) saturate(0.85)",
          WebkitBackdropFilter: "blur(20px)",
          background: "color-mix(in oklab, var(--background) 68%, transparent)",
        }}
      />

      {/* The mark carries its own sprig, swash and names, so the flourishes and
          the separate name line that used to frame the initials are gone —
          keeping them would have doubled up on both. */}
      {/* Truly centred. The old 8% bottom padding lifted the initials clear of
          the button, but this mark is shorter and leaves ample room without it —
          and the offset was what made it look misplaced. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* The couple's own artwork, background keyed out so it sits on the
            frost rather than as a pasted rectangle. Sized by width — the mark
            is taller than wide, and height-driven sizing overflows narrow
            phones sideways. */}
        <div className="relative flex w-[64%] items-center justify-center">
          {/* A pool of light behind the mark. The frost alone still lets the
              photograph read through, and fine script over a busy ground loses
              its shape — this quiets only what sits directly behind it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[12%]"
            style={{
              background:
                "radial-gradient(58% 52% at 50% 48%, oklch(0.985 0.008 84 / 0.72) 0%, oklch(0.985 0.008 84 / 0.42) 55%, transparent 100%)",
            }}
          />

          <img
            src={monogram}
            alt={`${COUPLE.bride} and ${COUPLE.groom}`}
            width={433}
            height={486}
            className="relative h-auto w-full"
            style={{
              // The source is a screenshot, so it is already being upscaled on a
              // retina phone; a little extra contrast keeps the hairlines from
              // dissolving into the frost.
              filter:
                "contrast(1.14) saturate(1.06) drop-shadow(0 2px 12px oklch(0.28 0.03 55 / 0.22))",
            }}
          />
        </div>
      </div>

      {/* CTA */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 7vh)",
          transition: "opacity 250ms ease",
          opacity: opening ? 0 : 1,
          pointerEvents: opening ? "none" : "auto",
        }}
      >
        <span className="glass animate-cta-pulse rounded-full px-9 py-4 ring-1 ring-white/70">
          <span
            className="font-body text-[0.68rem] font-medium tracking-[0.3em] uppercase"
            style={{ color: "oklch(0.34 0.03 60)" }}
          >
            Open Invitation
          </span>
        </span>
      </div>
    </div>
  );
}
