import type { DressCode } from "./data";

/**
 * A dress code shown rather than described.
 *
 * "Any colour" and "bling" are both easier to grasp from colour than from a
 * sentence — especially for guests skimming on a phone. A single ribbon rather
 * than a row of separate swatches: discrete chips read as a colour picker, a
 * piece of interface, where one continuous band reads as ink on stationery.
 *
 * Colours are literals rather than theme tokens on purpose: they are the
 * subject here, not decoration, and must read the same against Haldi's cream
 * ground and Sangeet's midnight blue.
 */

/** The full spread of hues, saying "any colour" without listing any. */
const SOLIDS = [
  "oklch(0.58 0.20 25)", // red
  "oklch(0.70 0.17 55)", // coral
  "oklch(0.82 0.15 92)", // marigold
  "oklch(0.66 0.16 140)", // green
  "oklch(0.62 0.12 200)", // teal
  "oklch(0.55 0.15 255)", // blue
  "oklch(0.48 0.16 300)", // violet
  "oklch(0.65 0.19 350)", // pink
];

const SOLID_RIBBON = `linear-gradient(90deg, ${SOLIDS.join(", ")})`;

/**
 * Metallics, written out rather than derived: the sweep alternates light and
 * dark stops so it reads as catching the light, which an even spread of four
 * colours would not.
 */
const BLING_RIBBON =
  "linear-gradient(90deg, oklch(0.72 0.12 85) 0%, oklch(0.96 0.04 100) 18%, oklch(0.78 0.02 250) 38%, oklch(0.99 0.005 250) 52%, oklch(0.80 0.09 25) 72%, oklch(0.97 0.03 35) 86%, oklch(0.72 0.10 70) 100%)";

export function DressCodeArt({
  dressCode,
  ink,
  inkSoft,
}: {
  dressCode: DressCode;
  ink?: string;
  inkSoft?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="font-body text-[0.55rem] font-medium tracking-[0.26em] uppercase"
        style={{ color: inkSoft }}
      >
        Dress code
      </p>

      <span
        aria-hidden="true"
        className="block h-2.5 w-full max-w-[15rem] rounded-full"
        style={{
          background: dressCode.kind === "bling" ? BLING_RIBBON : SOLID_RIBBON,
          // A hairline stops the palest metallics dissolving into a light panel
          // without reading as a border on the saturated hues.
          boxShadow:
            "inset 0 0 0 1px oklch(0.28 0.02 60 / 0.16), 0 1px 3px oklch(0.28 0.02 60 / 0.2)",
        }}
      />

      <p className="font-display text-[1.5rem] leading-none" style={{ color: ink }}>
        {dressCode.label}
      </p>

      {dressCode.note && (
        <p
          className="mx-auto max-w-[17rem] font-body text-[0.78rem] leading-relaxed"
          style={{ color: inkSoft }}
        >
          {dressCode.note}
        </p>
      )}
    </div>
  );
}
