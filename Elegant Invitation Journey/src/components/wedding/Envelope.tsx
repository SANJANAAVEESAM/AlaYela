import { useEffect, useRef, useState } from "react";
import { COUPLE } from "./data";
import { startMusic } from "@/lib/music";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TILE = "184px 184px";

/** Where the flap's point meets the pocket — the seal sits exactly here. */
const SEAM = 46;

/* -------------------------------- surfaces -------------------------------- */

/** Botanical vines, leaves and five-petal blooms — one seamless tile. */
function floralTile(stroke: string, width = 1.05) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="184" height="184" viewBox="0 0 184 184">
<g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round">
<path d="M-8 168 C26 146 44 112 38 68 C34 40 44 16 62 -8"/>
<path d="M192 16 C158 38 140 72 146 116 C150 144 140 168 122 192"/>
<path d="M62 184 C86 160 112 152 138 156"/>
<path d="M122 0 C98 24 72 32 46 28"/>
<path d="M38 118 c-19 -8 -31 1 -34 16 c17 5 30 -4 34 -16z"/>
<path d="M41 84 c17 -10 31 -5 36 9 c-17 8 -30 3 -36 -9z"/>
<path d="M35 148 c-16 -5 -27 3 -30 15"/>
<path d="M146 66 c19 -8 31 1 34 16 c-17 5 -30 -4 -34 -16z"/>
<path d="M143 100 c-17 -10 -31 -5 -36 9 c17 8 30 3 36 -9z"/>
<path d="M149 32 c16 -5 27 3 30 15"/>
<path d="M92 170 c-13 -6 -22 1 -24 11 c12 4 21 -3 24 -11z"/>
<path d="M92 14 c13 6 22 -1 24 -11"/>
<g transform="translate(96,44)"><circle cx="0" cy="-6" r="3.6"/><circle cx="5.7" cy="-1.9" r="3.6"/><circle cx="3.5" cy="4.9" r="3.6"/><circle cx="-3.5" cy="4.9" r="3.6"/><circle cx="-5.7" cy="-1.9" r="3.6"/><circle cx="0" cy="0" r="1.5"/></g>
<g transform="translate(24,44)"><circle cx="0" cy="-4.4" r="2.7"/><circle cx="4.2" cy="-1.4" r="2.7"/><circle cx="2.6" cy="3.6" r="2.7"/><circle cx="-2.6" cy="3.6" r="2.7"/><circle cx="-4.2" cy="-1.4" r="2.7"/></g>
<g transform="translate(160,140)"><circle cx="0" cy="-4.4" r="2.7"/><circle cx="4.2" cy="-1.4" r="2.7"/><circle cx="2.6" cy="3.6" r="2.7"/><circle cx="-2.6" cy="3.6" r="2.7"/><circle cx="-4.2" cy="-1.4" r="2.7"/></g>
<g transform="translate(72,120)"><circle cx="0" cy="-5" r="3.1"/><circle cx="4.8" cy="-1.6" r="3.1"/><circle cx="3" cy="4.1" r="3.1"/><circle cx="-3" cy="4.1" r="3.1"/><circle cx="-4.8" cy="-1.6" r="3.1"/><circle cx="0" cy="0" r="1.3"/></g>
</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)" opacity="0.55"/></svg>`,
)}")`;

const SHADOW_TILE = floralTile("#7d7256");
const LIGHT_TILE = floralTile("#ffffff", 1.15);
const SILVER_TILE = floralTile("#b9bec9", 0.85);

/**
 * Letterpress emboss: the same botanical drawn three times — a dark copy pushed
 * down-right, a white copy pulled up-left, and a silver pass on top. The offset
 * pair is what reads as depth in the paper.
 */
function Emboss({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: SHADOW_TILE,
          backgroundSize: TILE,
          backgroundPosition: "0.9px 1.1px",
          mixBlendMode: "multiply",
          opacity: 0.2 * intensity,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: LIGHT_TILE,
          backgroundSize: TILE,
          backgroundPosition: "-0.9px -1.1px",
          mixBlendMode: "screen",
          opacity: 0.85 * intensity,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: SILVER_TILE,
          backgroundSize: TILE,
          mixBlendMode: "soft-light",
          opacity: 0.5 * intensity,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: GRAIN, backgroundSize: "140px 140px", mixBlendMode: "multiply", opacity: 0.05 }}
      />
    </>
  );
}

/* ---------------------------------- seal ---------------------------------- */

// Deliberately off-round: poured wax never sets as a perfect circle.
const WAX_BLOB =
  "M60 7 C79 6 94 15 104 30 C114 45 115 63 108 79 C101 95 86 107 68 111 C50 115 32 109 20 96 C8 83 4 65 9 49 C14 33 27 19 43 11 C48 8 54 7 60 7Z";
const CRACK = "M60 4 L56 25 L65 39 L55 53 L64 68 L54 82 L63 96 L58 114";

function WaxSeal({ cracked, gone }: { cracked: boolean; gone: boolean }) {
  const half = (side: "left" | "right") => (
    <g
      clipPath={`url(#crack-${side})`}
      style={{
        transformOrigin: "60px 60px",
        transition: `transform 900ms ${EASE}, opacity 700ms ease`,
        transform: cracked
          ? `translate(${side === "left" ? -7 : 7}px, ${gone ? 26 : 2}px) rotate(${side === "left" ? -9 : 9}deg)`
          : "none",
        opacity: gone ? 0 : 1,
      }}
    >
      <path d={WAX_BLOB} fill="url(#wax)" />
      <path d={WAX_BLOB} fill="none" stroke="#7f838d" strokeOpacity="0.55" strokeWidth="1.2" />
      {/* pooled edge + tooling marks */}
      <path d={WAX_BLOB} fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.8" transform="translate(0,-1.4)" />
      <ellipse cx="42" cy="34" rx="15" ry="9" fill="#ffffff" opacity="0.28" transform="rotate(-24 42 34)" />
      <ellipse cx="78" cy="86" rx="11" ry="6" fill="#5d626d" opacity="0.2" transform="rotate(-18 78 86)" />
      <circle cx="74" cy="42" r="1.6" fill="#6f747f" opacity="0.35" />
      <circle cx="38" cy="76" r="1.1" fill="#6f747f" opacity="0.3" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 120 120"
      className="h-full w-full"
      style={{ filter: "drop-shadow(0 5px 9px oklch(0.3 0.02 60 / 0.42))" }}
    >
      <defs>
        <radialGradient id="wax" cx="36%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#fbfcfd" />
          <stop offset="26%" stopColor="#dfe2e8" />
          <stop offset="62%" stopColor="#b2b7c2" />
          <stop offset="100%" stopColor="#828794" />
        </radialGradient>
        <clipPath id="crack-left">
          <path d={`${CRACK} L-10 114 L-10 4 Z`} />
        </clipPath>
        <clipPath id="crack-right">
          <path d={`${CRACK} L130 114 L130 4 Z`} />
        </clipPath>
      </defs>

      {half("left")}
      {half("right")}

      {/* Monogram, split by the same crack so it breaks with the wax */}
      <g
        style={{
          transition: "opacity 500ms ease",
          opacity: cracked ? 0 : 1,
        }}
      >
        <text
          x="60"
          y="74"
          textAnchor="middle"
          className="font-script"
          fontSize="44"
          fill="#6b7079"
          opacity="0.75"
        >
          {COUPLE.bride[0]}
          {COUPLE.groom[0]}
        </text>
      </g>

      {/* Fracture line, drawn only as it breaks */}
      <path
        d={CRACK}
        fill="none"
        stroke="#5f646f"
        strokeOpacity="0.6"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{
          transition: "opacity 260ms ease",
          opacity: cracked && !gone ? 1 : 0,
        }}
      />
    </svg>
  );
}

/* -------------------------------- envelope -------------------------------- */

/**
 * Scene 1 — a close-up luxury envelope filling the viewport.
 * Tap → seal cracks → flap lifts → inner card rises → camera pushes in and the
 * background softens, handing off to the next scene with no hard cut.
 */
export function Envelope({ onOpened }: { onOpened: () => void }) {
  const [stage, setStage] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (stage !== 0) return;
    startMusic();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = reduced ? 0.28 : 1;
    setStage(1); // seal cracks
    timers.current = [
      window.setTimeout(() => setStage(2), 1000 * s), // halves fall, flap lifts
      window.setTimeout(() => setStage(3), 1900 * s), // card rises, camera pushes in
      window.setTimeout(() => setStage(4), 3000 * s), // background softens
      window.setTimeout(onOpened, 4300 * s),
    ];
  };

  const cracked = stage >= 1;
  const sealGone = stage >= 2;
  const flapOpen = stage >= 2;
  const cardUp = stage >= 3;
  const zoomed = stage >= 3;
  const softened = stage >= 4;

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
      {/* Warm ivory room tone the envelope sits in — never a flat white canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 88% at 50% 22%, oklch(0.975 0.012 84) 0%, oklch(0.955 0.016 82) 46%, oklch(0.918 0.022 78) 100%)",
        }}
      >
        <span className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "140px 140px", mixBlendMode: "multiply", opacity: 0.07 }} />
      </div>

      {/* Camera: pushes in, then softens as it hands off */}
      <div
        className="absolute inset-0"
        style={{
          transition: `transform 2600ms ${EASE}, filter 1200ms ease, opacity 1100ms ease`,
          transform: zoomed ? "scale(1.14)" : "scale(1)",
          filter: softened ? "blur(9px)" : "blur(0px)",
          opacity: softened ? 0.55 : 1,
          willChange: "transform, filter",
        }}
      >
        {/* The envelope itself — 94% of the viewport */}
        <div
          className="absolute"
          style={{ inset: "3%", perspective: "1600px", perspectiveOrigin: "50% 30%" }}
        >
          {/* Back panel */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[12px]"
            style={{
              background: "linear-gradient(168deg, oklch(0.975 0.011 84) 0%, oklch(0.944 0.016 82) 62%, oklch(0.958 0.014 83) 100%)",
              boxShadow:
                "0 42px 90px -34px oklch(0.3 0.02 60 / 0.45), 0 8px 24px -10px oklch(0.3 0.02 60 / 0.22), inset 0 1px 0 oklch(1 0 0 / 0.7)",
            }}
          >
            <Emboss />
          </div>

          {/* Inner card — rises out of the pocket */}
          <div
            className="absolute overflow-hidden rounded-[8px]"
            style={{
              left: "6%",
              right: "6%",
              top: "9%",
              bottom: "9%",
              zIndex: 10,
              background: "linear-gradient(170deg, oklch(0.99 0.006 86), oklch(0.968 0.01 84))",
              boxShadow: "0 14px 30px -14px oklch(0.3 0.02 60 / 0.4)",
              transition: `transform 1800ms ${EASE}`,
              transform: cardUp ? "translateY(-15%)" : "translateY(0)",
            }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="eyebrow text-[0.5rem]">Together with their families</p>
              <p className="font-display text-[7vmin] leading-tight text-foreground">
                {COUPLE.bride}
                <span className="font-script mx-1.5 text-[0.62em] text-bronze">&hearts;</span>
                {COUPLE.groom}
              </p>
            </div>
          </div>

          {/* Front pocket — the V where the side folds meet */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[12px]"
            style={{
              zIndex: 20,
              clipPath: `polygon(0 0, 50% ${SEAM}%, 100% 0, 100% 100%, 0 100%)`,
              background: "linear-gradient(176deg, oklch(0.968 0.013 84) 0%, oklch(0.938 0.018 81) 100%)",
              filter: "drop-shadow(0 -2px 4px oklch(0.3 0.02 60 / 0.1))",
            }}
          >
            <Emboss />
            {/* Fold seams */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path
                d={`M0 0 L50 ${SEAM} L100 0 M0 100 L50 ${SEAM + 26} L100 100`}
                fill="none"
                stroke="oklch(0.42 0.02 60 / 0.1)"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* Light falling down the pocket face */}
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(184deg, oklch(1 0 0 / 0.35) 0%, transparent 34%, oklch(0.5 0.02 60 / 0.06) 100%)" }}
            />
          </div>

          {/* Flap */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: `${SEAM}%`,
              zIndex: flapOpen ? 5 : 30,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              transition: `transform 1800ms ${EASE}, filter 1200ms ease`,
              transform: flapOpen ? "rotateX(-166deg)" : "rotateX(0deg)",
              filter: flapOpen ? "brightness(0.93)" : "brightness(1)",
            }}
          >
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(178deg, oklch(0.972 0.012 84) 0%, oklch(0.93 0.019 80) 100%)",
                backfaceVisibility: "hidden",
              }}
            >
              <Emboss intensity={1.1} />
              {/* Shading toward the fold, so the flap doesn't read flat */}
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, oklch(0.45 0.02 60 / 0.09) 0%, transparent 26%, oklch(0.45 0.02 60 / 0.1) 100%)" }}
              />
            </div>

            {/* Silver edge along the flap's two sloping sides */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="flap-edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#b4b9c4" />
                  <stop offset="28%" stopColor="#f6f7f9" />
                  <stop offset="54%" stopColor="#a9aeb9" />
                  <stop offset="78%" stopColor="#fafbfc" />
                  <stop offset="100%" stopColor="#b0b5c0" />
                </linearGradient>
              </defs>
              <path
                d="M0 0 L50 100 L100 0"
                fill="none"
                stroke="url(#flap-edge)"
                strokeWidth="1.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Embossed silver monogram */}
            <span
              className="foil-silver font-script absolute left-1/2 top-[26%] -translate-x-1/2 text-[13vmin] leading-none"
              style={{
                filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.85)) drop-shadow(0 -1px 0 rgba(110,102,80,0.28))",
                transition: "opacity 700ms ease",
                opacity: flapOpen ? 0 : 1,
              }}
            >
              {COUPLE.bride[0]}
              {COUPLE.groom[0]}
            </span>
          </div>

          {/* Wax seal, exactly on the seam */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              top: `${SEAM}%`,
              width: "min(26vmin, 8.5rem)",
              aspectRatio: "1",
              zIndex: 40,
            }}
          >
            <WaxSeal cracked={cracked} gone={sealGone} />
            {!cracked && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                style={{ maskImage: "radial-gradient(circle at 50% 50%, #000 62%, transparent 72%)" }}
              >
                <span
                  className="absolute top-0 h-full w-1/3"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                    animation: "wax-shine 5.5s ease-in-out 1.5s infinite",
                  }}
                />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 6.5vh)",
          transition: "opacity 450ms ease, transform 450ms ease",
          opacity: stage === 0 ? 1 : 0,
          transform: stage === 0 ? "translateY(0)" : "translateY(10px)",
          pointerEvents: stage === 0 ? "auto" : "none",
        }}
      >
        <span className="glass animate-cta-pulse rounded-full px-9 py-4 ring-1 ring-white/60">
          <span className="font-body text-[0.68rem] font-medium tracking-[0.3em] text-foreground/80 uppercase">
            Open Invitation
          </span>
        </span>
      </div>
    </div>
  );
}
