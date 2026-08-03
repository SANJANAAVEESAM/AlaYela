import { useEffect, useRef, useState } from "react";

import storyAirport from "@/assets/story-airport.jpg";
import storyCamping from "@/assets/story-camping.jpg";
import storyOodenny from "@/assets/story-oodenny.jpg";

import {
  CONTACT_EMAIL,
  COUPLE,
  DETAIL_CARDS,
  EVENT_DAYS,
  FULL_WEDDING_CAL,
  WEDDING_DATE_RANGE,
  WEDDING_YEAR,
  TIMING_NOTE,
  WHATSAPP_NUMBER,
  venueMapsHref,
  type EventDay,
  type WeddingEvent,
} from "./data";
import { AddToCalendar } from "./AddToCalendar";
import { Confetti } from "./Confetti";
import { Countdown } from "./Countdown";
import { FloatingNav } from "./FloatingNav";
import { Hero } from "./Hero";
import { Modal } from "./Modal";
import { MusicToggle } from "./MusicToggle";
import { Ornament } from "./Ornament";
import { Petals } from "./Petals";
import { Reveal } from "./Reveal";
import { ScrollReveal } from "./ScrollReveal";

/* ---------------------------------- shell ---------------------------------- */

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`w-full px-5 py-16 ${className}`}>
      <Reveal>{children}</Reveal>
    </section>
  );
}

/** Fixed botanical watermark that breathes in after the hero — background never "changes". */
function BotanicalWatermark() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setOpacity(Math.min(0.06, Math.max(0, (window.scrollY - window.innerHeight * 0.6) / window.innerHeight) * 0.06)),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 140"
      className="pointer-events-none fixed -right-16 -bottom-16 -z-10 w-[24rem]"
      style={{ opacity, transition: "opacity 300ms linear" }}
    >
      <g fill="none" stroke="var(--foreground)" strokeWidth="1">
        <path d="M18 126 C36 96 40 66 30 34" />
        <path d="M30 62 c-14 -2 -22 6 -24 16 c12 2 20 -6 24 -16" />
        <path d="M33 44 c12 -6 24 -2 28 8 c-12 4 -22 0 -28 -8" />
        <path d="M96 118 C104 96 118 84 132 80" />
        <path d="M112 96 c-2 -12 4 -20 14 -24 c2 10 -4 18 -14 24" />
      </g>
    </svg>
  );
}

/* ---------------------------------- story ---------------------------------- */

// TODO(content): captions are drawn from the chapter copy — change freely.
const CHAPTERS = [
  {
    label: "Chapter One",
    title: "The Campfire That Started It All",
    body: [
      "What began as a casual camping trip with friends to Deception Pass became the first page of our story. Between endless conversations, laughter around the campfire, and a sky full of stars, two strangers from the same college finally found each other.",
    ],
    quote: "Sometimes the best stories begin when nothing is planned.",
    photos: [
      {
        src: storyCamping,
        caption: "Deception Pass",
        alt: "Friends gathered around a campfire at sunset, tents and a bridge over the water behind them",
      },
    ],
  },
  {
    label: "Chapter Two",
    title: "Three Little Words",
    body: [
      "A drive to the Seattle airport.\nOne last hug before goodbye.",
      "He smiled, held her close, and quietly said,",
      "“I love you.”",
      "Then he simply walked away.",
      "She carried those words all the way home…\nand when her heart was ready,",
      "she said “Yes.”",
    ],
    photos: [
      {
        src: storyAirport,
        caption: "Seattle airport",
        alt: "The couple holding each other at the airport departures kerb at sunset",
      },
    ],
  },
  {
    label: "Chapter Three",
    title: "Our Sunday Tradition",
    body: [
      "Some love stories are written through grand gestures.",
      "Ours was written in slow Sunday mornings.",
      "A picnic mat, a camping chair, a good book, coffee in hand, and Mount Rainier watching over us.",
      "No plans.\nNo rush.\nJust us.",
    ],
    quote: "Home was never a place—it was wherever we were together.",
    photos: [
      {
        src: storyOodenny,
        caption: "Mount Rainier",
        alt: "The couple on a picnic blanket under a tree, a snow-capped mountain in the distance",
      },
    ],
  },
];

/** Every print in running order, each tagged with the chapter it belongs to. */
const PRINTS = CHAPTERS.flatMap((chapter, ci) =>
  chapter.photos.map((photo) => ({ ...photo, chapter: ci })),
);

/** How far each print sits below the one before it in the finished pile. */
const FAN = 13;
const TILTS = [-1.6, 1.3, -0.9, 1.7, -1.2, 0.8];

function Story() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [deckTop, setDeckTop] = useState(420);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // The pinned header's height decides where the deck starts, and it changes
  // with the longest chapter's copy — so measure it rather than guess.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setDeckTop(el.offsetHeight + 6);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Whichever print has reached the top of the pile owns the chapter copy.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      let idx = 0;
      cardRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= deckTop + 6) idx = i;
      });
      setActive(PRINTS[idx].chapter);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [deckTop]);

  const shown = lightbox !== null ? PRINTS[lightbox] : null;

  return (
    <section id="story" className="relative">
      {/* The invitation inks itself in and lands on "our story", which is why
          there is no separate heading below — the line above is the title. */}
      <ScrollReveal />

      {/* Pinned: the chapter copy cross-fades as each print reaches the pile */}
      <div
        ref={headerRef}
        className="sticky top-0 z-30 bg-background px-5 pb-5 text-center"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 4.5rem)" }}
      >
        <div className="relative min-h-[17rem]">
          {CHAPTERS.map((chapter, i) => (
            <div
              key={chapter.label}
              aria-hidden={i !== active}
              className="absolute inset-x-0 top-0"
              style={{
                opacity: i === active ? 1 : 0,
                transition: "opacity 550ms ease",
                pointerEvents: i === active ? "auto" : "none",
              }}
            >
              <h3 className="font-display text-[1.4rem] font-semibold lowercase first-letter:uppercase text-foreground">
                {chapter.label}: {chapter.title}
              </h3>
              <div className="mx-auto mt-3 max-w-[21rem] space-y-2 font-body text-[0.88rem] leading-[1.55] whitespace-pre-line text-muted-foreground">
                {chapter.body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
              {chapter.quote && (
                <p className="mx-auto mt-3 max-w-[19rem] font-display text-[1rem] leading-snug text-foreground/75 italic">
                  “{chapter.quote}”
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* The pile: each print parks a little lower, so the ones already down
          stay visible as edges above the newest one. */}
      <div id="gallery" className="px-6">
        {PRINTS.map((print, i) => (
          <div
            key={print.src}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="sticky mx-auto w-[86%]"
            style={{ top: deckTop + i * FAN, zIndex: 10 + i, marginBottom: "12vh" }}
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`Enlarge ${print.caption}`}
              className="block w-full rounded-[18px] bg-pearl p-3 pb-3.5 transition-transform active:scale-[0.99]"
              style={{
                transform: `rotate(${TILTS[i % TILTS.length]}deg)`,
                boxShadow: "0 14px 30px -16px oklch(0.28 0.02 60 / 0.35)",
              }}
            >
              <img
                src={print.src}
                alt={print.alt}
                loading={i === 0 ? "eager" : "lazy"}
                width={1000}
                height={750}
                className="w-full rounded-[10px] object-cover"
                style={{ aspectRatio: "4 / 3" }}
              />
              <span className="mt-3 block text-center font-body text-[0.78rem] text-muted-foreground">
                {print.caption}
              </span>
            </button>
          </div>
        ))}
      </div>

      <Modal open={shown !== null} onClose={() => setLightbox(null)} label="Photo viewer">
        {shown && (
          <div className="flex flex-col items-center gap-4 pt-2 pb-4">
            <img
              src={shown.src}
              alt={shown.alt}
              width={1000}
              height={750}
              className="w-full rounded-[12px] object-cover"
              style={{ aspectRatio: "4 / 3" }}
            />
            <p className="font-body text-sm text-muted-foreground">{shown.caption}</p>
            <div className="flex items-center gap-8">
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() =>
                  setLightbox((i) => (i === null ? i : (i - 1 + PRINTS.length) % PRINTS.length))
                }
                className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground/70"
              >
                ←
              </button>
              <span className="font-body text-xs text-muted-foreground">
                {(lightbox ?? 0) + 1} / {PRINTS.length}
              </span>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % PRINTS.length))}
                className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground/70"
              >
                →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/* ---------------------------------- join us ---------------------------------- */

/**
 * The turn toward the schedule: the invitation line, the date and the live
 * countdown. Confetti fires once per page load, when the guest reaches this.
 */
function JoinUs() {
  const ref = useRef<HTMLElement>(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setCelebrate(true);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden px-6 py-20 text-center"
    >
      {celebrate && <Confetti />}

      <Reveal>
        {/* One gap value, so the spacing between every element is identical */}
        <div className="flex flex-col items-center gap-9">
          <p
            className="font-display leading-tight lowercase first-letter:uppercase text-foreground"
            style={{ fontSize: "clamp(2rem, 9.5vw, 2.5rem)" }}
          >
            so please join us…
          </p>
          <p
            className="font-display leading-tight lowercase first-letter:uppercase text-foreground"
            style={{ fontSize: "clamp(2.4rem, 11.5vw, 3rem)" }}
          >
            {WEDDING_DATE_RANGE}
          </p>
          <Countdown />
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------- events ---------------------------------- */

/** The whole schedule, sized to sit within a single screen — no illustrations. */
function EventsSection() {
  const [open, setOpen] = useState<{ event: WeddingEvent; day: EventDay } | null>(null);
  const directions = open ? venueMapsHref(open.event.venue) : null;

  return (
    <section
      id="events"
      className="flex min-h-[100dvh] w-full flex-col justify-center px-6"
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 5rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)",
      }}
    >
      <Reveal>
        <h2
          className="text-center font-display leading-none lowercase first-letter:uppercase text-foreground"
          style={{ fontSize: "clamp(2.1rem, 10vw, 2.6rem)" }}
        >
          the celebrations
        </h2>
        <Ornament className="mt-4 mb-8" />

        {EVENT_DAYS.map((day, d) => (
          <div key={day.date} className={d ? "mt-7" : ""}>
            <p className="font-body text-[0.6rem] font-medium tracking-[0.24em] uppercase text-bronze">
              {day.date} · {day.weekday}
            </p>
            <span aria-hidden="true" className="mt-2 mb-3.5 block h-px w-full bg-[var(--border)]" />

            {day.events.map((event, i) => (
              <div key={event.slug} className={i ? "mt-2.5" : ""}>
                {event.followsPrevious && (
                  <p className="mb-2 font-display text-[0.82rem] text-muted-foreground italic">
                    Followed by
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setOpen({ event, day })}
                  className="flex w-full items-center gap-3 rounded-xl bg-pearl px-3.5 py-2.5 text-left ring-1 ring-[var(--border)] transition-all hover:ring-[var(--bronze)]/45 active:scale-[0.99]"
                  style={{ boxShadow: "0 1px 3px oklch(0.28 0.02 60 / 0.07)" }}
                  aria-label={`${event.name} — see date, venue and dress code`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-[1.1rem] leading-tight text-foreground">
                        {event.name}
                      </span>
                      <span className="shrink-0 font-body text-[0.66rem] tracking-wide text-muted-foreground">
                        {event.time}
                      </span>
                    </span>
                    {(event.theme || event.dressCode) && (
                      <span className="mt-1 block font-body text-[0.7rem] leading-snug text-muted-foreground">
                        {event.theme && <span className="text-bronze italic">{event.theme}</span>}
                        {event.theme && event.dressCode && (
                          <span aria-hidden="true" className="mx-1.5 opacity-40">
                            ·
                          </span>
                        )}
                        {event.dressCode && <span>Dress: {event.dressCode}</span>}
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bronze/12 font-body text-[0.7rem] text-bronze"
                  >
                    ›
                  </span>
                </button>
              </div>
            ))}
          </div>
        ))}

        <p className="mx-auto mt-8 max-w-[21rem] text-center font-body text-[0.66rem] leading-relaxed text-muted-foreground/80 italic">
          {TIMING_NOTE}
        </p>

        <div className="mt-5 text-center">
          <AddToCalendar compact event={FULL_WEDDING_CAL} />
        </div>
      </Reveal>

      <Modal open={open !== null} onClose={() => setOpen(null)} label={open?.event.name ?? "Event"}>
        {open && (
          <div className="pt-2 pb-4">
            <h3 className="text-center font-display text-3xl text-foreground">{open.event.name}</h3>
            {open.event.theme && (
              <p className="mt-1 text-center font-script text-xl text-bronze">{open.event.theme}</p>
            )}
            <Ornament className="mt-5 mb-7" />

            <dl className="space-y-5">
              <div>
                <dt className="eyebrow text-[0.5rem]">Date</dt>
                <dd className="mt-1.5 font-body text-sm text-foreground/85">
                  {open.day.weekday}, {open.day.date} {WEDDING_YEAR}
                </dd>
              </div>

              <div>
                <dt className="eyebrow text-[0.5rem]">Time</dt>
                <dd className="mt-1.5 font-body text-sm text-foreground/85">
                  {open.event.time}
                  {open.event.tentative && (
                    <span className="block text-xs text-muted-foreground italic">
                      Timing may change
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="eyebrow text-[0.5rem]">Venue</dt>
                <dd className="mt-1.5 font-body text-sm text-foreground/85">
                  {open.event.venue.name}
                </dd>
              </div>

              {open.event.dressCode && (
                <div>
                  <dt className="eyebrow text-[0.5rem]">Dress code</dt>
                  <dd className="mt-1.5 font-body text-sm text-foreground/85">
                    {open.event.dressCode}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-lg bg-bronze px-5 py-2.5 font-body text-[0.62rem] font-medium tracking-[0.2em] uppercase text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Open in Maps
                </a>
              ) : (
                <span className="font-body text-xs text-muted-foreground italic">
                  Directions will appear here once the venue is confirmed.
                </span>
              )}
              <AddToCalendar
                compact
                event={{
                  title: `${open.event.name} — ${COUPLE.bride} & ${COUPLE.groom}`,
                  description: [
                    open.event.theme && `Theme: ${open.event.theme}.`,
                    open.event.dressCode && `Dress code: ${open.event.dressCode}.`,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  location: open.event.venue.name,
                  startUtc: open.event.start.toISOString(),
                  endUtc: open.event.end.toISOString(),
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/* ------------------------------ detail cards ------------------------------ */

function DetailCards() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? DETAIL_CARDS[openIdx] : null;

  return (
    <Section id="travel">
      <h2 className="font-display text-5xl lowercase first-letter:uppercase text-foreground">additional details</h2>
      <div className="mt-10 grid grid-cols-2 gap-4">
        {DETAIL_CARDS.map((card, i) => (
          <button
            key={card.title}
            type="button"
            onClick={() => setOpenIdx(i)}
            className={`group relative overflow-hidden rounded-[20px] text-left ${i === 0 || i === DETAIL_CARDS.length - 1 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <img
              src={card.img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, transparent 30%, oklch(0.25 0.02 60 / 0.55) 100%)" }}
            />
            <span className="absolute bottom-4 left-4 max-w-[75%] font-display text-lg leading-tight text-pearl">
              {card.title}
            </span>
            <span
              aria-hidden="true"
              className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full bg-pearl/85 text-base text-foreground/70"
            >
              +
            </span>
          </button>
        ))}
      </div>

      <Modal open={active !== null} onClose={() => setOpenIdx(null)} label={active?.title ?? "Details"}>
        {active && (
          <div className="pt-2 pb-4">
            <img
              src={active.img}
              alt=""
              aria-hidden="true"
              width={800}
              height={450}
              className="aspect-[16/9] w-full rounded-[16px] object-cover"
            />
            <h3 className="mt-5 font-display text-3xl text-foreground">{active.title}</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{active.body}</p>
          </div>
        )}
      </Modal>
    </Section>
  );
}

/* ----------------------------------- faqs ----------------------------------- */

function Faqs() {
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <Section id="faqs" className="text-center">
      <h2
        className="font-display leading-none lowercase first-letter:uppercase text-foreground"
        style={{ fontSize: "clamp(2.4rem, 12vw, 3rem)" }}
      >
        questions?
      </h2>
      <p className="mx-auto mt-5 max-w-[20rem] font-body text-sm leading-relaxed text-muted-foreground">
        Anything at all about the celebrations — travel, timings, what to wear — just ask us.
      </p>
      <button
        type="button"
        onClick={() => setContactOpen(true)}
        className="mt-7 rounded-full bg-bronze px-7 py-3.5 font-body text-[0.64rem] font-medium tracking-[0.22em] uppercase text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        Reach out to {COUPLE.bride} or {COUPLE.groom}
      </button>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} label="Contact the couple">
        <div className="flex flex-col items-center gap-5 pt-3 pb-4 text-center">
          <p className="font-display text-2xl text-foreground">We'd love to hear from you</p>
          <p className="font-body text-sm break-all text-muted-foreground">{CONTACT_EMAIL}</p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(CONTACT_EMAIL).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="rounded-lg border border-[var(--silver)]/60 bg-ivory px-5 py-2.5 font-body text-[0.62rem] font-medium tracking-[0.2em] uppercase text-foreground/80"
            >
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-lg bg-bronze px-5 py-2.5 font-body text-[0.62rem] font-medium tracking-[0.2em] uppercase text-primary-foreground"
            >
              Open mail app
            </a>
          </div>
        </div>
      </Modal>
    </Section>
  );
}

/* ----------------------------------- rsvp ----------------------------------- */

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-ivory px-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--bronze)] focus:outline-none";

function Rsvp() {
  const allEvents = EVENT_DAYS.flatMap((day) => day.events);

  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ waHref: string } | null>(null);
  const [showPetals, setShowPetals] = useState(false);

  const allPicked = picked.length === allEvents.length;

  const toggle = (slug: string) => {
    setError(null);
    setPicked((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const first = String(form.get("first") ?? "").trim();
    const last = String(form.get("last") ?? "").trim();

    if (!first || !last) return setError("Please add your name.");
    if (!attending) return setError("Please let us know whether you can make it.");
    if (attending === "yes" && picked.length === 0)
      return setError("Please choose which celebrations you'll be joining.");

    const guests = String(form.get("guests") ?? "1");
    const note = String(form.get("note") ?? "").trim();
    const coming = allEvents.filter((ev) => picked.includes(ev.slug)).map((ev) => ev.name);

    const text = [
      `RSVP — ${first} ${last}`,
      attending === "yes" ? "Joyfully accepts" : "Regretfully declines",
      attending === "yes" && `Guests: ${guests}`,
      attending === "yes" && `Attending: ${coming.join(", ")}`,
      note && `Note: ${note}`,
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted({ waHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` });
    setShowPetals(true);
    setTimeout(() => setShowPetals(false), 9000);
  };

  return (
    <Section id="rsvp">
      {showPetals && <Petals />}
      <div
        className="rounded-[24px] bg-pearl px-6 py-9 ring-1 ring-[var(--border)]"
        style={{ boxShadow: "var(--shadow-paper)" }}
      >
        <h2 className="text-center font-display text-4xl text-foreground">RSVP</h2>
        <Ornament className="mt-5 mb-8" />

        {submitted ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="font-display text-xl text-foreground italic">
              Thank you — we can't wait to celebrate with you.
            </p>
            <a
              href={submitted.waHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-bronze px-8 py-4 font-body text-[0.66rem] font-medium tracking-[0.24em] uppercase text-primary-foreground transition-opacity hover:opacity-90"
            >
              Send it to us on WhatsApp
            </a>
            <p className="font-body text-xs text-muted-foreground">
              Tapping the button opens WhatsApp with your RSVP pre-filled.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3.5" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <input name="first" placeholder="First name" className={inputClass} />
              <input name="last" placeholder="Last name" className={inputClass} />
            </div>

            {/* Segmented attendance */}
            <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[var(--border)]">
              {(
                [
                  ["yes", "Joyfully Accept"],
                  ["no", "Regretfully Decline"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAttending(value);
                    setError(null);
                  }}
                  aria-pressed={attending === value}
                  className="px-3 py-3.5 font-body text-[0.6rem] font-medium tracking-[0.16em] uppercase transition-colors"
                  style={{
                    background: attending === value ? "var(--bronze)" : "var(--ivory)",
                    color:
                      attending === value ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Which celebrations — only relevant to guests who are coming */}
            {attending === "yes" && (
              <fieldset className="mt-1 rounded-xl border border-[var(--border)] px-4 py-4">
                <legend className="px-1.5 font-body text-[0.58rem] font-medium tracking-[0.22em] uppercase text-bronze">
                  Which celebrations?
                </legend>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setPicked(allPicked ? [] : allEvents.map((ev) => ev.slug));
                  }}
                  className="mt-1 font-body text-[0.68rem] text-muted-foreground underline decoration-[var(--gold)] underline-offset-4 transition-colors hover:text-bronze"
                >
                  {allPicked ? "Clear all" : "We're coming to everything"}
                </button>

                {EVENT_DAYS.map((day) => (
                  <div key={day.date} className="mt-4">
                    <p className="font-body text-[0.55rem] font-medium tracking-[0.2em] uppercase text-muted-foreground/70">
                      {day.date} · {day.weekday}
                    </p>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {day.events.map((ev) => {
                        const checked = picked.includes(ev.slug);
                        return (
                          <label
                            key={ev.slug}
                            className="flex cursor-pointer items-center gap-3 rounded-lg bg-ivory px-3 py-2.5 ring-1 transition-colors"
                            style={{
                              borderColor: "transparent",
                              boxShadow: checked
                                ? "inset 0 0 0 1px var(--bronze)"
                                : "inset 0 0 0 1px var(--border)",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={checked}
                              onChange={() => toggle(ev.slug)}
                            />
                            <span
                              aria-hidden="true"
                              className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-[var(--border)] bg-background text-[11px] leading-none text-transparent transition-colors peer-checked:border-bronze peer-checked:bg-bronze peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-bronze/50"
                            >
                              ✓
                            </span>
                            <span className="min-w-0 flex-1 font-display text-[0.98rem] text-foreground">
                              {ev.name}
                            </span>
                            <span className="shrink-0 font-body text-[0.62rem] text-muted-foreground">
                              {ev.time}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </fieldset>
            )}

            {attending === "yes" && (
              <select name="guests" defaultValue="1" className={inputClass} aria-label="Number of guests">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            )}

            <textarea
              name="note"
              rows={3}
              placeholder="A note for the couple (optional)"
              className={inputClass}
            />

            {error && (
              <p className="text-center font-body text-xs text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="mt-2 rounded-full bg-bronze px-8 py-4 font-body text-[0.68rem] font-medium tracking-[0.28em] uppercase text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]"
            >
              Send RSVP
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}

/* --------------------------------- microsite --------------------------------- */

export function Microsite({ live }: { live: boolean }) {
  return (
    <div className="relative">
      <BotanicalWatermark />
      <FloatingNav visible={live} />
      <MusicToggle />

      <main className="relative mx-auto w-full max-w-[26rem]">
        <Hero live={live} />

        <Story />
        <JoinUs />
        <EventsSection />
        <DetailCards />
        <Faqs />
        <Rsvp />

        {/* Closing */}
        <section className="px-5 pt-6 pb-24 text-center">
          <Reveal>
            <p className="mx-auto max-w-[16rem] font-script text-3xl leading-snug text-foreground/90">
              We can't wait to celebrate with you
            </p>
            <p className="mt-8 font-body text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground">
              {COUPLE.bride} & {COUPLE.groom} · October 29–31
            </p>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
