import eventHaldi from "@/assets/event-haldi.png";
import eventMehendi from "@/assets/event-mehendi.png";
import eventSangeet from "@/assets/event-cocktail.png";
import eventPelliKuthuru from "@/assets/event-pelli-kuthuru.png";
import eventVratam from "@/assets/event-vratam.png";
import eventPelli from "@/assets/event-wedding.png";

export type WeddingEvent = {
  slug: string;
  name: string;
  theme: string;
  tagline: string;
  when: string;
  date: string;
  time: string;
  note: string;
  img: string;
  intro: string;
  venue: { name: string; address: string; mapsQuery: string };
  dressCode: string;
  palette: { name: string; value: string }[];
  schedule: { time: string; title: string; note: string }[];
  details: { q: string; a: string }[];
};

export const EVENTS: WeddingEvent[] = [
  {
    slug: "haldi",
    name: "Haldi",
    theme: "Marigold Carnival",
    tagline: "A turmeric carnival of colour, drums and sunshine",
    when: "Oct 27 · 10:00 AM",
    date: "Tuesday, 27 October 2026",
    time: "10:00 AM — 1:30 PM",
    note: "Marigolds, festoon lights and turmeric.",
    img: eventHaldi,
    intro:
      "The morning begins in the open garden with a carnival of marigold garlands, hand-painted carts, dhol players and a turmeric ceremony under a canopy of festoon lights. Come ready to be coloured — and to laugh through it.",
    venue: {
      name: "The Marigold Garden Lawn",
      address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
      mapsQuery: "Taj Falaknuma Palace Hyderabad",
    },
    dressCode: "Yellows, marigold orange and white cottons you don't mind staining.",
    palette: [
      { name: "Marigold", value: "oklch(0.79 0.16 78)" },
      { name: "Saffron", value: "oklch(0.73 0.15 60)" },
      { name: "Ivory", value: "oklch(0.972 0.014 92)" },
      { name: "Sage", value: "oklch(0.62 0.05 128)" },
    ],
    schedule: [
      { time: "10:00 AM", title: "Welcome carts", note: "Sugarcane juice, chai and jalebi" },
      { time: "10:45 AM", title: "Dhol procession", note: "Drums lead the couple in" },
      { time: "11:30 AM", title: "Haldi ceremony", note: "Turmeric under the canopy" },
      { time: "12:15 PM", title: "Carnival games", note: "Ring toss, kite corner, photo booth" },
      { time: "1:00 PM", title: "Garden brunch", note: "South Indian thali counters" },
    ],
    details: [
      { q: "What to wear", a: "Light cottons in yellow or white. Expect turmeric everywhere." },
      { q: "Sun & shade", a: "The lawn is open — hats, sunglasses and shaded seating are provided." },
      { q: "Children", a: "The carnival stalls and kite corner are made for them." },
    ],
  },
  {
    slug: "mehendi",
    name: "Mehendi",
    theme: "Garden Lantern Evening",
    tagline: "Henna, greenery and lanterns after sundown",
    when: "Oct 28 · 5:00 PM",
    date: "Wednesday, 28 October 2026",
    time: "5:00 PM — 10:00 PM",
    note: "A garden evening of henna and greenery.",
    img: eventMehendi,
    intro:
      "As the light softens, the courtyard fills with low seating, hanging lanterns and henna artists. Live sitar and ghazals carry the evening while designs dry.",
    venue: {
      name: "The Courtyard Verandah",
      address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
      mapsQuery: "Taj Falaknuma Palace Hyderabad",
    },
    dressCode: "Garden greens, mint and soft ivory. Sleeves that roll up easily.",
    palette: [
      { name: "Sage", value: "oklch(0.62 0.05 128)" },
      { name: "Olive", value: "oklch(0.44 0.05 118)" },
      { name: "Mint", value: "oklch(0.86 0.05 150)" },
      { name: "Ivory", value: "oklch(0.972 0.014 92)" },
    ],
    schedule: [
      { time: "5:00 PM", title: "Henna stations open", note: "Six artists, no waiting" },
      { time: "6:30 PM", title: "Sitar & ghazals", note: "Live on the verandah" },
      { time: "8:00 PM", title: "Chaat counters", note: "Street food, done beautifully" },
      { time: "9:00 PM", title: "Lantern release", note: "Closing the evening" },
    ],
    details: [
      { q: "Henna time", a: "Simple designs take 15 minutes, bridal-style up to an hour." },
      { q: "Seating", a: "Low floor cushions with chairs available along the verandah." },
      { q: "Weather", a: "Evenings sit near 24°C — bring a light shawl." },
    ],
  },
  {
    slug: "sangeet",
    name: "Sangeet",
    theme: "Gold Chandelier Night",
    tagline: "A night of music, toasts and dancing",
    when: "Oct 29 · 8:00 PM",
    date: "Thursday, 29 October 2026",
    time: "8:00 PM — late",
    note: "Black tie, gold light, chandeliers.",
    img: eventSangeet,
    intro:
      "The sangeet brings both families together for an evening of choreographed dances, heartfelt toasts and a dance floor that stays busy until midnight.",
    venue: {
      name: "The Durbar Hall",
      address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
      mapsQuery: "Taj Falaknuma Palace Hyderabad",
    },
    dressCode: "Festive cocktail — deep jewel tones, gold accents and plenty of sparkle.",
    palette: [
      { name: "Gold", value: "oklch(0.72 0.075 85)" },
      { name: "Ruby", value: "oklch(0.55 0.18 28)" },
      { name: "Champagne", value: "oklch(0.9 0.04 88)" },
      { name: "Olive", value: "oklch(0.44 0.05 118)" },
    ],
    schedule: [
      { time: "8:00 PM", title: "Bars open", note: "Signature cocktails and mocktails" },
      { time: "9:00 PM", title: "Family performances", note: "Choreographed dances and toasts" },
      { time: "10:00 PM", title: "Toasts", note: "A few words from both families" },
      { time: "10:45 PM", title: "Dance floor", note: "DJ set until late" },
    ],
    details: [
      { q: "Age", a: "An adults-first evening; childcare is available at the hotel." },
      { q: "Getting back", a: "Shuttles run to the city hotels every hour from 11 PM." },
      { q: "Footwear", a: "Polished stone floors — heels are fine indoors." },
    ],
  },
  {
    slug: "pelli-kuthuru",
    name: "Pelli Kuthuru",
    theme: "Ivory & Rose Blessing",
    tagline: "A morning of blessings for the bride",
    when: "Oct 30 · 10:00 AM",
    date: "Friday, 30 October 2026",
    time: "10:00 AM — 1:00 PM",
    note: "Close family, flower garlands and whispered wishes.",
    img: eventPelliKuthuru,
    intro:
      "Close family gathers to bless the bride with sacred water, flower garlands and whispered wishes. An intimate, emotional morning before the celebrations begin.",
    venue: {
      name: "The Rose Pavilion",
      address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
      mapsQuery: "Taj Falaknuma Palace Hyderabad",
    },
    dressCode: "Ivory, rose pink and soft sage. Traditional silks and handlooms.",
    palette: [
      { name: "Ivory", value: "oklch(0.972 0.014 92)" },
      { name: "Rose", value: "oklch(0.72 0.12 18)" },
      { name: "Sage", value: "oklch(0.62 0.05 128)" },
      { name: "Gold", value: "oklch(0.72 0.075 85)" },
    ],
    schedule: [
      { time: "10:00 AM", title: "Family arrival", note: "Tea and traditional sweets" },
      { time: "10:30 AM", title: "Ganesh puja", note: "Prayers for an auspicious beginning" },
      { time: "11:00 AM", title: "Blessing ceremony", note: "Elders bless the bride" },
      { time: "12:00 PM", title: "Family lunch", note: "A quiet, celebratory meal" },
    ],
    details: [
      { q: "What to wear", a: "Traditional silks in ivory, rose or soft sage." },
      { q: "Photography", a: "An intimate ceremony — keep phones tucked away." },
      { q: "Gifts", a: "Your presence and blessings are the only gift needed." },
    ],
  },
  {
    slug: "vratam",
    name: "Vratam",
    theme: "Sacred Dawn Ritual",
    tagline: "Morning rituals with family",
    when: "Oct 31 · 8:00 AM",
    date: "Saturday, 31 October 2026",
    time: "8:00 AM — 11:00 AM",
    note: "The wedding day begins with prayers and a sacred fire.",
    img: eventVratam,
    intro:
      "The wedding day begins with a quiet vratam. The priest chants, the fire is lit, and both families offer prayers for a harmonious life ahead.",
    venue: {
      name: "The Sacred Grove",
      address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
      mapsQuery: "Taj Falaknuma Palace Hyderabad",
    },
    dressCode: "Ivory and gold traditional wear. Comfortable cottons for the morning.",
    palette: [
      { name: "Ivory", value: "oklch(0.972 0.014 92)" },
      { name: "Gold", value: "oklch(0.72 0.075 85)" },
      { name: "Sage", value: "oklch(0.62 0.05 128)" },
      { name: "Olive", value: "oklch(0.44 0.05 118)" },
    ],
    schedule: [
      { time: "8:00 AM", title: "Arrival & sankalpam", note: "The couple and families gather" },
      { time: "8:30 AM", title: "Homam", note: "Sacred fire and offerings" },
      { time: "9:30 AM", title: "Prayers", note: "Chants for a harmonious life" },
      { time: "10:30 AM", title: "Prasadam", note: "Sweet offerings and blessings" },
    ],
    details: [
      { q: "What to wear", a: "Comfortable traditional cottons in ivory or gold." },
      { q: "Photography", a: "A sacred ceremony — keep phones silent and away." },
      { q: "Seating", a: "Floor seating on traditional mats; chairs are available." },
    ],
  },
  {
    slug: "pelli",
    name: "Pelli",
    theme: "Ivory & Gold Mandap",
    tagline: "The wedding muhurtham",
    when: "Oct 31 · 4:30 PM",
    date: "Saturday, 31 October 2026",
    time: "4:30 PM — midnight",
    note: "Ivory and gold beneath the mandap.",
    img: eventPelli,
    intro:
      "The day itself. A floral mandap in the palace courtyard, golden-hour photographs by the step-well, long tables in the durbar hall and dancing to close.",
    venue: {
      name: "The Falaknuma Courtyard",
      address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
      mapsQuery: "Taj Falaknuma Palace Hyderabad",
    },
    dressCode: "Garden formal — flowing silhouettes, soft greens and ivories.",
    palette: [
      { name: "Ivory", value: "oklch(0.972 0.014 92)" },
      { name: "Gold", value: "oklch(0.72 0.075 85)" },
      { name: "Sage", value: "oklch(0.62 0.05 128)" },
      { name: "Beige", value: "oklch(0.87 0.03 80)" },
    ],
    schedule: [
      { time: "4:30 PM", title: "Ceremony", note: "Palace courtyard, under the mandap" },
      { time: "6:00 PM", title: "Cocktail", note: "Terrace bar & live sitar" },
      { time: "7:00 PM", title: "Photographs", note: "Golden hour by the step-well" },
      { time: "8:00 PM", title: "Dinner", note: "Long tables in the durbar hall" },
      { time: "10:00 PM", title: "Party", note: "Dance floor until late" },
    ],
    details: [
      { q: "Arrival", a: "Shuttles leave the city hotels at 3:15 PM; please be seated by 4:15 PM." },
      { q: "Photography", a: "An unplugged ceremony — our photographers have it covered." },
      { q: "Gifts", a: "Your presence is the gift. If you insist, a note for our home fund." },
    ],
  },
];

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}
