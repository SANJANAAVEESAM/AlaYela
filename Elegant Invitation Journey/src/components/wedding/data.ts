import eventHaldi from "@/assets/event-haldi.png";
import eventMehendi from "@/assets/event-mehendi.png";
import eventSangeet from "@/assets/event-cocktail.png";
import eventPelliKuthuru from "@/assets/event-pelli-kuthuru.png";
import eventPelliKoduku from "@/assets/event-vratam.png";
import eventPelli from "@/assets/event-wedding.png";
import venuePhoto from "@/assets/venue.jpg";
import palacePhoto from "@/assets/hero-palace.jpg";
import floralPhoto from "@/assets/closing-floral.jpg";
import envelopeFloralPhoto from "@/assets/envelope-floral.jpg";

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

export type WeddingEvent = {
  slug: string;
  name: string;
  theme: string;
  day: string;
  date: string;
  time: string;
  note?: string;
  dressCode: string;
  description: string;
  img: string;
  venueName: string;
  venueQuery: string;
  start: Date;
  end: Date;
};

// TODO(venue): every venueName/venueQuery below is a placeholder.
export const EVENTS: WeddingEvent[] = [
  {
    slug: "haldi",
    name: "Haldi",
    theme: "Carnival",
    day: "Oct 29",
    date: `Thursday, October 29, ${WEDDING_YEAR}`,
    time: "12:00 PM onwards",
    note: "Time subject to change · Mehendi follows at 5 PM",
    dressCode: "Yellows, marigold orange and festive cottons you don't mind staining.",
    description:
      "The celebrations open with a carnival of marigold garlands, dhol players and a turmeric ceremony under festoon lights. Come ready to be coloured — and to laugh through it.",
    img: eventHaldi,
    venueName: "Venue to be announced",
    venueQuery: "Hyderabad Telangana",
    start: IST(9, 29, 12, 0),
    end: IST(9, 29, 16, 0),
  },
  {
    slug: "mehendi",
    name: "Mehendi",
    theme: "Garden lanterns",
    day: "Oct 29",
    date: `Thursday, October 29, ${WEDDING_YEAR}`,
    time: "5:00 PM onwards",
    note: "Time subject to change",
    dressCode: "Garden greens, mint and soft ivory. Sleeves that roll up easily.",
    description:
      "As the light softens, the courtyard fills with low seating, hanging lanterns and henna artists. Live sitar and ghazals carry the evening while designs dry.",
    img: eventMehendi,
    venueName: "Venue to be announced",
    venueQuery: "Hyderabad Telangana",
    start: IST(9, 29, 17, 0),
    end: IST(9, 29, 22, 0),
  },
  {
    slug: "pellikuthuru",
    name: "Pellikuthuru",
    theme: "Vintage",
    day: "Oct 30",
    date: `Friday, October 30, ${WEDDING_YEAR}`,
    time: "9:30 AM onwards",
    note: "Time subject to change",
    dressCode: "Anything except sarees — vintage touches encouraged.",
    description:
      "Family gathers amid muted florals and aged-paper elegance to bless the bride with sacred water, flower garlands and whispered wishes. An intimate, emotional morning.",
    img: eventPelliKuthuru,
    venueName: "Venue to be announced",
    venueQuery: "Hyderabad Telangana",
    start: IST(9, 30, 9, 30),
    end: IST(9, 30, 13, 0),
  },
  {
    slug: "sangeet",
    name: "Sangeet & Cocktail",
    theme: "Masquerade Ball — Bling",
    day: "Oct 30",
    date: `Friday, October 30, ${WEDDING_YEAR}`,
    time: "6:00 PM onwards",
    note: "Time subject to change",
    dressCode: "Masquerade glamour — jewel tones, sequins, crystal, and a mask if you dare.",
    description:
      "Deep emerald, velvet and crystal sparkle. A masquerade evening of choreographed dances, heartfelt toasts and a dance floor that stays busy until midnight — bring your bling.",
    img: eventSangeet,
    venueName: "Venue to be announced",
    venueQuery: "Hyderabad Telangana",
    start: IST(9, 30, 18, 0),
    end: IST(9, 31, 0, 0),
  },
  {
    slug: "pellikoduku",
    name: "Pellikoduku",
    theme: "Vintage",
    day: "Oct 31",
    date: `Saturday, October 31, ${WEDDING_YEAR}`,
    time: "11:15 AM onwards",
    note: "Time subject to change",
    dressCode: "Vintage elegance — muted tones and traditional silhouettes.",
    description:
      "The wedding day begins with the groom's blessing ceremony — muted florals, aged paper and elegant borders frame a morning of prayers, turmeric and family.",
    img: eventPelliKoduku,
    venueName: "Venue to be announced",
    venueQuery: "Hyderabad Telangana",
    start: IST(9, 31, 11, 15),
    end: IST(9, 31, 14, 0),
  },
  {
    slug: "wedding",
    name: "Wedding Ceremony",
    theme: "Muhurtham",
    day: "Oct 31",
    date: `Saturday, October 31, ${WEDDING_YEAR}`,
    time: "Muhurtham at 7:25 PM",
    note: "The main ceremony",
    dressCode: "Wedding formal — ivories, golds and flowing silhouettes.",
    description:
      "The day itself. Ivory paper, temple-inspired gold line art, white florals and candlelight glow. Please be seated by 7:00 PM for the 7:25 PM muhurtham.",
    img: eventPelli,
    venueName: "Venue to be announced",
    venueQuery: "Hyderabad Telangana",
    start: IST(9, 31, 19, 25),
    end: IST(9, 31, 23, 59),
  },
];

/** One calendar entry spanning the whole wedding, used by the hero button. */
export const FULL_WEDDING_CAL = {
  title: `${COUPLE.bride} & ${COUPLE.groom} — Wedding Celebrations`,
  description: `Three days of celebrations for the wedding of ${COUPLE.bride} & ${COUPLE.groom}. Muhurtham on October 31 at 7:25 PM.`,
  location: "Hyderabad, Telangana", // TODO(venue)
  startUtc: IST(9, 29, 12, 0).toISOString(),
  endUtc: IST(9, 31, 23, 0).toISOString(),
};

export function mapsHref(query: string) {
  // TODO(venue): swap search links for the real Google Maps share links.
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const GALLERY = [
  { caption: "The first monsoon", rotate: -3 },
  { caption: "Coorg, 2023", rotate: 2 },
  { caption: "She said yes", rotate: -1.5 },
];

export const EDITORIAL_COPY =
  "The vision is simple: all of our most beloved people in one place, over three days of colour, music and one very important muhurtham.";

// TODO(content): all detail-card copy below is placeholder.
export const DETAIL_CARDS = [
  { title: "Wedding Party", img: floralPhoto, body: "Meet the people standing with us — coming soon." },
  { title: "Accommodation", img: palacePhoto, body: "Room blocks and booking codes — coming soon." },
  { title: "Travel", img: venuePhoto, body: "Airports, trains and getting to Hyderabad — coming soon." },
  { title: "Dress Codes", img: envelopeFloralPhoto, body: "A closer look at each evening's dress code — coming soon." },
  { title: "Venue Information", img: venuePhoto, body: "Maps, entrances and parking for each venue — coming soon." },
  { title: "Nearby Hotels", img: palacePhoto, body: "Our favourite places to stay near the venues — coming soon." },
  { title: "Transportation", img: floralPhoto, body: "Shuttle timings between the hotels and venues — coming soon." },
];

export const FAQS = [
  { q: "When should I RSVP by?", a: "Please RSVP by September 30 so we can plan seats and plates. " /* TODO(content) */ },
  { q: "Can I bring a plus one or my kids?", a: "Little ones are very welcome — there is a supervised play courtyard. For plus ones, check your invitation or just ask us." },
  { q: "Getting there", a: "Shuttles leave the city hotels before each event and run back hourly at night." },
  { q: "Weather", a: "Late October evenings sit around 24°C. A light shawl is a good idea." },
  { q: "Gifts", a: "Your presence is the gift. If you insist, a note for our home fund." },
];
