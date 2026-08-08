import { useEffect, useRef, useState } from "react";
import { COUPLE } from "./data";
import { startMusic } from "@/lib/music";
import backdrop from "@/assets/backdrop.jpg";

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

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ paddingBottom: "8%" }}>
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
