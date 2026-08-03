import eventHaldi from "@/assets/event-haldi.png";
import eventMehendi from "@/assets/event-mehendi.png";
import eventSangeet from "@/assets/event-cocktail.png";
import eventPelliKuthuru from "@/assets/event-pelli-kuthuru.png";
import eventPelliKoduku from "@/assets/event-vratam.png";
import eventPelli from "@/assets/event-wedding.png";
import venuePhoto from "@/assets/venue.jpg";
import palacePhoto from "@/assets/hero-palace.jpg";
import floralPhoto from "@/assets/closing-floral.jpg";

export const COUPLE = { bride: "Lasya", groom: "Avyay" };

/** ⚠️ Year is unconfirmed (reference doc said 2027) — change it here only. */
export const WEDDING_YEAR = 2026;

/** Muhurtham — Oct 31, 7:25 PM IST (13:55 UTC). */
export const WEDDING_DATE = new Date(Date.UTC(WEDDING_YEAR, 9, 31, 13, 55));

export const WEDDING_DATE_RANGE = `October 29–31, ${WEDDING_YEAR}`;

// TODO(phone): replace with the couple's real WhatsApp number (country code, no +).
export const WHATSAPP_NUMBER = "919000000000";

// TODO(content): replace with a real contact email.
export const CONTACT_EMAIL = "lasyaandavyay@example.com";

const IST = (month: number, day: number, hour: number, minute: number) =>
  new Date(Date.UTC(WEDDING_YEAR, month, day, hour - 5, minute - 30));

export type Venue = {
  name: string;
  /** A full Google Maps share link. Wins over mapsQuery when present. */
  mapsUrl?: string;
  /** Fallback: a search string. Directions stay hidden until one is set. */
  mapsQuery?: string;
};

export type WeddingEvent = {
  slug: string;
  name: string;
  theme?: string;
  time: string;
  /** Everything except the muhurtham is provisional. */
  tentative?: boolean;
  dressCode?: string;
  /** TODO(content): Mehendi's dress code is an inspiration photo, not text —
   *  drop the image in src/assets and point this at it. */
  dressCodeImage?: string;
  /** Renders a "Followed by" link to the event above it. */
  followsPrevious?: boolean;
  venue: Venue;
  img: string;
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
        theme: "Carnival",
        time: "12:00 PM onwards",
        tentative: true,
        venue: { name: "To be announced" }, // TODO(venue)
        img: eventHaldi,
        start: IST(9, 29, 12, 0),
        end: IST(9, 29, 16, 0),
      },
      {
        slug: "mehendi",
        name: "Mehendi",
        time: "5:00 PM onwards",
        tentative: true,
        followsPrevious: true,
        venue: { name: "To be announced" }, // TODO(venue)
        img: eventMehendi,
        start: IST(9, 29, 17, 0),
        end: IST(9, 29, 22, 0),
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
        theme: "Vintage",
        time: "9:30 AM onwards",
        tentative: true,
        dressCode: "Anything except sarees",
        venue: { name: "To be announced" }, // TODO(venue)
        img: eventPelliKuthuru,
        start: IST(9, 30, 9, 30),
        end: IST(9, 30, 13, 0),
      },
      {
        slug: "sangeet",
        name: "Sangeet & Cocktail Night",
        theme: "Bling • Masquerade Ball",
        time: "6:00 PM onwards",
        dressCode: "Bling / Sequins",
        venue: { name: "To be announced" }, // TODO(venue)
        img: eventSangeet,
        start: IST(9, 30, 18, 0),
        end: IST(9, 31, 0, 0),
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
        theme: "Vintage",
        time: "11:15 AM onwards",
        tentative: true,
        venue: { name: "To be announced" }, // TODO(venue)
        img: eventPelliKoduku,
        start: IST(9, 31, 11, 15),
        end: IST(9, 31, 14, 0),
      },
      {
        slug: "wedding",
        name: "Wedding Ceremony",
        time: "Muhurtham: 7:25 PM",
        venue: { name: "To be announced" }, // TODO(venue)
        img: eventPelli,
        start: IST(9, 31, 19, 25),
        end: IST(9, 31, 23, 59),
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
  location: "Hyderabad, Telangana", // TODO(venue)
  startUtc: IST(9, 29, 12, 0).toISOString(),
  endUtc: IST(9, 31, 23, 0).toISOString(),
};

export const GALLERY = [
  { caption: "The first monsoon", rotate: -3 },
  { caption: "Coorg, 2023", rotate: 2 },
  { caption: "She said yes", rotate: -1.5 },
];

// TODO(content): all detail-card copy below is placeholder.
export const DETAIL_CARDS = [
  { title: "Accommodation", img: palacePhoto, body: "Room blocks and booking codes — coming soon." },
  { title: "Travel", img: venuePhoto, body: "Airports, trains and getting to Hyderabad — coming soon." },
  { title: "Nearby Hotels", img: palacePhoto, body: "Our favourite places to stay near the venues — coming soon." },
  { title: "Transportation", img: floralPhoto, body: "Shuttle timings between the hotels and venues — coming soon." },
];
