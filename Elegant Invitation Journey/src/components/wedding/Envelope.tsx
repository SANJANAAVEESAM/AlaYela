import { useEffect, useRef, useState } from "react";
import { COUPLE } from "./data";
import { startMusic } from "@/lib/music";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TILE = 220;

/* -------------------------------- surfaces -------------------------------- */

/** A chrysanthemum: thin petals radiating from a small eye. */
function mum(cx: number, cy: number, r: number, petals = 14) {
  const shapes = Array.from({ length: petals }, (_, i) => {
    const a = ((360 / petals) * i).toFixed(1);
    const w = (r * 0.15).toFixed(1);
    return `<path d="M0 -${(r * 0.26).toFixed(1)} C ${w} -${(r * 0.55).toFixed(1)}, ${w} -${(r * 0.86).toFixed(1)}, 0 -${r} C -${w} -${(r * 0.86).toFixed(1)}, -${w} -${(r * 0.55).toFixed(1)}, 0 -${(r * 0.26).toFixed(1)} Z" transform="rotate(${a})"/>`;
  }).join("");
  return `<g transform="translate(${cx},${cy})">${shapes}<circle r="${(r * 0.19).toFixed(1)}"/></g>`;
}

/** A fern frond: a curving spine with leaflets stepping down both sides. */
function fern(cx: number, cy: number, len: number, rotate: number) {
  const leaflets = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6;
    const y = -(len * t);
    const s = (len * 0.24 * (1 - t * 0.65)).toFixed(1);
    const bend = (len * 0.1 * t).toFixed(1);
    return (
      `<path d="M${bend} ${y.toFixed(1)} c ${s} -${(Number(s) * 0.5).toFixed(1)}, ${s} -${(Number(s) * 1.2).toFixed(1)}, ${(Number(s) * 0.4).toFixed(1)} -${(Number(s) * 1.5).toFixed(1)}"/>` +
      `<path d="M${bend} ${y.toFixed(1)} c -${s} -${(Number(s) * 0.5).toFixed(1)}, -${s} -${(Number(s) * 1.2).toFixed(1)}, -${(Number(s) * 0.4).toFixed(1)} -${(Number(s) * 1.5).toFixed(1)}"/>`
    );
  }).join("");
  return `<g transform="translate(${cx},${cy}) rotate(${rotate})"><path d="M0 0 C ${(len * 0.08).toFixed(1)} -${(len * 0.35).toFixed(1)}, ${(len * 0.1).toFixed(1)} -${(len * 0.7).toFixed(1)}, ${(len * 0.1).toFixed(1)} -${len}"/>${leaflets}</g>`;
}

function floralTile(stroke: string, width: number) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}">` +
    `<g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round">` +
    mum(62, 58, 34) +
    mum(168, 156, 26, 12) +
    fern(14, 200, 74, -14) +
    fern(206, 84, 66, 166) +
    fern(120, 214, 58, 24) +
    `<path d="M96 96 C 118 108, 134 128, 140 152"/>` +
    `<path d="M-6 118 C 18 128, 34 146, 40 168"/>` +
    `</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const EMBOSS_SHADOW = floralTile("#9a6f68", 1.5);
const EMBOSS_LIGHT = floralTile("#ffffff", 1.7);

/** Pleats fanning out from behind the medallion. */
const PLEATS = `repeating-conic-gradient(from -90deg at 50% 47%,
  var(--blush-deep) 0deg,
  var(--blush) 4deg,
  var(--blush-light) 15deg,
  var(--blush) 26deg,
  var(--blush-deep) 30deg)`;

/** One half of the pleated cover; the inner layer spans the full width so the
 *  two halves reconstruct a single continuous fan. */
function CoverHalf({ side, parted }: { side: "left" | "right"; parted: boolean }) {
  return (
    <div
      className="absolute inset-y-0 w-1/2 overflow-hidden"
      style={{
        [side]: 0,
        transition: `transform 1700ms ${EASE}`,
        transform: parted
          ? `translateX(${side === "left" ? "-102%" : "102%"}) rotate(${side === "left" ? -2 : 2}deg)`
          : "none",
      }}
    >
      <div className="absolute inset-y-0 w-[200%]" style={{ [side]: 0, background: PLEATS }}>
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: EMBOSS_SHADOW,
            backgroundSize: `${TILE}px ${TILE}px`,
            backgroundPosition: "1px 1.4px",
            mixBlendMode: "multiply",
            opacity: 0.22,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: EMBOSS_LIGHT,
            backgroundSize: `${TILE}px ${TILE}px`,
            backgroundPosition: "-1px -1.4px",
            mixBlendMode: "screen",
            opacity: 0.75,
          }}
        />
        {/* Light pooling toward the centre of the fan */}
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 46% at 50% 47%, oklch(1 0 0 / 0.4) 0%, transparent 62%), linear-gradient(180deg, oklch(0.6 0.04 20 / 0.12) 0%, transparent 26%, oklch(0.6 0.04 20 / 0.14) 100%)",
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------- medallion -------------------------------- */

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 12"
      className="mx-auto w-[46%]"
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="var(--rose-gold-deep)"
        strokeOpacity="0.75"
        strokeWidth="0.9"
        strokeLinecap="round"
      >
        <path d="M4 6 H22" />
        <path d="M38 6 H56" />
        <path d="M30 1.5 C 33 4, 33 8, 30 10.5 C 27 8, 27 4, 30 1.5 Z" />
        <path d="M24 6 h3 M33 6 h3" />
      </g>
    </svg>
  );
}

function Medallion({ lifted }: { lifted: boolean }) {
  return (
    // Centred by flex, never by translate — Tailwind v4 emits translate as its
    // own CSS property, which would compose with the transform below instead of
    // being replaced by it.
    <div
      className="absolute inset-0 z-30 flex items-center justify-center"
      style={{ paddingBottom: "6%" }}
    >
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: "min(46vw, 15rem)",
          aspectRatio: "1",
          background:
            "radial-gradient(circle at 34% 26%, var(--rose-gold-light) 0%, var(--rose-gold) 46%, var(--rose-gold-deep) 100%)",
          boxShadow:
            "0 18px 34px -14px oklch(0.4 0.05 40 / 0.45), inset 0 2px 5px oklch(1 0 0 / 0.5), inset 0 -8px 18px oklch(0.45 0.06 40 / 0.3)",
          transition: `transform 900ms ${EASE}, opacity 800ms ease`,
          transform: `scale(${lifted ? 1.16 : 1}) rotate(${lifted ? 5 : 0}deg)`,
          opacity: lifted ? 0 : 1,
        }}
      >
        {/* Engraved rings */}
        <span
          aria-hidden="true"
          className="absolute inset-[7%] rounded-full"
          style={{ border: "1px solid oklch(0.45 0.05 45 / 0.4)" }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-[10%] rounded-full"
          style={{ border: "1px solid oklch(0.45 0.05 45 / 0.22)" }}
        />

        <div className="flex w-[68%] flex-col items-center gap-1.5">
          <Flourish />
          <p
            className="font-script leading-none"
            style={{
              color: "oklch(0.36 0.05 45)",
              fontSize: "clamp(2.3rem, 12vw, 3.6rem)",
              letterSpacing: "0.02em",
              textShadow: "0 1px 0 oklch(1 0 0 / 0.45), 0 -1px 1px oklch(0.4 0.05 40 / 0.3)",
            }}
          >
            {COUPLE.bride[0]}
            {COUPLE.groom[0]}
          </p>
          <Flourish flip />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- envelope -------------------------------- */

/**
 * Scene 1 — a blush pleated cover fanning out from a rose-gold medallion.
 * Tap: the medallion lifts away, the cover parts down the centre seam, the
 * camera pushes through and the whole thing softens into the hero.
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
    setStage(1); // medallion lifts
    timers.current = [
      window.setTimeout(() => setStage(2), 750 * s), // cover parts, camera moves
      window.setTimeout(() => setStage(3), 2100 * s), // softens away
      window.setTimeout(onOpened, 3100 * s),
    ];
  };

  const lifted = stage >= 1;
  const parted = stage >= 2;
  const softened = stage >= 3;

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
      style={{ cursor: stage === 0 ? "pointer" : "default", background: "var(--blush-deep)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transition: `transform 2200ms ${EASE}, filter 1000ms ease, opacity 900ms ease`,
          transform: parted ? "scale(1.1)" : "scale(1)",
          filter: softened ? "blur(8px)" : "blur(0px)",
          opacity: softened ? 0.4 : 1,
          willChange: "transform, filter",
        }}
      >
        <CoverHalf side="left" parted={parted} />
        <CoverHalf side="right" parted={parted} />
        <Medallion lifted={lifted} />
      </div>

      {/* CTA */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 7vh)",
          transition: "opacity 420ms ease, transform 420ms ease",
          opacity: stage === 0 ? 1 : 0,
          transform: stage === 0 ? "translateY(0)" : "translateY(10px)",
          pointerEvents: stage === 0 ? "auto" : "none",
        }}
      >
        <span className="glass animate-cta-pulse rounded-full px-9 py-4 ring-1 ring-white/70">
          <span
            className="font-body text-[0.68rem] font-medium tracking-[0.3em] uppercase"
            style={{ color: "oklch(0.38 0.05 30)" }}
          >
            Open Invitation
          </span>
        </span>
      </div>
    </div>
  );
}
