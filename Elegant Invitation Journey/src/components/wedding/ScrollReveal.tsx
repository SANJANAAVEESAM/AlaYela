import { useScrollProgress } from "@/hooks/use-scroll-progress";

const LINES = ["you're cordially", "invited to celebrate", "our story"];

/** Each line's [start, end] window in the section's 0–1 scroll progress. */
const RAMPS: [number, number][] = [
  [0.06, 0.3],
  [0.33, 0.55],
  [0.58, 0.8],
];

const UNINKED = [201, 197, 190]; // #C9C5BE — warm gray, barely there
const INKED = [45, 41, 38]; // #2D2926 — rich charcoal

/** Eases the ramp so ink arrives gradually rather than on a linear slope. */
const smoothstep = (t: number) => t * t * (3 - 2 * t);

function inkStyle(progress: number, [start, end]: [number, number]) {
  const raw = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  const t = smoothstep(raw);
  const rgb = UNINKED.map((from, i) => Math.round(from + (INKED[i] - from) * t));
  return {
    color: `rgb(${rgb.join(", ")})`,
    opacity: 0.4 + 0.6 * t,
    filter: `blur(${(1 - t).toFixed(2)}px)`,
  };
}

/**
 * Scroll-reveal typography — the words ink themselves onto the page, line by
 * line, tied directly to scroll position. Reverses as you scroll back up.
 */
export function ScrollReveal() {
  const [ref, progress] = useScrollProgress<HTMLDivElement>();

  return (
    // Pulled up into the space the hero card vacates as it collapses, so the
    // lines rise into view while the card is still pinned rather than a screen
    // and a half later. The hero sits above this, hiding the overlap.
    <div ref={ref} className="relative z-0 h-[150vh]" style={{ marginTop: "-54vh" }}>
      {/* Deliberately shorter than the viewport: whatever sits below the type
          inside this box becomes dead space before the next section can start. */}
      <div className="sticky top-0 flex h-[72dvh] items-center justify-center px-[5%]">
        <p
          className="w-full text-center font-display leading-[1.0]"
          style={{ fontSize: "clamp(2.4rem, 12vw, 3.1rem)", letterSpacing: "-0.015em", fontWeight: 600 }}
        >
          {LINES.map((line, i) => (
            <span key={line} className="block" style={inkStyle(progress, RAMPS[i])}>
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
