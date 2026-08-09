import type { DressCode } from "./data";

/**
 * The dress code, set as its own passage between hairlines.
 *
 * The rules are what separate it from the address above and the photo link
 * below — without them the guidance ran on as another line of the invitation.
 * They take the event's accent, so each celebration rules its own.
 *
 * Text only. Swatches were tried and read as a colour picker: a piece of
 * interface in the middle of an invitation.
 */
export function DressCodeArt({
  dressCode,
  ink,
  inkSoft,
  accent,
}: {
  dressCode: DressCode;
  ink?: string;
  inkSoft?: string;
  accent?: string;
}) {
  const rule = (
    <span
      aria-hidden="true"
      className="block h-px w-16"
      style={{ background: accent, opacity: 0.45 }}
    />
  );

  return (
    <div className="flex flex-col items-center gap-3">
      {rule}

      <p
        className="font-body text-[0.55rem] font-medium tracking-[0.26em] uppercase"
        style={{ color: inkSoft }}
      >
        Dress code
      </p>

      <p className="font-display text-[1.5rem] leading-none" style={{ color: ink }}>
        {dressCode.label}
      </p>

      {dressCode.note && (
        <p
          className="mx-auto max-w-[17.5rem] font-body text-[0.78rem] leading-relaxed"
          style={{ color: inkSoft }}
        >
          {dressCode.note}
        </p>
      )}

      {dressCode.lines && (
        <div className="mx-auto flex max-w-[17.5rem] flex-col gap-1.5">
          {dressCode.lines.map((line) => (
            <p key={line.who} className="font-body text-[0.78rem] leading-relaxed" style={{ color: inkSoft }}>
              {/* The "who" carries the weight — guests look for their own line. */}
              <span className="font-semibold" style={{ color: ink }}>
                {line.who}:
              </span>{" "}
              {line.what}
            </p>
          ))}
        </div>
      )}

      {dressCode.images && dressCode.images.length > 0 && (
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {dressCode.images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="size-16 rounded-[10px] object-cover"
              style={{
                border: `1px solid color-mix(in oklab, ${accent ?? "currentColor"} 40%, transparent)`,
              }}
            />
          ))}
        </div>
      )}

      {rule}
    </div>
  );
}
