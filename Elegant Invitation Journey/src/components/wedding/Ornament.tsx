export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="rule-gold w-16 sm:w-24" />
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3c1.8 2.6 4.2 3.6 7 3.6-1.4 2.6-1.4 5.2 0 7.8-2.8 0-5.2 1-7 3.6-1.8-2.6-4.2-3.6-7-3.6 1.4-2.6 1.4-5.2 0-7.8 2.8 0 5.2-1 7-3.6Z"
          stroke="var(--gold)"
          strokeWidth="0.9"
        />
        <circle cx="12" cy="10.5" r="1.4" fill="var(--gold)" opacity="0.7" />
      </svg>
      <span className="rule-gold w-16 sm:w-24" />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow text-center">{children}</p>;
}