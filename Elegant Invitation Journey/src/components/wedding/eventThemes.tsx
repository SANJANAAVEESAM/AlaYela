import type { CSSProperties, ReactNode } from "react";

import haldiArt from "@/assets/bg-haldi.jpg";
import mehendiArt from "@/assets/bg-mehendi.jpg";
import pelliArt from "@/assets/bg-pelli.jpg";
import pellikodukuArt from "@/assets/bg-pellikoduku.jpg";
import pellikuthuruArt from "@/assets/bg-pellikuthuru.jpg";
import sangeetArt from "@/assets/bg-sangeet.jpg";

/**
 * A setting per celebration: its own ground, ink and hand-drawn scenery, so
 * opening one feels like that event rather than a generic panel.
 *
 * Drawn here rather than dropped in as artwork — it keeps the whole set in the
 * site's own hand, stays sharp at any size, and costs a couple of kilobytes.
 */
export type EventTheme =
  | "carnival"
  | "mehendi"
  | "pellikuthuru"
  | "pellikoduku"
  | "masquerade"
  | "telugu";

const line = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* --------------------------------- scenery -------------------------------- */

/** A hanging bell on a cord, used across the courtyard themes. */
function Bell({ x, drop, scale = 1, tone }: { x: number; drop: number; scale?: number; tone: string }) {
  return (
    <g transform={`translate(${x} 0) scale(${scale})`} stroke={tone} strokeWidth="1.1" {...line}>
      <path d={`M0 0v${drop}`} />
      <path d={`M-5 ${drop + 8}c0-5 2-8 5-8s5 3 5 8z`} fill={tone} fillOpacity="0.14" />
      <path d={`M-6.5 ${drop + 8}h13`} />
      <path d={`M0 ${drop + 8}v3`} />
    </g>
  );
}

/** A broad banana frond, the recurring plant in the courtyard cards. */
function Frond({ x, y, rotate, scale = 1, tone }: { x: number; y: number; rotate: number; scale?: number; tone: string }) {
  const ribs = Array.from({ length: 7 }, (_, i) => {
    const t = (i + 1) / 8;
    return <path key={i} d={`M0 ${(-46 * t).toFixed(1)}L${(26 * Math.sin(t * 2.4)).toFixed(1)} ${(-46 * t - 11 * Math.sin(t * 2.2)).toFixed(1)}`} />;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} stroke={tone} strokeWidth="1" {...line}>
      <path d="M0 0C2 -18 4 -34 0 -50" />
      <path d="M0 -4c14-2 24 4 27 16 -11 5 -22 0 -27-16z" fill={tone} fillOpacity="0.13" />
      <path d="M0 -22c13-3 22 3 25 14 -10 5 -20 0 -25-14z" fill={tone} fillOpacity="0.13" />
      <path d="M0 -38c10-2 17 2 19 11 -8 4 -16 0 -19-11z" fill={tone} fillOpacity="0.13" />
      {ribs.slice(0, 3)}
    </g>
  );
}

function CarnivalArt({ accent, leaf }: Tones) {
  const lantern = (x: number, drop: number, s: number) => (
    <g transform={`translate(${x} 0) scale(${s})`} stroke={accent} strokeWidth="1.1" {...line}>
      <path d={`M0 0v${drop}`} />
      <ellipse cx="0" cy={drop + 11} rx="9" ry="11" fill={accent} fillOpacity="0.13" />
      <path d={`M-9 ${drop + 11}h18`} />
      <path d={`M0 ${drop + 22}v5`} />
      <path d={`M-3 ${drop + 27}h6`} />
    </g>
  );
  return (
    <svg viewBox="0 0 320 520" preserveAspectRatio="none" className="h-full w-full">
      {lantern(38, 16, 1)}
      {lantern(74, 44, 0.78)}
      {lantern(282, 16, 1)}
      {lantern(246, 40, 0.78)}
      <Frond x={16} y={520} rotate={-14} scale={1.1} tone={leaf} />
      <Frond x={58} y={520} rotate={10} scale={0.85} tone={leaf} />
      <Frond x={300} y={520} rotate={16} scale={1} tone={leaf} />
    </svg>
  );
}

function MehendiArt({ accent, scenery, leaf }: Tones) {
  const bloom = (x: number, y: number, r: number) => (
    <g transform={`translate(${x} ${y})`} stroke={accent} strokeWidth="1" {...line}>
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx="0" cy={-r * 0.62} rx={r * 0.36} ry={r * 0.62} transform={`rotate(${i * 72})`} fill={accent} fillOpacity="0.12" />
      ))}
      <circle cx="0" cy="0" r={r * 0.22} />
    </g>
  );
  return (
    <svg viewBox="0 0 320 520" preserveAspectRatio="none" className="h-full w-full">
      {/* Garland arc across the top */}
      <path d="M-10 14C60 46 260 46 330 14" stroke={accent} strokeWidth="1.1" {...line} />
      {bloom(34, 24, 13)}
      {bloom(92, 38, 10)}
      {bloom(160, 42, 14)}
      {bloom(228, 38, 10)}
      {bloom(288, 24, 13)}
      <Bell x={62} drop={54} scale={0.9} tone={scenery} />
      <Bell x={130} drop={70} scale={0.75} tone={scenery} />
      <Bell x={196} drop={64} scale={0.8} tone={scenery} />
      <Bell x={262} drop={50} scale={0.9} tone={scenery} />
      <Frond x={12} y={520} rotate={-16} scale={0.95} tone={leaf} />
      <Frond x={306} y={520} rotate={14} scale={0.95} tone={leaf} />
    </svg>
  );
}

function VintageArt({ accent, scenery, leaf }: Tones) {
  return (
    <svg viewBox="0 0 320 520" preserveAspectRatio="none" className="h-full w-full">
      <Frond x={6} y={112} rotate={132} scale={1.15} tone={leaf} />
      <Frond x={44} y={92} rotate={158} scale={0.85} tone={leaf} />
      <Frond x={314} y={104} rotate={-136} scale={1.15} tone={leaf} />
      <Frond x={276} y={86} rotate={-160} scale={0.8} tone={leaf} />
      <Bell x={96} drop={26} scale={0.85} tone={scenery} />
      <Bell x={122} drop={44} scale={0.7} tone={scenery} />
      {/* Carved pilaster down the right edge */}
      <g stroke={scenery} strokeWidth="1" {...line} opacity="0.85">
        <path d="M296 150v370M316 150v370M296 150h20" />
        <path d="M299 186h14M299 232h14M299 278h14M299 324h14" />
      </g>
      <Frond x={22} y={520} rotate={-12} scale={0.9} tone={leaf} />
    </svg>
  );
}

function MasqueradeArt({ accent, leaf }: Tones) {
  const stars = Array.from({ length: 46 }, (_, i) => {
    const x = ((i * 71) % 313) + 4;
    const y = ((i * 137) % 470) + 20;
    const r = 0.7 + ((i * 13) % 5) * 0.22;
    return <circle key={i} cx={x} cy={y} r={r} fill="#f4efe4" fillOpacity={0.22 + ((i * 7) % 5) * 0.1} />;
  });
  const strand = (x: number, drop: number) => (
    <g key={x} stroke={accent} strokeWidth="0.8" {...line} opacity="0.75">
      <path d={`M${x} 0v${drop}`} />
      {Array.from({ length: 4 }, (_, k) => (
        <circle key={k} cx={x} cy={(drop / 4) * (k + 1)} r="1.5" fill={accent} fillOpacity="0.6" />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 320 520" preserveAspectRatio="none" className="h-full w-full">
      {stars}
      {[18, 46, 78, 110, 146, 178, 212, 244, 276, 302].map((x, i) => strand(x, 40 + ((i * 29) % 62)))}
      {/* Tall fronds rising from the floor */}
      <Frond x={30} y={520} rotate={-8} scale={1.5} tone={leaf} />
      <Frond x={78} y={520} rotate={6} scale={1.15} tone={leaf} />
      <Frond x={244} y={520} rotate={-6} scale={1.2} tone={leaf} />
      <Frond x={294} y={520} rotate={12} scale={1.5} tone={leaf} />
    </svg>
  );
}

function TeluguArt({ scenery, leaf }: Tones) {
  const lamp = (x: number, y: number, s: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={scenery} strokeWidth="1" {...line}>
      <path d="M0 0v-54" />
      <path d="M-9 0h18" />
      <path d="M-6 -54c0-5 3-8 6-8s6 3 6 8z" fill={scenery} fillOpacity="0.16" />
      <path d="M-11 -54h22" />
      <path d="M0 -62v-7" />
      <path d="M-4 -30h8M-5 -16h10" />
    </g>
  );
  return (
    <svg viewBox="0 0 320 520" preserveAspectRatio="none" className="h-full w-full">
      {/* Ornate arch frame */}
      <g stroke={scenery} strokeWidth="1" {...line} opacity="0.8">
        <path d="M16 60V500M304 60V500M16 500h288" />
        <path d="M16 60C16 32 84 12 160 12s144 20 144 48" />
        <path d="M24 68V492M296 68V492" strokeWidth="0.6" opacity="0.6" />
        <path d="M148 26q12-14 24 0q-12 8-24 0z" />
      </g>
      {lamp(46, 500, 1)}
      {lamp(74, 500, 0.74)}
      <Frond x={294} y={470} rotate={-150} scale={1.1} tone={leaf} />
    </svg>
  );
}

/* --------------------------------- themes --------------------------------- */

type Tones = { accent: string; scenery: string; leaf: string };

type Theme = {
  accent: string;
  /** Pillars, frames, lanterns, bells. */
  scenery: string;
  /** Fronds and foliage. */
  leaf: string;
  ink: string;
  inkSoft: string;
  /** Panel background for the full-page details. */
  surface: CSSProperties;
  /** Supplied artwork. Takes the place of the drawn scenery when present. */
  image?: string;
  /** Laid over the artwork so the details stay readable. */
  scrim?: string;
  /** Which part of the artwork to favour when it is cropped to the panel. */
  imagePosition?: string;
  /**
   * Crop and strength for the faint wash behind an event card.
   *
   * Needs its own values rather than reusing imagePosition: every one of these
   * artworks is composed with its motifs at the top and bottom and a bare
   * middle, and a card is a wide, short letterbox — so the default centre crop
   * lands squarely on the empty part and the card reads blank.
   */
  cardPosition?: string;
  /** Pale artworks need more of it; the dark Sangeet needs far less. */
  cardOpacity?: number;
  /** Shifts the details clear of whatever the artwork puts in their way. */
  contentStyle?: CSSProperties;
  art: (t: Tones) => ReactNode;
};

/** Sandy courtyard, banana fronds, brass pilaster — both blessing mornings. */
const courtyard = {
  accent: "oklch(0.34 0.07 74)",
  scenery: "oklch(0.6 0.09 76)",
  leaf: "oklch(0.58 0.13 136)",
  ink: "oklch(0.17 0.03 62)",
  inkSoft: "oklch(0.28 0.03 66)",
  surface: {
    background:
      "radial-gradient(130% 72% at 50% 0%, oklch(0.95 0.032 90) 0%, oklch(0.922 0.042 84) 55%, oklch(0.9 0.05 80) 100%)",
  },
  art: (t: Tones) => <VintageArt {...t} />,
} satisfies Theme;

export const EVENT_THEMES: Record<EventTheme, Theme> = {
  // Haldi — cream damask ground, pastel lanterns, tropical greens.
  carnival: {
    accent: "oklch(0.38 0.11 32)",
    scenery: "oklch(0.66 0.12 20)",
    leaf: "oklch(0.55 0.12 140)",
    ink: "oklch(0.12 0.022 50)",
    inkSoft: "oklch(0.21 0.024 54)",
    surface: {
      background:
        "radial-gradient(130% 72% at 50% 0%, oklch(0.958 0.024 86) 0%, oklch(0.936 0.03 82) 52%, oklch(0.915 0.034 78) 100%)",
    },
    image: haldiArt,
    cardPosition: "center 80%",
    cardOpacity: 0.24,
    scrim:
      "linear-gradient(180deg, oklch(0.94 0.028 84 / 0.34) 0%, oklch(0.94 0.028 84 / 0.48) 48%, oklch(0.93 0.032 82 / 0.74) 78%, oklch(0.93 0.032 82 / 0.6) 100%)",
    art: (t) => <CarnivalArt {...t} />,
  },

  // Mehendi — warm white, deep forest ink, brass bells under a floral canopy.
  mehendi: {
    accent: "oklch(0.25 0.06 158)",
    scenery: "oklch(0.62 0.08 76)",
    leaf: "oklch(0.5 0.11 148)",
    ink: "oklch(0.16 0.03 160)",
    inkSoft: "oklch(0.26 0.03 156)",
    surface: {
      background:
        "radial-gradient(130% 72% at 50% 0%, oklch(0.975 0.006 90) 0%, oklch(0.958 0.01 100) 55%, oklch(0.942 0.014 118) 100%)",
    },
    image: mehendiArt,
    cardPosition: "center 92%",
    cardOpacity: 0.24,
    // A pale ground needs almost nothing up top; the weight goes where the
    // lawn and figures are, so the details stay legible over them.
    scrim:
      "linear-gradient(180deg, oklch(0.97 0.008 92 / 0.12) 0%, oklch(0.97 0.008 92 / 0.34) 42%, oklch(0.97 0.01 92 / 0.72) 74%, oklch(0.97 0.01 92 / 0.6) 100%)",
    art: (t) => <MehendiArt {...t} />,
  },

  // The two courtyard mornings share a palette but not their artwork.
  pellikuthuru: {
    ...courtyard,
    image: pellikuthuruArt,
    cardPosition: "center 86%",
    cardOpacity: 0.22,
    scrim:
      "linear-gradient(180deg, oklch(0.95 0.03 88 / 0.1) 0%, oklch(0.95 0.03 88 / 0.32) 44%, oklch(0.94 0.034 86 / 0.7) 76%, oklch(0.94 0.034 86 / 0.56) 100%)",
  },
  pellikoduku: {
    ...courtyard,
    image: pellikodukuArt,
    cardPosition: "center 72%",
    cardOpacity: 0.24,
    scrim:
      "linear-gradient(180deg, oklch(0.95 0.03 88 / 0.1) 0%, oklch(0.95 0.03 88 / 0.32) 44%, oklch(0.94 0.034 86 / 0.7) 76%, oklch(0.94 0.034 86 / 0.56) 100%)",
  },

  // Sangeet — midnight, pearl lights, sage fronds, cream type.
  masquerade: {
    accent: "oklch(0.86 0.03 92)",
    scenery: "oklch(0.88 0.02 92)",
    leaf: "oklch(0.62 0.04 150)",
    ink: "oklch(0.95 0.012 88)",
    inkSoft: "oklch(0.8 0.02 90)",
    surface: {
      background:
        "radial-gradient(120% 70% at 50% 0%, oklch(0.26 0.06 268) 0%, oklch(0.21 0.06 266) 55%, oklch(0.17 0.05 264) 100%)",
    },
    image: sangeetArt,
    cardPosition: "center 88%",
    cardOpacity: 0.13,
    // Firmest through the middle, where the details sit; eased off at the
    // bottom so the dancers stay visible.
    scrim:
      "linear-gradient(180deg, oklch(0.17 0.05 264 / 0.3) 0%, oklch(0.17 0.05 264 / 0.46) 42%, oklch(0.17 0.05 264 / 0.58) 72%, oklch(0.17 0.05 264 / 0.34) 100%)",
    art: (t) => <MasqueradeArt {...t} />,
  },

  // Pelli — parchment, gold arch, maroon type, olive fronds and brass lamps.
  telugu: {
    accent: "oklch(0.29 0.11 26)",
    scenery: "oklch(0.66 0.11 84)",
    leaf: "oklch(0.52 0.08 130)",
    ink: "oklch(0.18 0.045 30)",
    inkSoft: "oklch(0.28 0.04 34)",
    surface: {
      background:
        "radial-gradient(130% 72% at 50% 0%, oklch(0.972 0.014 88) 0%, oklch(0.952 0.018 84) 55%, oklch(0.934 0.022 80) 100%)",
    },
    image: pelliArt,
    cardPosition: "30% 88%",
    cardOpacity: 0.24,
    // The arch interior is already a clean field, so barely anything up top —
    // just enough at the foot to carry type over the lamps and offerings.
    // Two washes: one down the page for the lamps and offerings at the foot,
    // one across it to settle the palm holding the left edge.
    scrim:
      "linear-gradient(90deg, oklch(0.95 0.02 84 / 0.62) 0%, oklch(0.95 0.02 84 / 0.28) 26%, transparent 46%), linear-gradient(180deg, oklch(0.96 0.016 86 / 0.06) 0%, oklch(0.955 0.018 84 / 0.22) 50%, oklch(0.95 0.02 82 / 0.6) 80%, oklch(0.95 0.02 82 / 0.46) 100%)",
    // Favour the arch, which is where the artwork leaves room to write.
    imagePosition: "70% top",
    // The fronds fall across the top ~350px of this sheet. Starting the heading
    // below the third one keeps the name off the leaves and sets it inside the
    // arch, where the artwork leaves room for it.
    contentStyle: { paddingTop: "14rem" },
    art: (t) => <TeluguArt {...t} />,
  },
};

/** The event's scenery, sat behind the panel's content. */
export function EventScenery({ theme }: { theme: EventTheme }) {
  const { accent, scenery, leaf, art, image, scrim, imagePosition } = EVENT_THEMES[theme];

  if (image) {
    return (
      <>
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imagePosition ?? "center top" }}
        />
        {scrim && <span className="absolute inset-0" style={{ background: scrim }} />}
      </>
    );
  }

  return (
    <span className="absolute inset-0" style={{ opacity: 0.62 }}>
      {art({ accent, scenery, leaf })}
    </span>
  );
}
