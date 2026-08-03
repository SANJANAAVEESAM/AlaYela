import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadIcs, googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

export function AddToCalendar({
  event,
  compact = false,
}: {
  event: CalendarEvent;
  compact?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            compact
              ? "inline-flex items-center gap-2 rounded-lg border border-[var(--silver)]/60 bg-ivory px-4 py-2 font-body text-[0.6rem] font-medium tracking-[0.2em] uppercase text-foreground/80 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              : "inline-flex items-center gap-2 rounded-xl border border-[var(--silver)]/60 bg-ivory px-7 py-3.5 font-body text-[0.66rem] font-medium tracking-[0.24em] uppercase text-foreground/85 shadow-[0_10px_28px_-14px_oklch(0.28_0.02_60/0.45)] transition-all hover:shadow-[0_14px_34px_-14px_oklch(0.28_0.02_60/0.55)] active:scale-[0.98]"
          }
        >
          Add to Calendar
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="border-[var(--silver)]/50 bg-pearl font-body">
        <DropdownMenuItem
          onSelect={() => window.open(googleCalendarUrl(event), "_blank", "noopener")}
          className="text-xs tracking-wide"
        >
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => downloadIcs(event)} className="text-xs tracking-wide">
          Apple / Outlook (.ics)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
