const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 7.3 + 4) % 96,
  delay: (i % 7) * 0.9,
  duration: 7 + (i % 5) * 1.6,
  size: 7 + (i % 4) * 3,
  opacity: 0.35 + (i % 3) * 0.15,
}));

export function Petals() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block rounded-[50%_0_50%_0]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            background: i % 2 ? "var(--gold)" : "var(--sage)",
            opacity: p.opacity,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}