import { useEffect, useRef, useState } from "react";
import { COUPLE } from "./data";
import { startMusic } from "@/lib/music";
import backdrop from "@/assets/backdrop.jpg";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function Rule({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 10"
      className="mx-auto w-24"
      aria-hidden="true"
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <g fill="none" stroke="#b8862f" strokeOpacity="0.8" strokeWidth="0.8" strokeLinecap="round">
        <path d="M2 5 H24" />
        <path d="M36 5 H58" />
        <path d="M30 1 C 33 3.5, 33 6.5, 30 9 C 27 6.5, 27 3.5, 30 1 Z" />
      </g>
    </svg>
  );
}

/**
 * Scene 1 — the couple's illustration behind frosted glass, with the monogram
 * over it. Tapping clears the frost, brings the picture into focus, then lifts
 * the veil away.
 *
 * The image settles at the same scale and weight the site's fixed backdrop
 * uses, so the handoff to the hero reads as one continuous shot rather than a
 * cut between two screens.
 */
export function Envelope({ onOpened }: { onOpened: () => void }) {
  const [stage, setStage] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (stage !== 0) return;
    startMusic();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = reduced ? 0.3 : 1;
    setStage(1); // frost clears, picture drifts into place
    timers.current = [
      window.setTimeout(() => setStage(2), 1250 * s), // veil lifts
      window.setTimeout(onOpened, 2050 * s),
    ];
  };

  const clearing = stage >= 1;
  const lifting = stage >= 2;

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
      style={{ cursor: stage === 0 ? "pointer" : "default" }}
    >
      {/* Solid until the veil lifts. The frost above is only partly opaque, so
          without this the page behind shows through at first paint — before the
          illustration has decoded — and reads as a flash of the site. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "var(--background)",
          transition: "opacity 700ms ease",
          opacity: lifting ? 0 : 1,
        }}
      />

      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        width={653}
        height={1000}
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{
          // Ends at scale 1 and roughly the weight the site's backdrop carries,
          // so nothing jumps when the overlay finally clears.
          transition: `transform 1900ms ${EASE}, opacity 800ms ease`,
          transform: clearing ? "scale(1)" : "scale(1.12)",
          opacity: lifting ? 0.42 : 1,
        }}
      />

      {/* The frost */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${clearing ? 0 : 20}px) saturate(${clearing ? 1 : 0.85})`,
          WebkitBackdropFilter: `blur(${clearing ? 0 : 20}px)`,
          background: `color-mix(in oklab, var(--background) ${lifting ? 52 : clearing ? 20 : 68}%, transparent)`,
          transition: "backdrop-filter 1200ms ease, background 900ms ease",
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{
          paddingBottom: "8%",
          transition: `opacity 800ms ease, transform 1100ms ${EASE}`,
          opacity: lifting ? 0 : 1,
          transform: lifting ? "translateY(-9%)" : "none",
        }}
      >
        <Rule />
        <p
          className="font-monogram leading-none text-bronze"
          style={{
            fontSize: "clamp(3.6rem, 21vw, 6.4rem)",
            filter: "drop-shadow(0 2px 12px oklch(0.28 0.03 55 / 0.45))",
          }}
        >
          {COUPLE.bride[0]}
          {COUPLE.groom[0]}
        </p>
        <Rule flip />
        <p
          className="mt-5 font-display tracking-[0.26em] uppercase"
          style={{ color: "oklch(0.32 0.03 55)", fontSize: "clamp(0.8rem, 4vw, 1.05rem)" }}
        >
          {COUPLE.bride} &amp; {COUPLE.groom}
        </p>
      </div>

      {/* CTA */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 7vh)",
          transition: "opacity 400ms ease, transform 400ms ease",
          opacity: stage === 0 ? 1 : 0,
          transform: stage === 0 ? "translateY(0)" : "translateY(10px)",
          pointerEvents: stage === 0 ? "auto" : "none",
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
