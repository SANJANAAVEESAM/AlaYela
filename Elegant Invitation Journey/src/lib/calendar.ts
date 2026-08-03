export type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  /** ISO instants, e.g. "2026-10-31T13:55:00Z" */
  startUtc: string;
  endUtc: string;
};

function icsStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${icsStamp(event.startUtc)}/${icsStamp(event.endUtc)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Downloads a .ics file — opens in Apple Calendar, Outlook, and most others. */
export function downloadIcs(event: CalendarEvent) {
  const uid = `${icsStamp(event.startUtc)}-${event.title.replace(/\W+/g, "")}@lasya-avyay`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lasya & Avyay//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsStamp(new Date().toISOString())}`,
    `DTSTART:${icsStamp(event.startUtc)}`,
    `DTEND:${icsStamp(event.endUtc)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DESCRIPTION:${icsEscape(event.description)}`,
    `LOCATION:${icsEscape(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.toLowerCase().replace(/\W+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
