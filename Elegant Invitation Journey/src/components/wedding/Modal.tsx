import { useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Shared premium bottom-sheet modal: dimmed backdrop, slide-up sheet,
 * body scroll lock, Esc / X / backdrop close.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className="fixed inset-0 z-[80]"
      style={{
        pointerEvents: open ? "auto" : "none",
        visibility: open ? "visible" : "hidden",
        transitionProperty: "visibility",
        transitionDuration: open ? "0ms" : "500ms",
      }}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-foreground/25"
        style={{
          backdropFilter: "blur(2px)",
          transition: "opacity 420ms ease",
          opacity: open ? 1 : 0,
        }}
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="absolute inset-x-0 bottom-0 mx-auto max-h-[86dvh] w-full max-w-[26rem] overflow-y-auto rounded-t-[24px] bg-pearl px-6 pt-5 shadow-[0_-20px_60px_-20px_oklch(0.28_0.02_60/0.35)]"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)",
          transition: "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
          transform: open ? "translateY(0)" : "translateY(105%)",
        }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)]" aria-hidden="true" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-5 flex size-8 items-center justify-center rounded-full bg-secondary text-lg leading-none text-foreground/70 transition-colors hover:text-foreground"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
