import { useEffect, useState } from "react";
import { COUPLE } from "./data";
import { Ornament } from "./Ornament";
import { Petals } from "./Petals";
import floral from "@/assets/envelope-floral.jpg";

const floralSkin = {
  backgroundImage: `url(${floral})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

type Stage = "closed" | "unfolding" | "rising" | "revealed";

export function Envelope({ onEnter }: { onEnter: () => void }) {
  const [stage, setStage] = useState<Stage>("closed");

  useEffect(() => {
    if (stage === "unfolding") {
      const t = setTimeout(() => setStage("rising"), 1200);
      return () => clearTimeout(t);
    }
    if (stage === "rising") {
      const t = setTimeout(() => setStage("revealed"), 1400);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const open = stage !== "closed";
  const risen = stage === "rising" || stage === "revealed";


  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[26rem] items-center justify-center overflow-hidden bg-transparent">
      {open && <Petals />}

      <div className="relative h-[100dvh] w-full" style={{ perspective: "1400px" }}>
        {/* Invitation card emerging from the centre */}
        <div
          className="absolute inset-x-4 top-1/2 origin-center transition-all duration-[1400ms]"
          style={{
            zIndex: open ? 50 : 10,
            transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
            transform: risen
              ? "translate(0, -50%) scale(1)"
              : open
                ? "translate(0, -50%) scale(0.86)"
                : "translate(0, -50%) scale(0.6)",
            transitionDelay: risen ? "0ms" : "700ms",
            opacity: open ? 1 : 0,
          }}
        >
          <div className="relative rounded-sm px-6 py-9 text-center text-shadow-soft">
            <p className="eyebrow">Together with their families</p>
            <h1 className="mt-6 font-display text-4xl leading-tight tracking-wide text-olive">
              {COUPLE.bride}
              <span className="mx-2 font-script text-3xl text-gold">&</span>
              {COUPLE.groom}
            </h1>
            <p className="mt-4 font-body text-[0.7rem] leading-relaxed tracking-[0.18em] uppercase text-muted-foreground">
              request the pleasure of your company
            </p>
            <Ornament className="my-6" />
            <p className="font-display text-lg tracking-[0.3em] text-foreground">OCTOBER 31</p>
            <button
              type="button"
              onClick={onEnter}
              disabled={stage !== "revealed"}
              className="mt-8 w-full rounded-sm bg-olive px-6 py-3 font-body text-[0.7rem] tracking-[0.28em] text-ivory uppercase transition-opacity duration-500 hover:opacity-90 disabled:opacity-0"
            >
              Begin Experience
            </button>
          </div>
        </div>

        {/* Envelope body */}
        <button
          type="button"
          onClick={() => stage === "closed" && setStage("unfolding")}
          aria-label="Tap to open the invitation"
          className="relative z-20 block h-full w-full cursor-pointer text-left"
          style={{ pointerEvents: open ? "none" : "auto" }}
        >
          <div
            className="relative h-full w-full transition-all duration-[1200ms]"
            style={{
              ...floralSkin,
              transformStyle: "preserve-3d",
              transitionTimingFunction: "cubic-bezier(0.6,0,0.2,1)",
              transform: open ? "rotateX(6deg)" : "rotateX(0deg)",
            }}
          >
            {/* Top half opening upward from the centre line */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 origin-bottom transition-transform duration-[1100ms]"
              style={{
                zIndex: 30,
                transitionTimingFunction: "cubic-bezier(0.6,0,0.2,1)",
                transform: open ? "rotateX(-168deg)" : "rotateX(0deg)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                ...floralSkin,
                backgroundPosition: "center top",
                filter: "brightness(1.06)",
                boxShadow: "0 12px 30px -18px oklch(0.2 0.03 130 / 0.7)",
              }}
            >
              <div
                className="absolute inset-x-0 bottom-[10%] flex flex-col items-center px-8 text-center transition-opacity duration-500"
                style={{ opacity: open ? 0 : 1 }}
              >
                <span className="font-script text-5xl text-olive/90">You are invited</span>
              </div>
            </div>
            {/* Wax seal */}
            <div
              className="absolute left-1/2 top-1/2 z-40 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500"
              style={{
                background:
                  "radial-gradient(circle at 34% 28%, color-mix(in oklab, var(--wax) 82%, white), var(--wax) 45%, var(--wax-deep) 100%)",
                boxShadow:
                  "0 10px 24px -8px oklch(0.2 0.05 28 / 0.55), inset 0 2px 6px oklch(1 0 0 / 0.25), inset 0 -6px 12px oklch(0.25 0.08 28 / 0.5)",
                opacity: open ? 0 : 1,
                transform: `translate(-50%, -50%) scale(${open ? 0.6 : 1})`,
              }}
            >
              <span className="font-script text-4xl text-ivory/90 drop-shadow-sm">
                {COUPLE.bride[0]}
                {COUPLE.groom[0]}
              </span>
            </div>
            {/* Bottom half opening downward from the centre line */}
            <div
              className="absolute inset-x-0 bottom-0 z-30 h-1/2 origin-top transition-transform duration-[1100ms]"
              style={{
                ...floralSkin,
                backgroundPosition: "center bottom",
                transitionTimingFunction: "cubic-bezier(0.6,0,0.2,1)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                transform: open ? "rotateX(168deg)" : "rotateX(0deg)",
                boxShadow: "0 -12px 30px -18px oklch(0.2 0.03 130 / 0.7)",
              }}
            >
              <div
                className="absolute inset-x-0 top-[14%] flex flex-col items-center gap-4 px-8 text-center transition-opacity duration-500"
                style={{ opacity: open ? 0 : 1 }}
              >
                <span className="font-body text-[0.62rem] tracking-[0.34em] uppercase text-olive/90">
                  Tap to open
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}