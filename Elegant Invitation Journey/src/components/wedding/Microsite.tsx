import { useEffect, useState } from "react";

import storyAirport from "@/assets/story-airport.jpg";
import storyCamping from "@/assets/story-camping.jpg";
import storyOodenny from "@/assets/story-oodenny.jpg";

import {
  CONTACT_EMAIL,
  COUPLE,
  DETAIL_CARDS,
  EDITORIAL_COPY,
  EVENTS,
  FAQS,
  WEDDING_DATE_RANGE,
  WHATSAPP_NUMBER,
  mapsHref,
  type WeddingEvent,
} from "./data";
import { AddToCalendar } from "./AddToCalendar";
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

// TODO(content): captions, if you want any shown in the viewer.
const STORY_PHOTOS = [
  {
    src: storyCamping,
    alt: "Friends gathered around a campfire at sunset, tents and a bridge over the water behind them",
    rotate: -1.8,
  },
  {
    src: storyAirport,
    alt: "The couple holding each other at the airport departures kerb at sunset",
    rotate: 1.5,
  },
  {
    src: storyOodenny,
    alt: "The couple on a picnic blanket under a tree, a snow-capped mountain in the distance",
    rotate: -0.9,
  },
];

/** Pin offset for the deck — clears the pinned heading above it. */
const CARD_TOP = "46vh";

function Story() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = STORY_PHOTOS.length;

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, count]);

  const shown = lightbox !== null ? STORY_PHOTOS[lightbox] : null;

  return (
    <section id="story" className="relative">
      {/* Rises with the scroll, then holds while the deck stacks beneath it.
          Opaque so cards travelling up are masked rather than showing through. */}
      <div className="sticky top-0 z-30 bg-background px-5 pt-24 pb-6 text-center">
        <Reveal>
          <h2
            className="font-display leading-[0.95] lowercase text-foreground"
            style={{ fontSize: "clamp(3rem, 14vw, 3.6rem)" }}
          >
            our story
          </h2>
          <p className="mt-8 font-body text-[1.12rem] font-bold text-foreground">
            chapter one: how we met
          </p>
          <div className="mx-auto mt-4 max-w-[21rem] space-y-4 font-body text-base leading-relaxed text-muted-foreground">
            <p>
              We met in a crowded library in Hyderabad, arguing quietly over the last copy of a
              book neither of us ended up reading.
            </p>
            <p>
              Nine years, four cities and one very stubborn rescue dog later, we are asking the
              people we love most to stand with us as we begin the next part.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Each print pins at the same offset, so the next one rises over the
          one already parked there. DOM order is the stacking order. */}
      <div id="gallery" className="px-5">
        {STORY_PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            className="sticky mx-auto w-[88%]"
            style={{ top: CARD_TOP, zIndex: 10 + i, marginTop: i === 0 ? "48vh" : "10vh" }}
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`Enlarge photo ${i + 1} of ${count}`}
              className="block w-full rounded-[14px] bg-pearl p-2.5 transition-transform hover:scale-[1.01]"
              style={{ transform: `rotate(${photo.rotate}deg)`, boxShadow: "var(--shadow-paper)" }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={1000}
                height={750}
                className="w-full rounded-[8px] object-cover"
                style={{ aspectRatio: "4 / 3" }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Lets the finished stack sit on screen before the section releases */}
      <div aria-hidden="true" className="h-[46vh]" />

      <Modal open={shown !== null} onClose={() => setLightbox(null)} label="Photo viewer">
        {shown && (
          <div
            className="flex flex-col items-center gap-5 pt-2 pb-4"
            onTouchStart={(e) => {
              const startX = e.touches[0].clientX;
              const onEnd = (ev: TouchEvent) => {
                const dx = ev.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > 48)
                  setLightbox((i) => (i === null ? i : (i + (dx < 0 ? 1 : count - 1)) % count));
                window.removeEventListener("touchend", onEnd);
              };
              window.addEventListener("touchend", onEnd);
            }}
          >
            <img
              src={shown.src}
              alt={shown.alt}
              width={1000}
              height={750}
              className="w-full rounded-[12px] object-cover"
              style={{ aspectRatio: "4 / 3" }}
            />
            <div className="flex items-center gap-8">
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setLightbox((i) => (i === null ? i : (i - 1 + count) % count))}
                className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground/70"
              >
                ←
              </button>
              <span className="font-body text-xs text-muted-foreground">
                {(lightbox ?? 0) + 1} / {count}
              </span>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % count))}
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

/* ------------------------------ editorial fill ------------------------------ */

/**
 * Quiet statement between the story and the schedule. Deliberately static —
 * the scroll-ink treatment belongs to <ScrollReveal /> alone, and running it
 * twice would spend the effect.
 */
function EditorialInterlude() {
  return (
    <Section>
      <p className="font-display text-[1.65rem] leading-snug text-foreground/90">{EDITORIAL_COPY}</p>
    </Section>
  );
}

/* ---------------------------------- events ---------------------------------- */

function EventsSection() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const active = EVENTS.find((e) => e.slug === openSlug) ?? null;

  return (
    <Section id="events">
      <h2 className="font-display text-5xl lowercase text-foreground">the celebrations</h2>
      <p className="mt-3 font-body text-sm text-muted-foreground">
        Three days · six celebrations · {WEDDING_DATE_RANGE}
      </p>

      <div className="mt-10 space-y-6">
        {EVENTS.map((event) => (
          <Reveal key={event.slug}>
            <button
              type="button"
              onClick={() => setOpenSlug(event.slug)}
              className="group w-full overflow-hidden rounded-[24px] bg-pearl text-left ring-1 ring-[var(--border)] transition-shadow hover:shadow-[var(--shadow-paper)]"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={event.img}
                  alt={`${event.name} illustration`}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-end justify-between gap-3 px-6 py-5">
                <div>
                  <p className="font-body text-[0.55rem] tracking-[0.26em] uppercase text-muted-foreground">
                    {event.day} · {event.time}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl text-foreground">{event.name}</h3>
                  <p className="font-script text-lg text-bronze">{event.theme}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="mb-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-lg text-foreground/60 transition-colors group-hover:bg-bronze group-hover:text-primary-foreground"
                >
                  +
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Modal open={active !== null} onClose={() => setOpenSlug(null)} label={active?.name ?? "Event"}>
        {active && (
          <div className="pt-2">
            <img
              src={active.img}
              alt=""
              aria-hidden="true"
              width={1024}
              height={640}
              className="aspect-[16/9] w-full rounded-[16px] object-cover"
            />
            <h3 className="mt-5 font-display text-3xl text-foreground">{active.name}</h3>
            <p className="font-script text-xl text-bronze">{active.theme}</p>

            <dl className="mt-5 space-y-3 font-body text-sm text-muted-foreground">
              <div>
                <dt className="eyebrow text-[0.5rem]">When</dt>
                <dd className="mt-1">
                  {active.date} · {active.time}
                  {active.note && <span className="block text-xs italic opacity-75">{active.note}</span>}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.5rem]">Dress code</dt>
                <dd className="mt-1">{active.dressCode}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.5rem]">Venue</dt>
                <dd className="mt-1">{active.venueName}</dd>
              </div>
            </dl>

            <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground">
              {active.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 pb-2">
              <a
                href={mapsHref(active.venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-bronze px-5 py-2.5 font-body text-[0.62rem] font-medium tracking-[0.2em] uppercase text-primary-foreground transition-opacity hover:opacity-90"
              >
                Open in Maps
              </a>
              <AddToCalendar
                compact
                event={{
                  title: `${active.name} — ${COUPLE.bride} & ${COUPLE.groom}`,
                  description: `${active.description} Theme: ${active.theme}. Dress code: ${active.dressCode}`,
                  location: active.venueName,
                  startUtc: active.start.toISOString(),
                  endUtc: active.end.toISOString(),
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}

/* ------------------------------ detail cards ------------------------------ */

function DetailCards() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? DETAIL_CARDS[openIdx] : null;

  return (
    <Section id="travel">
      <h2 className="font-display text-5xl lowercase text-foreground">additional details</h2>
      <div className="mt-10 grid grid-cols-2 gap-4">
        {DETAIL_CARDS.map((card, i) => (
          <button
            key={card.title}
            type="button"
            onClick={() => setOpenIdx(i)}
            className={`group relative overflow-hidden rounded-[20px] text-left ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
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
  const [open, setOpen] = useState<number | null>(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <Section id="faqs">
      <h2 className="font-display text-5xl lowercase text-foreground">questions and answers</h2>
      <p className="mt-4 font-body text-sm text-muted-foreground">
        Can't find what you're looking for?{" "}
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="text-bronze underline decoration-[var(--gold)] underline-offset-4"
        >
          Reach out to {COUPLE.bride} or {COUPLE.groom}
        </button>
      </p>

      <div className="mt-8 divide-y divide-[var(--border)]">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-lg text-foreground">{faq.q}</span>
                <span
                  aria-hidden="true"
                  className="text-sm text-muted-foreground transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  ⌄
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-400 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 font-body text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState<{ waHref: string } | null>(null);
  const [showPetals, setShowPetals] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const first = String(form.get("first") ?? "").trim();
    const last = String(form.get("last") ?? "").trim();
    if (!first || !last || !attending) {
      setError(true);
      return;
    }
    const guests = String(form.get("guests") ?? "1");
    const note = String(form.get("note") ?? "").trim();
    const text = [
      `RSVP — ${first} ${last}`,
      attending === "yes" ? "Joyfully accepts 🤍" : "Regretfully declines",
      `Guests: ${guests}`,
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
      <div className="rounded-[24px] bg-pearl px-6 py-9 ring-1 ring-[var(--border)]" style={{ boxShadow: "var(--shadow-paper)" }}>
        <h2 className="text-center font-display text-4xl lowercase text-foreground">rsvp</h2>
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
              <input name="first" required placeholder="First name" className={inputClass} />
              <input name="last" required placeholder="Last name" className={inputClass} />
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
                    setError(false);
                  }}
                  aria-pressed={attending === value}
                  className="px-3 py-3.5 font-body text-[0.6rem] font-medium tracking-[0.16em] uppercase transition-colors"
                  style={{
                    background: attending === value ? "var(--bronze)" : "var(--ivory)",
                    color: attending === value ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <select name="guests" defaultValue="1" className={inputClass} aria-label="Number of guests">
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>

            <textarea name="note" rows={3} placeholder="A note for the couple (optional)" className={inputClass} />

            {error && (
              <p className="text-center font-body text-xs text-destructive">
                Please add your name and choose whether you can attend.
              </p>
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

        <ScrollReveal />

        <Story />
        <EditorialInterlude />
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
