
export const COUPLE = { bride: "Lasya", groom: "Avyay" };

/** ⚠️ Year is unconfirmed (reference doc said 2027) — change it here only. */
export const WEDDING_YEAR = 2026;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A wall-clock Eastern time, as an instant.
 *
 * Late October sits before US daylight saving ends — the first Sunday in
 * November — so these dates are EDT, UTC-4, in 2026 and 2027 alike. Month is
 * zero-based, matching Date.
 */
const ET = (month: number, day: number, hour: number, minute: number) =>
  new Date(`${WEDDING_YEAR}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00-04:00`);

/** Muhurtham — Oct 31, 7:25 PM Eastern. */
export const WEDDING_DATE = ET(9, 31, 19, 25);

export const WEDDING_DATE_RANGE = `October 29–31, ${WEDDING_YEAR}`;

export const WHATSAPP_NUMBER = "18326686089";

export const CONTACT_EMAIL = "lasyaandavyay@gmail.com";

/**
 * Shared album guests upload their own photos to — a Google Photos shared
 * album link works well, since anyone with the link can add to it without
 * an account. The button stays hidden until this is set.
 */
// TODO(photos): paste the shared album link here.
export const PHOTO_UPLOAD_URL: string | undefined = undefined;

import type { EventTheme } from "./eventThemes";

/**
 * A dress code the sheet can draw rather than merely state.
 *
 * `kind` selects the swatch row: a spread of hues for "solids", metallics for
 * "bling". Only the three events that actually have a code carry one.
 */
export type DressCode = {
  kind: "solids" | "bling";
  label: string;
  note?: string;
};

export type Venue = {
  name: string;
  /** Street or area line shown under the venue name. */
  address?: string;
  /** A full Google Maps share link. Wins over mapsQuery when present. */
  mapsUrl?: string;
  /** Fallback: a search string. Directions stay hidden until one is set. */
  mapsQuery?: string;
};

export type WeddingEvent = {
  slug: string;
  name: string;
  theme?: string;
  /** Drives the accent and motif on the event's full-page details. */
  themeKey: EventTheme;
  time: string;
  /** Everything except the muhurtham is provisional. */
  tentative?: boolean;
  dressCode?: DressCode;
  /** TODO(content): Mehendi's dress code is an inspiration photo, not text —
   *  drop the image in src/assets and point this at it. */
  dressCodeImage?: string;
  /** Renders a "Followed by" link to the event above it. */
  followsPrevious?: boolean;
  venue: Venue;
  start: Date;
  end: Date;
};

export type EventDay = {
  date: string;
  weekday: string;
  events: WeddingEvent[];
};

export const EVENT_DAYS: EventDay[] = [
  {
    date: "29 October",
    weekday: "Thursday",
    events: [
      {
        slug: "haldi",
        name: "Haldi",
        themeKey: "carnival",
        theme: "Carnival",
        time: "12:00 PM onwards",
        tentative: true,
        dressCode: {
          kind: "solids",
          label: "Solid colours",
          note: "Any colour at all — just keep it one solid block rather than a print.",
        },
        venue: { name: "To be announced" }, // TODO(venue)
        start: ET(9, 29, 12, 0),
        end: ET(9, 29, 16, 0),
      },
      {
        slug: "mehendi",
        name: "Mehendi",
        themeKey: "mehendi",
        theme: "Carnival",
        time: "5:00 PM onwards",
        tentative: true,
        followsPrevious: true,
        dressCode: {
          kind: "solids",
          label: "Solid colours",
          note: "Any colour at all — just keep it one solid block rather than a print.",
        },
        venue: { name: "To be announced" }, // TODO(venue)
        start: ET(9, 29, 17, 0),
        end: ET(9, 29, 22, 0),
      },
    ],
  },
  {
    date: "30 October",
    weekday: "Friday",
    events: [
      {
        slug: "pellikuthuru",
        name: "Pellikuthuru",
        themeKey: "pellikuthuru",
        theme: "Vintage",
        time: "9:30 AM onwards",
        tentative: true,
        venue: { name: "To be announced" }, // TODO(venue)
        start: ET(9, 30, 9, 30),
        end: ET(9, 30, 13, 0),
      },
      {
        slug: "sangeet",
        name: "Sangeet & Cocktail Night",
        themeKey: "masquerade",
        theme: "Bling • Masquerade Ball",
        time: "6:00 PM onwards",
        dressCode: {
          kind: "bling",
          label: "Bling",
          note: "Sequins, shimmer and metallics — the more it catches the light, the better.",
        },
        venue: {
          name: "Luxe Event Venue",
          address: "10213 John Adams Rd, Charlotte, NC 28262",
          mapsUrl:
            "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x88541d7fe97a02a5:0x54f177497cd295da?entry=s&sa=X&ved=2ahUKEwiV4qiysf6VAxWyj4kEHTiHF2IQ4kB6BAgEEAA&hl=en",
        },
        start: ET(9, 30, 18, 0),
        end: ET(9, 31, 0, 0),
      },
    ],
  },
  {
    date: "31 October",
    weekday: "Saturday",
    events: [
      {
        slug: "pellikoduku",
        name: "Pellikoduku",
        themeKey: "pellikoduku",
        theme: "Vintage",
        time: "11:15 AM onwards",
        tentative: true,
        venue: { name: "To be announced" }, // TODO(venue)
        start: ET(9, 31, 11, 15),
        end: ET(9, 31, 14, 0),
      },
      {
        slug: "wedding",
        name: "Wedding Ceremony",
        themeKey: "telugu",
        theme: "Telugu Elegance",
        time: "Muhurtham: 7:25 PM",
        venue: {
          name: "Sweet Magnolia Estate",
          address: "10101 Bailey Rd, Cornelius, NC 28031",
          mapsUrl:
            "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x8856a90c1f2caa73:0xcc55dd654a58f67d?entry=s&sa=X&ved=2ahUKEwirvNPhsf6VAxX238kDHdhBNe4Q4kB6BAgVEAA&hl=en",
        },
        start: ET(9, 31, 19, 25),
        end: ET(9, 31, 23, 59),
      },
    ],
  },
];

/** Directions link, or null while the venue is still unconfirmed. */
export function venueMapsHref(venue: Venue): string | null {
  if (venue.mapsUrl) return venue.mapsUrl;
  if (venue.mapsQuery)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
  return null;
}

export const EVENTS: WeddingEvent[] = EVENT_DAYS.flatMap((day) => day.events);

export const TIMING_NOTE =
  "Please note that all event timings, except the wedding muhurtham, are tentative and may be updated closer to the celebrations.";

export const FULL_WEDDING_CAL = {
  title: `${COUPLE.bride} & ${COUPLE.groom} — Wedding Celebrations`,
  description: `Three days of celebrations for the wedding of ${COUPLE.bride} & ${COUPLE.groom}. Muhurtham on October 31 at 7:25 PM.`,
  location: "Charlotte, North Carolina",
  startUtc: ET(9, 29, 12, 0).toISOString(),
  endUtc: ET(9, 31, 23, 0).toISOString(),
};

export const GALLERY = [
  { caption: "The first monsoon", rotate: -3 },
  { caption: "Coorg, 2023", rotate: 2 },
  { caption: "She said yes", rotate: -1.5 },
];

export type DetailIcon = "bed" | "plane" | "hotel" | "car";

// TODO(content): hotel names, rates, booking codes and shuttle timings still
// need to be filled in by the couple — the copy below says so plainly rather
// than promising details that may not arrive.
export const DETAIL_CARDS: {
  title: string;
  icon: DetailIcon;
  body: string;
  /** Appends the full venue list, with directions, under the copy. */
  venues?: boolean;
}[] = [
  {
    title: "Accommodation",
    icon: "bed",
    body: "Celebrations are spread across Charlotte and Cornelius, so anywhere around University City or Lake Norman keeps you close to everything.\n\nWe're sorting out room blocks now. Hotel names, rates and booking codes will appear here as soon as they're set, and everyone who RSVPs will hear from us directly.",
  },
  {
    title: "Travel",
    icon: "plane",
    body: "Charlotte Douglas International (CLT) is the closest airport and the easiest arrival for almost everyone. It's a major hub, so most guests will find a direct flight.\n\nFrom the airport it's roughly half an hour to the venues, traffic depending. Rental cars, Uber and Lyft are all easy to find at CLT, and we'd suggest a car — the venues are a little spread out and not walkable from one another.",
  },
  {
    title: "Nearby Hotels",
    icon: "hotel",
    body: "For the Sangeet at Luxe Event Venue, look around University City in north-east Charlotte. For the wedding at Sweet Magnolia Estate, Cornelius and Huntersville sit closest.\n\nOnce our room blocks are confirmed we'll list the specific hotels here with booking links.",
  },
  {
    title: "Transportation",
    icon: "car",
    body: "We're looking into shuttles between the hotels and the venues. If they're arranged, timings and pick-up points will be posted here.\n\nUntil then, please plan on driving or booking a ride — Uber and Lyft cover the whole area reliably. Every venue is below; tap an address for directions.",
    venues: true,
  },
];
