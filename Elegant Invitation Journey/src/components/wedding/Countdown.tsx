import { useEffect, useState } from "react";
import { WEDDING_DATE } from "./data";

function diff() {
  const ms = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    Days: Math.floor(ms / 86400000),
    Hours: Math.floor(ms / 3600000) % 24,
    Minutes: Math.floor(ms / 60000) % 60,
    Seconds: Math.floor(ms / 1000) % 60,
  };
}

const UNITS = ["Days", "Hours", "Minutes", "Seconds"] as const;

/** Cordially-style countdown: big serif numerals, hairline labels, no boxes. */
export function Countdown() {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-start justify-center">
      {UNITS.map((k, i) => (
        <div key={k} className="flex items-start">
          {i > 0 && (
            <span className="mx-1.5 pt-1 font-display text-4xl text-[var(--gold)] sm:mx-2.5" aria-hidden="true">
              :
            </span>
          )}
          <div className="flex min-w-[3.2rem] flex-col items-center">
            <span className="font-display text-5xl leading-none text-foreground tabular-nums sm:text-6xl">
              {t ? String(t[k]).padStart(2, "0") : "--"}
            </span>
            <span className="mt-2.5 font-body text-[0.52rem] font-medium tracking-[0.28em] uppercase text-muted-foreground">
              {k}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
