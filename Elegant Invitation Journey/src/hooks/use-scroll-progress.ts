import { useEffect, useRef, useState } from "react";

/** 0 → 1 as `el` scrolls from its natural position to fully past the viewport. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const measure = () => {
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const p = scrollable > 0 ? -top / scrollable : -top / Math.max(1, height);
      setProgress(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return [ref, progress] as const;
}
