import type { CSSProperties } from "react";

/**
 * The couple's monogram, drawn rather than typed.
 *
 * Three marks, redrawn as vectors from the sheets the couple chose. They are
 * SVG rather than images so they stay crisp at any size, take the bronze token
 * rather than a baked-in colour, and add nothing to the page weight.
 *
 * Letterforms come from the loaded webfonts, so an SVG <text> node is used
 * rather than outlined paths — the flourishes around them are hand-drawn.
 */
export type MonogramVariant = "swash" | "rule" | "wreath" | "sprig";

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Serif "LA" with a long ribbon looping beneath. */
function Swash() {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-auto" aria-hidden="true">
      <text
        x="150"
        y="132"
        textAnchor="middle"
        fontFamily='"Cormorant Garamond", Georgia, serif'
        fontSize="128"
        fontWeight="400"
        letterSpacing="-4"
        fill="currentColor"
      >
        LA
      </text>
      {/* One continuous ribbon: a small loop at the left, then a long sweep out
          to the right, passing under both letters. */}
      <path
        {...STROKE}
        strokeWidth="1.6"
        d="M96 150 C 62 150 54 178 82 180 C 118 183 150 166 186 158 C 214 152 232 156 240 163"
      />
      <path {...STROKE} strokeWidth="1.6" d="M96 150 C 128 150 160 146 186 158" />
    </svg>
  );
}

/** "L | A" divided by a hairline, a small star set into it. */
function RuleMark() {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-auto" aria-hidden="true">
      <text
        x="104"
        y="140"
        textAnchor="middle"
        fontFamily='"Cormorant Garamond", Georgia, serif'
        fontSize="126"
        fontWeight="400"
        fill="currentColor"
      >
        L
      </text>
      <text
        x="196"
        y="140"
        textAnchor="middle"
        fontFamily='"Cormorant Garamond", Georgia, serif'
        fontSize="126"
        fontWeight="400"
        fill="currentColor"
      >
        A
      </text>
      {/* The rule breaks either side of the star rather than running behind it. */}
      <path {...STROKE} strokeWidth="1.2" d="M150 36 V 88" />
      <path {...STROKE} strokeWidth="1.2" d="M150 116 V 168" />
      <path
        fill="currentColor"
        d="M150 88 C 152.4 97.6 154.4 99.6 164 102 C 154.4 104.4 152.4 106.4 150 116 C 147.6 106.4 145.6 104.4 136 102 C 145.6 99.6 147.6 97.6 150 88 Z"
      />
    </svg>
  );
}

/** Script "LA" ringed by a drawn circle, with a sprig and the names beneath. */
function Wreath({ bride, groom }: { bride: string; groom: string }) {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-auto" aria-hidden="true">
      {/* Deliberately not a perfect circle — the ring is drawn, not struck. */}
      <path
        {...STROKE}
        strokeWidth="1.3"
        d="M150 22 C 219 22 274 74 276 146 C 278 216 222 276 150 277 C 79 278 24 220 23 150 C 22 78 80 23 150 22 Z"
      />

      <text
        x="150"
        y="168"
        textAnchor="middle"
        fontFamily='"Parisienne", cursive'
        fontSize="112"
        fill="currentColor"
      >
        LA
      </text>

      {/* Sprig, lower right, tucked against the ring. */}
      <g {...STROKE} strokeWidth="1.15">
        <path d="M214 232 C 234 226 250 210 258 190" />
        <path d="M228 226 c -3 -9 1 -17 9 -20 c 2 8 -2 16 -9 20" />
        <path d="M240 214 c -2 -9 2 -17 10 -20 c 2 9 -3 17 -10 20" />
        <path d="M222 232 c -8 2 -15 -1 -19 -8 c 7 -3 15 0 19 8" />
      </g>

      <text
        x="150"
        y="252"
        textAnchor="middle"
        fontFamily='"Karla", system-ui, sans-serif'
        fontSize="15"
        letterSpacing="3.4"
        fill="currentColor"
      >
        {`${bride.toUpperCase()} & ${groom.toUpperCase()}`}
      </text>
      <circle cx="66" cy="247" r="2.4" fill="currentColor" />
      <circle cx="234" cy="247" r="2.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Script "LA" with a sprig at its left, a swash beneath and the names under
 * that — the mark the couple chose for the opening. It carries its own names,
 * so nothing else should sit beneath it.
 */
function Sprig({ bride, groom }: { bride: string; groom: string }) {
  return (
    <svg viewBox="0 0 380 400" className="h-full w-auto" aria-hidden="true">
      {/* Set well clear of the L: at the reference's proportions the leaves
          would otherwise grow through the letter. */}
      <g {...STROKE} strokeWidth="1.15">
        <path d="M52 316 C 54 250 62 190 78 140" />
        <path d="M74 156 c -14 -5 -20 -18 -17 -31 c 13 3 21 16 17 31" />
        <path d="M78 166 c 14 -8 19 -22 14 -35 c -13 5 -19 20 -14 35" />
        <path d="M66 200 c -14 -5 -20 -18 -17 -31 c 13 3 21 16 17 31" />
        <path d="M70 210 c 14 -8 19 -22 14 -35 c -13 5 -19 20 -14 35" />
        <path d="M59 244 c -14 -5 -20 -18 -17 -31 c 13 3 21 16 17 31" />
        <path d="M63 254 c 14 -8 19 -22 14 -35 c -13 5 -19 20 -14 35" />
        <path d="M54 286 c -12 -4 -17 -15 -15 -26 c 11 3 18 13 15 26" />
      </g>

      <text
        x="228"
        y="272"
        textAnchor="middle"
        fontFamily='"Parisienne", cursive'
        fontSize="215"
        fill="currentColor"
      >
        {`${bride[0]}${groom[0]}`}
      </text>

      <path
        {...STROKE}
        strokeWidth="1.5"
        d="M112 300 C 150 322 210 322 268 300 C 302 287 322 292 332 302"
      />

      <text
        x="196"
        y="368"
        textAnchor="middle"
        fontFamily='"Cormorant Garamond", Georgia, serif'
        fontSize="27"
        letterSpacing="8"
        fill="currentColor"
      >
        {`${bride.toUpperCase()} & ${groom.toUpperCase()}`}
      </text>
    </svg>
  );
}

export function Monogram({
  variant,
  bride,
  groom,
  className = "",
  style,
}: {
  variant: MonogramVariant;
  bride: string;
  groom: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {variant === "swash" && <Swash />}
      {variant === "rule" && <RuleMark />}
      {variant === "wreath" && <Wreath bride={bride} groom={groom} />}
      {variant === "sprig" && <Sprig bride={bride} groom={groom} />}
    </div>
  );
}
