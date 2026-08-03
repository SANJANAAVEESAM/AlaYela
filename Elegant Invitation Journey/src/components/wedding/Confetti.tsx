import { useMemo } from "react";

const COLORS = [
  "oklch(0.79 0.13 18)", // blush
  "oklch(0.86 0.14 92)", // soft gold
  "oklch(0.94 0.03 88)", // cream
  "oklch(0.7 0.1 45)", // terracotta
  "oklch(0.8 0.06 130)", // sage
];

const PER_BURST = 26;

type Piece = {
  color: string;
  strip: boolean;
  size: number;
  delay: number;
  duration: number;
  cx: number;
  cpeak: number;
  cfall: number;
  cr: number;
};

/** Two poppers, fired from the lower corners a beat apart. */
function makePieces(): { origin: "left" | "right"; pieces: Piece[] }[] {
  return (["left", "right"] as const).map((origin, burst) => ({
    origin,
    pieces: Array.from({ length: PER_BURST }, () => {
      const outward = (0.35 + Math.random() * 0.65) * (origin === "left" ? 1 : -1);
      return {
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        strip: Math.random() > 0.45,
        size: 5 + Math.random() * 6,
        delay: burst * 0.38 + Math.random() * 0.16,
        duration: 2.4 + Math.random() * 1.4,
        cx: outward * (90 + Math.random() * 150),
        cpeak: -(90 + Math.random() * 130),
        cfall: 180 + Math.random() * 200,
        cr: (Math.random() > 0.5 ? 1 : -1) * (240 + Math.random() * 480),
      };
    }),
  }));
}

/**
 * Mounts only when it should actually fire — the caller decides that, and
 * remembers it so returning guests never see it twice.
 */
export function Confetti() {
  const bursts = useMemo(makePieces, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bursts.map((burst) => (
        <div
          key={burst.origin}
          className="absolute"
          style={{
            bottom: "22%",
            [burst.origin]: "14%",
          }}
        >
          {burst.pieces.map((p, i) => (
            <span
              key={i}
              className="absolute block"
              style={
                {
                  width: p.strip ? p.size * 0.42 : p.size,
                  height: p.strip ? p.size * 1.7 : p.size,
                  background: p.color,
                  borderRadius: p.strip ? "1px" : "50%",
                  "--cx": `${p.cx}px`,
                  "--cpeak": `${p.cpeak}px`,
                  "--cfall": `${p.cfall}px`,
                  "--cr": `${p.cr}deg`,
                  animation: `confetti-pop ${p.duration}s cubic-bezier(0.18, 0.7, 0.4, 1) ${p.delay}s both`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
