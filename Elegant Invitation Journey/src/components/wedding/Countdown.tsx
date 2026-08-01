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

export function Countdown() {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {(["Days", "Hours", "Minutes", "Seconds"] as const).map((k) => (
        <div
          key={k}
          className="rounded-sm border border-[var(--gold)]/30 bg-ivory/80 px-1 py-5 text-center"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="font-display text-3xl text-olive tabular-nums sm:text-4xl">
            {t ? String(t[k]).padStart(2, "0") : "--"}
          </div>
          <div className="mt-2 font-body text-[0.55rem] tracking-[0.24em] uppercase text-muted-foreground">
            {k}
          </div>
        </div>
      ))}
    </div>
  );
}