import { useEffect, useRef, useState, type ReactNode } from "react";

import storyAirport from "@/assets/story-airport.jpg";
import storyCamping from "@/assets/story-camping.jpg";
import storyOodenny from "@/assets/story-oodenny.jpg";

import {
  CONTACT_EMAIL,
  CONTACTS,
  COUPLE,
  DETAIL_CARDS,
  type DetailIcon,
  EVENT_DAYS,
  FULL_WEDDING_CAL,
  GALLERY_FOLDERS,
  HOTELS,
  hotelHref,
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
import { DressCodeArt } from "./DressCodeArt";
import { FloatingNav } from "./FloatingNav";
import { Hero } from "./Hero";
import { Modal } from "./Modal";
import { MusicCandidates } from "./MusicCandidates";
import { MusicToggle } from "./MusicToggle";
import { Ornament } from "./Ornament";
import { Petals } from "./Petals";
import { Reveal } from "./Reveal";
import { ScrollReveal } from "./ScrollReveal";
import { EVENT_THEMES, EventScenery } from "./eventThemes";
import { copyText } from "@/lib/clipboard";
import { submitRsvp } from "@/lib/rsvp";

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
    label: "Chapter I",
    title: "The Beginning",
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
    label: "Chapter II",
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
    label: "Chapter III",
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

/**
 * How much of a print's approach the chapter copy hands over across, in px.
 * The copy is tied to this stretch rather than to the moment the print lands,
 * so the words travel with the photo instead of snapping once it has covered
 * the one beneath.
 */
const HANDOVER = 300;
/** How far the copy drifts as it leaves, in px. */
const SLIDE = 34;
/**
 * The run-out at the end of the deck, in px. Once the last print has parked it
 * stops moving against the viewport, so the closing chapter has nothing left to
 * follow — this measures the deck's remaining room instead and lets chapter
 * three leave the way the others did, rather than blinking out when the sticky
 * header lets go.
 */
const EXIT = 340;

function Story() {
  const headerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [deckTop, setDeckTop] = useState(420);
  /** Fractional position through the prints — 1.4 means print 1, 40% of the way to 2. */
  const [pos, setPos] = useState(0);
  /** 0 while the deck holds, rising to 1 as it runs out and the copy leaves. */
  const [exit, setExit] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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

  // How far along the pile we are, as a fraction rather than a whole number, so
  // the copy can move with the print that is still on its way in.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      let p = 0;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        // Each print parks at its own height in the fan, so measure against
        // that rather than one shared line — otherwise only the first print
        // ever registers and the copy never leaves chapter one.
        const remaining = el.getBoundingClientRect().top - (deckTop + i * FAN);
        p += Math.min(1, Math.max(0, (HANDOVER - remaining) / HANDOVER));
      });
      // The first print is already parked when the deck opens, so the running
      // total sits one ahead of the index we want.
      setPos(Math.max(0, p - 1));

      // How close the deck is to giving up its sticky hold.
      const deck = deckRef.current;
      if (deck) {
        const room = deck.getBoundingClientRect().bottom - deckTop;
        setExit(Math.min(1, Math.max(0, (EXIT - room) / EXIT)));
      }
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

  // The two prints either side of where we are, and the chapters they belong
  // to. When both sit in the same chapter there is nothing to hand over.
  const lower = Math.min(PRINTS.length - 1, Math.floor(pos));
  const upper = Math.min(PRINTS.length - 1, lower + 1);
  const frac = Math.min(1, Math.max(0, pos - lower));
  const leaving = PRINTS[lower].chapter;
  const arriving = PRINTS[upper].chapter;
  const active = frac < 0.5 ? leaving : arriving;

  /**
   * Opacity and drift for one chapter's copy at the current scroll position.
   * Guests who ask for reduced motion still get the cross-fade, which carries
   * the meaning, but none of the travel.
   */
  const chapterMotion = (i: number) => {
    const drift = reducedMotion ? 0 : SLIDE;

    let opacity: number;
    let shift: number;
    if (leaving === arriving) {
      opacity = i === leaving ? 1 : 0;
      shift = 0;
    } else if (i === leaving) {
      opacity = 1 - frac;
      shift = -drift * frac;
    } else if (i === arriving) {
      opacity = frac;
      shift = drift * (1 - frac);
    } else {
      opacity = 0;
      shift = 0;
    }

    // The run-out at the end of the deck. Only ever non-zero once the last
    // print has parked, so in practice this is the closing chapter leaving.
    return { opacity: opacity * (1 - exit), shift: shift - drift * exit };
  };

  return (
    <section id="story" className="relative">
      {/* The invitation inks itself in and lands on "our story", which is why
          there is no separate heading below — the line above is the title. */}
      <ScrollReveal />

      {/* Scroll target for the menu's Story link. Landing here pins the header
          and parks the first print, so chapter one arrives fully composed —
          the sticky header itself cannot be a target, since once stuck it
          reports the top of the viewport rather than its place in the page. */}
      <span id="chapter-one" aria-hidden="true" className="block" />

      {/* Pinned: the chapter copy cross-fades as each print reaches the pile */}
      <div
        ref={headerRef}
        className="sticky top-0 z-30 px-5 pb-5 text-center"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 4.5rem)",
          // Opaque where the copy sits so the invitation lines pass cleanly
          // behind it, fading out at the lower edge to avoid a hard seam
          // across the backdrop.
          background:
            "linear-gradient(180deg, var(--background) 0%, var(--background) 84%, transparent 100%)",
        }}
      >
        <div className="relative min-h-[17rem]">
          {CHAPTERS.map((chapter, i) => {
            const { opacity, shift } = chapterMotion(i);
            return (
            <div
              key={chapter.label}
              aria-hidden={i !== active}
              className="absolute inset-x-0 top-0"
              style={{
                opacity,
                // Tied to scroll rather than to a timed fade, so the words leave
                // at exactly the pace of the photo pushing them out. "none" and
                // not translateY(0): a transform would make this the containing
                // block for any fixed-position child.
                transform: shift === 0 ? "none" : `translateY(${shift.toFixed(1)}px)`,
                pointerEvents: i === active ? "auto" : "none",
              }}
            >
              <h3 className="font-display text-[1.4rem] font-semibold text-foreground">
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
            );
          })}
        </div>
      </div>

      {/* The pile: each print parks a little lower, so the ones already down
          stay visible as edges above the newest one. */}
      <div id="gallery" ref={deckRef} className="px-6">
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

        {/* Holds the finished pile on screen. The prints stay stuck only while
            this container has room left, and the last one has just its own
            margin — without this the third overlap flashes past while the
            second is held for a full card's worth of scrolling. */}
        <div aria-hidden="true" className="h-[42vh]" />
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
            className="font-accent-soft leading-snug text-foreground"
            style={{
              // 1.8rem chosen on /fonts; the vw term only eases it down on
              // phones too narrow to hold the line in two.
              fontSize: "clamp(1.45rem, 5.4vw + 0.6rem, 1.8rem)",
              // Italic 300 is the cut auditioned, and both are loaded — unlike
              // Marcellus, this family has real italics, so nothing is faked.
              fontStyle: "italic",
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            Be part of our beautiful beginning
          </p>
          <p
            className="font-display leading-tight lowercase first-letter:uppercase text-foreground"
            style={{ fontSize: "clamp(1.8rem, 8vw, 2.15rem)" }}
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

/**
 * How far the artwork wash is pulled back behind the event cards. Applied as a
 * single multiplier rather than folded into each event's own cardOpacity, so
 * the values tuned against the artwork keep their relationship to one another.
 */
const WASH = 0.45;

/**
 * The schedule, one day at a time. Tabs keep it to a single screen while still
 * giving each event room, and every card opens a sheet with the full details.
 */
function EventsSection() {
  const [dayIdx, setDayIdx] = useState(0);
  const [open, setOpen] = useState<{ event: WeddingEvent; day: EventDay } | null>(null);
  const directions = open ? venueMapsHref(open.event.venue) : null;
  const look = open ? EVENT_THEMES[open.event.themeKey] : null;
  const accent = look?.accent;
  const activeDay = EVENT_DAYS[dayIdx];

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
          className="text-center font-display leading-none text-foreground"
          style={{ fontSize: "clamp(1.9rem, 8.6vw, 2.4rem)" }}
        >
          The Wedding Soirée
        </h2>
        <Ornament className="mt-4 mb-8" />

        <div className="flex justify-center gap-2">
          {EVENT_DAYS.map((d, i) => {
            const on = i === dayIdx;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => setDayIdx(i)}
                aria-pressed={on}
                className="rounded-full px-5 py-3 font-body text-[0.82rem] font-semibold tracking-[0.08em] uppercase transition-colors"
                style={{
                  background: on ? "var(--bronze)" : "color-mix(in oklab, var(--ivory) 62%, transparent)",
                  color: on ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  boxShadow: on ? "0 6px 16px -8px oklch(0.4 0.06 60 / 0.5)" : "none",
                  border: `1px solid ${on ? "transparent" : "color-mix(in oklab, var(--gold) 38%, transparent)"}`,
                }}
              >
                {d.date.replace(" October", " Oct")}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center font-body text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">
          {activeDay.weekday}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {activeDay.events.map((event) => (
            <button
              key={event.slug}
              type="button"
              onClick={() => setOpen({ event, day: activeDay })}
              aria-label={`${event.name} — see date, venue and dress code`}
              className="relative overflow-hidden rounded-2xl px-6 py-7 text-center transition-all active:scale-[0.99]"
              style={{
                // Near-solid rather than translucent: the artwork wash below
                // supplies the warmth, and a see-through ground on top of it
                // left the event names muddy.
                background: "color-mix(in oklab, var(--ivory) 94%, transparent)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                border: "1px solid color-mix(in oklab, var(--gold) 34%, transparent)",
                boxShadow: "0 10px 26px -16px oklch(0.32 0.03 60 / 0.4)",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "var(--gradient-gold)" }}
              />

              {/* The event's own artwork washed across the whole card rather
                  than stamped into a circle — six repeated circles down the
                  column read as clutter. Cropped per event, since these
                  artworks all leave their middles bare. */}
              {EVENT_THEMES[event.themeKey].image && (
                <img
                  src={EVENT_THEMES[event.themeKey].image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  style={{
                    opacity: (EVENT_THEMES[event.themeKey].cardOpacity ?? 0.2) * WASH,
                    objectPosition: EVENT_THEMES[event.themeKey].cardPosition ?? "center bottom",
                  }}
                />
              )}

              {/* Lifted clear of the wash behind it. */}
              <span className="relative block">
                {/* Name and theme only — time, venue and dress code live in the
                    sheet behind "View details". */}
                <span className="block font-display text-[1.6rem] font-bold tracking-[0.01em] text-ink-strong">
                  {event.name}
                </span>
                {event.theme && (
                  <span className="mt-1 block font-script text-lg text-bronze-deep">{event.theme}</span>
                )}

                <span aria-hidden="true" className="rule-gold mx-auto mt-4 mb-4 block w-16" />

                <span className="inline-flex items-center gap-1.5 font-body text-[0.62rem] font-medium tracking-[0.16em] uppercase text-bronze-deep">
                  View details <span aria-hidden="true">→</span>
                </span>
              </span>
            </button>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-[21rem] text-center font-body text-[0.66rem] leading-relaxed text-muted-foreground/80 italic">
          {TIMING_NOTE}
        </p>

        <div className="mt-5 text-center">
          <AddToCalendar compact event={FULL_WEDDING_CAL} />
        </div>
      </Reveal>

      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        label={open?.event.name ?? "Event"}
        variant="full"
        panelStyle={look?.surface}
        backdrop={open ? <EventScenery theme={open.event.themeKey} /> : null}
      >
        {open && (
          <div
            className="relative flex min-h-full flex-col pt-6 pb-4 text-center"
            style={{ color: look?.ink }}
          >
            <div className="my-auto w-full">
              <div className="relative w-full">
                <h3 className="font-display text-[2.1rem] leading-tight">{open.event.name}</h3>
                {open.event.theme && (
                  <p className="mt-1 font-script text-2xl" style={{ color: accent }}>
                    {open.event.theme}
                  </p>
                )}
                <span
                  aria-hidden="true"
                  className="mx-auto mt-5 mb-8 block h-px w-24"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />
              </div>

              {/* Set as invitation lines rather than a labelled list — the
                  artwork behind it reads as stationery, and labels fought it. */}
              <div className="space-y-5 text-center">
                <p className="font-display text-xl leading-snug">
                  {open.day.weekday}, {open.day.date} {WEDDING_YEAR}
                </p>

                <p className="font-display text-xl">
                  {open.event.time}
                  {open.event.tentative && (
                    <span
                      className="mt-1 block font-body text-xs italic"
                      style={{ color: look?.inkSoft }}
                    >
                      Timing may change
                    </span>
                  )}
                </p>

                <span
                  aria-hidden="true"
                  className="mx-auto block h-px w-12"
                  style={{ background: accent, opacity: 0.5 }}
                />

                <p className="font-display text-xl">{open.event.venue.name}</p>

                {/* Nothing stands in for a missing map: the venue line above
                    already says it is still to be announced. */}
                {directions && (
                  <div>
                    <a
                      href={directions}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-body text-sm underline underline-offset-4"
                      style={{ color: accent, textDecorationColor: accent }}
                    >
                      {open.event.venue.address ?? "Open in Maps"}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                )}

                {open.event.dressCode && (
                  <>
                    {/* The same hairline that separates the time from the venue,
                        so the dress code reads as its own passage. */}
                    <span
                      aria-hidden="true"
                      className="mx-auto block h-px w-12"
                      style={{ background: accent, opacity: 0.5 }}
                    />

                    <div className="pt-1">
                      <DressCodeArt
                        dressCode={open.event.dressCode}
                        ink={look?.ink}
                        inkSoft={look?.inkSoft}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* No per-event calendar button: the one under the schedule adds
                  all three days at once, which is what guests actually want.
                  Each celebration links to its own shared folder. */}
              {open.event.photosUrl && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <a
                    href={open.event.photosUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold)]/45 bg-ivory px-7 py-3.5 font-body text-[0.66rem] font-medium tracking-[0.24em] uppercase text-bronze transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    Share your photos
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/* ------------------------------ detail cards ------------------------------ */

const iconStroke = {
  fill: "none",
  stroke: "var(--gold)",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Gold line drawings, one per card — nothing photographic. */
const DETAIL_ICONS: Record<DetailIcon, ReactNode> = {
  bed: (
    <g {...iconStroke}>
      <path d="M4 26V8M4 26h40v-8a5 5 0 0 0-5-5H20v13" />
      <path d="M44 26v4M4 26v4" />
      <circle cx="12" cy="17" r="3.4" />
    </g>
  ),
  plane: (
    <g {...iconStroke}>
      <path d="M3 21l42-12M3 21l8 4 6-3M45 9l-9 15-5-9" />
      <path d="M17 22l4 7 3-5" />
    </g>
  ),
  camera: (
    <g {...iconStroke}>
      <path d="M4 13.5a2.5 2.5 0 0 1 2.5-2.5H13l2.6-3.6h16.8L35 11h6.5a2.5 2.5 0 0 1 2.5 2.5v14a2.5 2.5 0 0 1-2.5 2.5h-35A2.5 2.5 0 0 1 4 27.5v-14z" />
      <circle cx="24" cy="20.5" r="6.4" />
      <path d="M37.5 16h2.5" />
    </g>
  ),
  pin: (
    <g {...iconStroke}>
      <path d="M24 31.5s10.5-9.6 10.5-17.2a10.5 10.5 0 1 0-21 0C13.5 21.9 24 31.5 24 31.5z" />
      <circle cx="24" cy="14" r="4.1" />
    </g>
  ),
};

function DetailIconArt({ icon, className = "h-10 w-auto" }: { icon: DetailIcon; className?: string }) {
  return (
    <svg viewBox="0 0 48 34" className={className} aria-hidden="true">
      {DETAIL_ICONS[icon]}
    </svg>
  );
}

function DetailCards() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? DETAIL_CARDS[openIdx] : null;

  return (
    <>
      <Section id="details">
      <h2
        className="text-center font-display leading-none lowercase first-letter:uppercase text-foreground"
        style={{ fontSize: "clamp(2.1rem, 10vw, 2.6rem)" }}
      >
        additional details
      </h2>
      <Ornament className="mt-4 mb-8" />

      <div className="grid grid-cols-2 gap-3.5">
        {DETAIL_CARDS.map((card, i) => (
          <button
            key={card.title}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="relative flex flex-col items-center justify-center gap-3 rounded-2xl px-4 py-7 text-center transition-transform active:scale-[0.99]"
            style={{
              background: "color-mix(in oklab, var(--ivory) 68%, transparent)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              border: "1px solid color-mix(in oklab, var(--gold) 34%, transparent)",
              boxShadow: "0 10px 26px -16px oklch(0.32 0.03 60 / 0.4)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "var(--gradient-gold)" }}
            />
            <DetailIconArt icon={card.icon} />
            <span className="block font-display text-[1.25rem] leading-tight lowercase first-letter:uppercase text-foreground">
              {card.title}
            </span>
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-bronze/12 text-[0.85rem] text-bronze"
            >
              +
            </span>
          </button>
        ))}
      </div>
      </Section>

      <Modal
        open={active !== null}
        onClose={() => setOpenIdx(null)}
        label={active?.title ?? "Details"}
        variant="full"
      >
        {active && (
          <div className="flex min-h-full flex-col pt-6 pb-4 text-center">
            <div className="my-auto w-full">
              <DetailIconArt icon={active.icon} className="mx-auto h-16 w-auto" />
              <h3 className="mt-6 font-display text-[2.1rem] leading-tight lowercase first-letter:uppercase text-foreground">
                {active.title}
              </h3>
              <Ornament className="mt-5 mb-7" />
              {/* Paragraphs are blank-line separated in the copy, and it now
                  runs long enough that centring every line would hurt to read. */}
              <p className="mx-auto max-w-[20rem] text-left font-body text-[0.95rem] leading-relaxed whitespace-pre-line text-muted-foreground">
                {active.body}
              </p>

              {active.venues && <VenueList />}
              {active.gallery && <GalleryList />}
              {active.hotels && <HotelList />}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/**
 * Every venue in running order, one row each, with directions.
 *
 * The venue is the row's subject rather than the event, so it carries the
 * weight — the event name sits above it as the label. Each row keeps its date:
 * a flat list reads more cleanly than day-grouped headings, but without the
 * date a guest cannot tell which venue belongs to which morning.
 */
function VenueList() {
  // Events sharing a venue collapse into one row — "Haldi & Mehendi" rather
  // than the same address twice. Driven by an explicit flag, not by matching
  // venue names: four venues currently read "To be announced", and matching on
  // that would merge celebrations that have nothing to do with each other.
  const rows: { dates: string[]; names: string[]; event: WeddingEvent }[] = [];
  EVENT_DAYS.forEach((day) =>
    day.events.forEach((event) => {
      const previous = rows[rows.length - 1];
      if (event.sharesVenueWithPrevious && previous) {
        previous.names.push(event.name);
        if (!previous.dates.includes(day.date)) previous.dates.push(day.date);
      } else {
        rows.push({ dates: [day.date], names: [event.name], event });
      }
    }),
  );

  return (
    <div className="mx-auto mt-9 max-w-[20rem] text-left">
      <p className="mb-1 font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase text-muted-foreground">
        Venues
      </p>

      {rows.map(({ dates, names, event }, i) => {
        const directions = venueMapsHref(event.venue);
        const label = names.join(" & ");
        return (
          <div
            key={event.slug}
            className="flex items-center justify-between gap-3 py-3.5"
            style={{
              borderTop:
                i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
            }}
          >
            <div className="min-w-0">
              {/* The date stays quiet so the bold event name reads as the label
                  for the venue below, rather than the two competing. */}
              <p className="font-body text-[0.58rem] tracking-[0.18em] uppercase text-muted-foreground">
                {dates.map((d) => d.replace(" October", " Oct")).join(" & ")}
                <span aria-hidden="true"> · </span>
                <span className="font-bold text-foreground/75">{label}</span>
              </p>

              {/* The venue is what this list is for, so it is the loudest line. */}
              <p
                className={
                  directions
                    ? "mt-1 font-display text-[1.15rem] leading-tight font-semibold text-ink-strong"
                    : "mt-1 font-display text-[1.1rem] leading-tight text-muted-foreground italic"
                }
              >
                {event.venue.name}
              </p>

              {event.venue.address && (
                <p className="mt-0.5 truncate font-body text-[0.74rem] leading-snug text-muted-foreground">
                  {event.venue.address}
                </p>
              )}
            </div>

            {directions ? (
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                aria-label={`Directions to ${event.venue.name} for ${label}`}
                className="shrink-0 rounded-full px-3.5 py-2 font-body text-[0.62rem] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-90"
                style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
              >
                Map
              </a>
            ) : (
              <span className="shrink-0 font-body text-[0.56rem] tracking-[0.14em] uppercase text-muted-foreground/70">
                TBA
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Nearby hotels, each opening its own Google Maps place page. */
function HotelList() {
  return (
    <div className="mx-auto mt-8 max-w-[20rem] text-left">
      <p className="mb-1 font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase text-muted-foreground">
        Nearby hotels
      </p>

      {HOTELS.map((name, i) => (
        <a
          key={name}
          href={hotelHref(name)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 py-3.5"
          style={{
            borderTop:
              i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
          }}
        >
          <span className="min-w-0 font-display text-[1.08rem] leading-tight font-semibold text-ink-strong">
            {name}
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 rounded-full px-3.5 py-2 font-body text-[0.6rem] font-medium tracking-[0.14em] uppercase"
            style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
          >
            View
          </span>
        </a>
      ))}
    </div>
  );
}

/** One row per shared folder, in the order the celebrations happen. */
function GalleryList() {
  return (
    <div className="mx-auto mt-8 max-w-[20rem] text-left">
      <p className="mb-1 font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase text-muted-foreground">
        Shared folders
      </p>

      {GALLERY_FOLDERS.map((folder, i) => (
        <div
          key={folder.url}
          className="flex items-center justify-between gap-3 py-3.5"
          style={{
            borderTop:
              i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
          }}
        >
          <p className="min-w-0 font-display text-[1.15rem] leading-tight font-semibold text-ink-strong">
            {folder.label}
          </p>

          <a
            href={folder.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open the shared photo folder for ${folder.label}`}
            className="shrink-0 rounded-full px-3.5 py-2 font-body text-[0.62rem] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-90"
            style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
          >
            Open
          </a>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------- faqs ----------------------------------- */

function Faqs() {
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  return (
    <>
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
      </Section>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} label="Contact the couple">
        <div className="flex flex-col items-center gap-5 pt-3 pb-4 text-center">
          <p className="font-display text-2xl text-foreground">We'd love to hear from you</p>

          {/* Numbers first: most guests opening this want to call or message,
              and a tel: link dials straight from a phone. */}
          <div className="w-full">
            {CONTACTS.map((person, i) => (
              <div
                key={person.tel}
                className="flex items-center justify-between gap-3 py-3"
                style={{
                  borderTop:
                    i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
                }}
              >
                <div className="text-left">
                  <p className="font-display text-[1.15rem] leading-tight font-semibold text-ink-strong">
                    {person.name}
                  </p>
                  <p className="font-body text-[0.78rem] text-muted-foreground">{person.display}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <a
                    href={`tel:${person.tel}`}
                    aria-label={`Call ${person.name}`}
                    className="rounded-full px-3.5 py-2 font-body text-[0.6rem] font-medium tracking-[0.14em] uppercase"
                    style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${(person.whatsapp ?? person.tel).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Message ${person.name} on WhatsApp`}
                    className="rounded-full border px-3.5 py-2 font-body text-[0.6rem] font-medium tracking-[0.14em] uppercase text-bronze-deep"
                    style={{ borderColor: "color-mix(in oklab, var(--gold) 45%, transparent)" }}
                  >
                    Chat
                  </a>
                </div>
              </div>
            ))}
          </div>

          <span
            aria-hidden="true"
            className="block h-px w-12"
            style={{ background: "var(--gold)", opacity: 0.55 }}
          />

          <p className="font-body text-sm break-all text-muted-foreground">{CONTACT_EMAIL}</p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={async () => {
                setCopied((await copyText(CONTACT_EMAIL)) ? "done" : "failed");
                setTimeout(() => setCopied("idle"), 2400);
              }}
              className="rounded-lg border border-[var(--silver)]/60 bg-ivory px-5 py-2.5 font-body text-[0.62rem] font-medium tracking-[0.2em] uppercase text-foreground/80"
            >
              {copied === "done" ? "Copied ✓" : copied === "failed" ? "Copy failed" : "Copy email"}
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
    </>
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
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState<{
    waHref: string;
    recorded: boolean;
    accepted: boolean;
  } | null>(null);
  const [showPetals, setShowPetals] = useState(false);

  const allPicked = picked.length === allEvents.length;

  const toggle = (slug: string) => {
    setError(null);
    setPicked((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const first = String(form.get("first") ?? "").trim();
    const last = String(form.get("last") ?? "").trim();

    if (!first || !last) return setError("Please add your name.");
    if (!attending) return setError("Please let us know whether you can make it.");
    if (attending === "yes" && picked.length === 0)
      return setError("Please choose which celebrations you'll be joining.");

    const from = String(form.get("from") ?? "").trim();
    if (attending === "yes" && !from) return setError("Please tell us where you'll be travelling from.");

    const guests = String(form.get("guests") ?? "1");
    const note = String(form.get("note") ?? "").trim();
    const coming = allEvents.filter((ev) => picked.includes(ev.slug)).map((ev) => ev.name);

    const text = [
      `RSVP — ${first} ${last}`,
      attending === "yes" ? "Joyfully accepts" : "Regretfully declines",
      attending === "yes" && `Guests: ${guests}`,
      attending === "yes" && `Travelling from: ${from}`,
      attending === "yes" && `Attending: ${coming.join(", ")}`,
      note && `Note: ${note}`,
    ]
      .filter(Boolean)
      .join("\n");

    const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    // Record it before celebrating. If the sheet cannot be reached we say so
    // and fall back to WhatsApp, rather than thanking someone whose RSVP was
    // quietly dropped.
    setSending(true);
    setError(null);
    let recorded = false;
    try {
      const result = await submitRsvp({
        data: {
          firstName: first,
          lastName: last,
          attending,
          guests: Number(guests) || 1,
          travellingFrom: from,
          events: coming,
          note,
        },
      });
      recorded = result.ok;
    } catch {
      recorded = false;
    }
    setSending(false);

    const accepted = attending === "yes";
    setSubmitted({ waHref, recorded, accepted });
    // Petals are a celebration. Raining them on someone who just told us they
    // cannot come reads as tone-deaf.
    if (recorded && accepted) {
      setShowPetals(true);
      setTimeout(() => setShowPetals(false), 9000);
    }
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
            {submitted.recorded ? (
              <>
                <p className="font-display text-xl text-foreground italic">
                  {submitted.accepted
                    ? "Thank you — we can't wait to celebrate with you."
                    : "Thank you for letting us know — you'll be missed."}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Your reply has reached {COUPLE.bride} &amp; {COUPLE.groom}. Nothing more to do.
                </p>
                {/* Now genuinely optional: the answer is already recorded. */}
                <a
                  href={submitted.waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-[0.66rem] font-medium tracking-[0.2em] uppercase text-bronze underline underline-offset-4"
                >
                  Add a note on WhatsApp
                </a>
              </>
            ) : (
              <>
                <p className="font-display text-xl text-foreground italic">
                  We couldn't save your RSVP just now.
                </p>
                <p className="mx-auto max-w-[19rem] font-body text-xs leading-relaxed text-muted-foreground">
                  Sorry — something went wrong at our end, not yours. Please send
                  it to us on WhatsApp instead; it's already written out for you.
                </p>
                <a
                  href={submitted.waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-bronze px-8 py-4 font-body text-[0.66rem] font-medium tracking-[0.24em] uppercase text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Send it on WhatsApp
                </a>
              </>
            )}
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
              <input
                name="from"
                placeholder="Travelling from (city)"
                autoComplete="address-level2"
                className={inputClass}
                onChange={() => setError(null)}
              />
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
              disabled={sending}
              className="mt-2 rounded-full bg-bronze px-8 py-4 font-body text-[0.68rem] font-medium tracking-[0.28em] uppercase text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send RSVP"}
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
      <MusicCandidates />

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
              {COUPLE.bride} & {COUPLE.groom}
            </p>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
