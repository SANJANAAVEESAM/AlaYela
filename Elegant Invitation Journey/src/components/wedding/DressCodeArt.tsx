import type { DressCode } from "./data";

/**
 * A dress code shown rather than described.
 *
 * "Solid colours, any colour" and "bling" are both easier to grasp from a row
 * of swatches than from a sentence — especially for guests skimming on a phone
 * in a language that is not their first.
 *
 * Swatch colours are literals rather than theme tokens on purpose: they are the
 * subject here, not decoration, and must read the same on every event's ground.
 */

/** A full spread of hues, to say "any colour" without listing any. */
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

/** Metallics, each a sweep so it reads as catching the light. */
const BLING = [
  "linear-gradient(135deg, oklch(0.94 0.05 95) 0%, oklch(0.78 0.13 88) 45%, oklch(0.96 0.04 100) 70%, oklch(0.72 0.12 85) 100%)",
  "linear-gradient(135deg, oklch(0.97 0.01 250) 0%, oklch(0.78 0.02 250) 45%, oklch(0.99 0.005 250) 70%, oklch(0.74 0.02 250) 100%)",
  "linear-gradient(135deg, oklch(0.95 0.04 30) 0%, oklch(0.80 0.09 25) 45%, oklch(0.97 0.03 35) 70%, oklch(0.76 0.08 22) 100%)",
  "linear-gradient(135deg, oklch(0.93 0.05 75) 0%, oklch(0.72 0.10 70) 45%, oklch(0.96 0.03 80) 70%, oklch(0.70 0.09 68) 100%)",
];

export function DressCodeArt({
  dressCode,
  ink,
  inkSoft,
}: {
  dressCode: DressCode;
  ink?: string;
  inkSoft?: string;
}) {
  const swatches = dressCode.kind === "bling" ? BLING : SOLIDS;
  const round = dressCode.kind === "bling";

  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase"
        style={{ color: inkSoft }}
      >
        Dress code
      </p>

      <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
        {swatches.map((paint, i) => (
          <span
            key={i}
            className={round ? "size-7 rounded-full" : "size-7 rounded-[7px]"}
            style={{
              background: paint,
              // A hairline keeps the palest metallics from vanishing into a
              // light panel, without reading as a border on the darker hues.
              boxShadow:
                "inset 0 0 0 1px oklch(0.28 0.02 60 / 0.16), 0 1px 3px oklch(0.28 0.02 60 / 0.2)",
            }}
          />
        ))}
      </div>

      <p className="font-display text-xl leading-none" style={{ color: ink }}>
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
