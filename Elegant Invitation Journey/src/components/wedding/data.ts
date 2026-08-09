
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
 * Who to call. `tel` is the number that rings; `whatsapp` is only set when the
 * account lives on a different number, as Avyay's does — sending Chat to the
 * calling number would reach nobody.
 */
export const CONTACTS: {
  name: string;
  tel: string;
  display: string;
  whatsapp?: string;
}[] = [
  { name: COUPLE.bride, tel: "+18326689442", display: "+1 832 668 9442" },
  {
    name: COUPLE.groom,
    tel: "+17049066859",
    display: "+1 704 906 6859",
    whatsapp: "+919550634521",
  },
];

import type { EventTheme } from "./eventThemes";

/**
 * Shared Drive folders guests add their own photos to. Haldi and Mehendi share
 * one, as supplied by the couple.
 *
 * Each folder must be shared so that anyone with the link can *contribute*, not
 * just view — otherwise the button leads guests to a wall.
 */
export const GALLERY_FOLDERS: { label: string; url: string }[] = [
  {
    label: "Haldi & Mehendi",
    url: "https://drive.google.com/drive/folders/1Rb5ErOBBV1mQTkxFFEB5_CsrUfCBRxMI?usp=drive_link",
  },
  {
    label: "Pellikuthuru",
    url: "https://drive.google.com/drive/folders/1smOuRVF_4XYjHh0zeiK7V9qyUKITsvlJ?usp=drive_link",
  },
  {
    label: "Pellikoduku",
    url: "https://drive.google.com/drive/folders/1XkwXCSAN68BDPdSGGNjUnxXIWKdX1ue4?usp=drive_link",
  },
  {
    label: "Sangeet & Cocktail Night",
    url: "https://drive.google.com/drive/folders/120l9T4qSeIYm4RiQ7KfWzW3qdNidNsPr?usp=sharing",
  },
  {
    // TODO(photos): supplied without a label — assumed to be the wedding, being
    // the only celebration left. Confirm before the invitations go out.
    label: "Wedding Ceremony",
    url: "https://drive.google.com/drive/folders/1LRC3mlJclf4CjmCsnI8_ddAj9hBAZj36?usp=drive_link",
  },
];


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
  /** Shared folder for this celebration's photos. */
  photosUrl?: string;
  /** Held at the same place as the event above it, so they list as one. */
  sharesVenueWithPrevious?: boolean;
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
          note: "Any colour at all — just keep it one solid block.",
        },
        photosUrl: GALLERY_FOLDERS[0].url,
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
          note: "Any colour at all — just keep it one solid block.",
        },
        photosUrl: GALLERY_FOLDERS[0].url,
        sharesVenueWithPrevious: true,
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
        photosUrl: GALLERY_FOLDERS[1].url,
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
        photosUrl: GALLERY_FOLDERS[3].url,
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
        photosUrl: GALLERY_FOLDERS[2].url,
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
        photosUrl: GALLERY_FOLDERS[4].url,
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

/**
 * Hotels near the celebrations. Linked by name rather than by a stored URL:
 * a Maps search resolves to the place page — address, photos, reviews and
 * booking links — and cannot rot the way a copied URL can.
 */
export const HOTELS: string[] = [
  "Four Points by Sheraton Charlotte - Lake Norman",
  "Courtyard by Marriott Charlotte Lake Norman",
  "Comfort Suites Huntersville near Lake Norman",
  "Best Western Plus Huntersville Inn",
  "SpringHill Suites by Marriott Charlotte Huntersville",
];

export const hotelHref = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

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

export type DetailIcon = "bed" | "plane" | "camera" | "pin";

// TODO(content): hotel names, rates, booking codes and shuttle timings still
// need to be filled in by the couple — the copy below says so plainly rather
// than promising details that may not arrive.
export const DETAIL_CARDS: {
  title: string;
  icon: DetailIcon;
  body: string;
  /** Appends the full venue list, with directions, under the copy. */
  venues?: boolean;
  /** Appends the shared photo folders under the copy. */
  gallery?: boolean;
  /** Appends the nearby hotels under the copy. */
  hotels?: boolean;
}[] = [
  {
    title: "Accommodation",
    icon: "bed",
    body: "These are the places we'd suggest, all close to the celebrations around Lake Norman and Huntersville. Tap any one to see it on Google — address, photos and reviews.\n\nWe're still sorting room blocks; rates and booking codes will appear here once they're set.",
    hotels: true,
  },
  {
    title: "Travel",
    icon: "plane",
    body: "Charlotte Douglas International (CLT) is the closest airport and the easiest arrival for almost everyone. It's a major hub, so most guests will find a direct flight.\n\nFrom the airport it's roughly half an hour to the venues, traffic depending. Rental cars, Uber and Lyft are all easy to find at CLT, and we'd suggest a car — the venues are a little spread out and not walkable from one another.",
  },
  {
    title: "Gallery",
    icon: "camera",
    body: "Every celebration has its own shared folder. Add the photos you take, and look through everyone else's.",
    gallery: true,
  },
  {
    title: "Venues",
    icon: "pin",
    body: "Where each celebration is held. Tap any address for directions.",
    venues: true,
  },
];
