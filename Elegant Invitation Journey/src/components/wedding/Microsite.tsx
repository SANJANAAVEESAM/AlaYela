import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { COUPLE, PALETTE, PROGRAM, THINGS_TO_KNOW } from "./data";
import { Countdown } from "./Countdown";
import { Ornament, SectionLabel } from "./Ornament";
import { Reveal } from "./Reveal";

const GALLERY = [
  { caption: "The first monsoon", rotate: -3 },
  { caption: "Coorg, 2023", rotate: 2 },
  { caption: "She said yes", rotate: -1.5 },
];

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="w-full px-5 py-14">
      <Reveal>
        <SectionLabel>{label}</SectionLabel>
        {title && (
          <h2 className="mt-4 text-center font-display text-3xl tracking-wide text-olive sm:text-4xl">
            {title}
          </h2>
        )}
        <Ornament className="mt-6 mb-10" />
        {children}
      </Reveal>
    </section>
  );
}

export function Microsite() {
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);

  return (
    <main className="animate-rise relative mx-auto w-full max-w-[26rem] text-shadow-soft">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-12 pb-16 text-center">
        <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-wide text-olive">
          {COUPLE.bride}
          <span className="mx-3 block font-script text-3xl text-gold">&</span>
          {COUPLE.groom}
        </h1>
        <Ornament className="my-7" />
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Invite you to celebrate
        </p>
        <p className="mt-4 font-display text-2xl tracking-[0.32em] text-foreground">31 · 10 · 26</p>
        <p className="mt-3 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
          Hyderabad, India
        </p>
      </section>

      {/* Our story */}
      <Section id="story" label="Our Story" title="Nine years, one monsoon">
        <div className="space-y-5 text-center font-display text-lg leading-relaxed text-foreground/85 italic">
          <p>
            We met in a crowded library in Hyderabad, arguing quietly over the last copy of a
            book neither of us ended up reading.
          </p>
          <p>
            Nine years, four cities and one very stubborn rescue dog later, we are asking the
            people we love most to stand with us as we begin the next part.
          </p>
        </div>
      </Section>

      {/* Program */}
      <Section id="program" label="The Celebrations" title="Four evenings">
        <ol className="relative mx-auto w-full">
          <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-[var(--gold)]/35" />
          {PROGRAM.map((item, i) => (
            <li
              key={item.title}
              className="group relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-5"
            >
              <Link
                to="/events/$slug"
                params={{ slug: item.slug }}
                className="absolute inset-0 z-10"
                aria-label={`View details for ${item.title}`}
              />

              <div className={i % 2 === 0 ? "text-right" : "order-3 text-left"}>
                <p className="font-display text-lg text-olive transition-colors group-hover:text-gold">
                  {item.title}
                </p>
                <p className="mt-1 font-body text-xs text-muted-foreground">{item.note}</p>
              </div>
              <span className="order-2 size-2.5 rotate-45 bg-[var(--gold)]" />
              <p
                className={`font-body text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground ${
                  i % 2 === 0 ? "order-3 text-left" : "text-right"
                }`}
              >
                {item.time}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Gallery */}
      <Section id="gallery" label="Gallery" title="A few of ours">
        <div className="flex flex-wrap justify-center gap-4">
          {GALLERY.map((g, i) => (
            <figure
              key={g.caption}
              className="paper w-36 rounded-sm p-3 pb-5"
              style={{ transform: `rotate(${g.rotate}deg)` }}
            >
              <div
                className="aspect-square w-full"
                style={{
                  background:
                    i % 2
                      ? "linear-gradient(160deg, var(--sage), var(--ivory))"
                      : "linear-gradient(160deg, var(--gold), var(--ivory))",
                  opacity: 0.55,
                }}
              />
              <figcaption className="mt-4 text-center font-script text-lg text-olive">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Dress code */}
      <Section id="dress" label="Dress Code" title="Garden formal">
        <p className="mx-auto max-w-sm text-center font-body text-sm leading-relaxed text-muted-foreground">
          Flowing silhouettes, soft greens and ivories. Block heels are kind to courtyard stone.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-5">
          {PALETTE.map((c) => (
            <div key={c.name} className="text-center">
              <span
                className="block size-12 rounded-full ring-1 ring-[var(--gold)]/35"
                style={{ background: c.value }}
              />
              <span className="mt-3 block font-body text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Things to know */}
      <Section id="know" label="Things to Know">
        <dl className="mx-auto w-full divide-y divide-[var(--gold)]/20">
          {THINGS_TO_KNOW.map((t) => (
            <div key={t.q} className="py-5">
              <dt className="font-display text-lg text-olive">{t.q}</dt>
              <dd className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{t.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Countdown */}
      <Section id="countdown" label="Counting Down">
        <Countdown />
      </Section>

      {/* RSVP */}
      <Section id="rsvp" label="RSVP" title="Will you join us?">
        {rsvp ? (
          <p className="text-center font-display text-xl text-olive italic">
            {rsvp === "yes"
              ? "Wonderful — your seat is saved. We'll be in touch with the details."
              : "We'll miss you, but thank you for letting us know."}
          </p>
        ) : (
          <div className="mx-auto flex max-w-sm flex-col gap-3">
            <button
              type="button"
              onClick={() => setRsvp("yes")}
              className="rounded-full bg-olive px-8 py-4 font-body text-[0.7rem] tracking-[0.28em] uppercase text-ivory transition-opacity hover:opacity-90"
            >
              I'll Be There
            </button>
            <button
              type="button"
              onClick={() => setRsvp("no")}
              className="rounded-full border border-[var(--gold)]/50 px-8 py-4 font-body text-[0.7rem] tracking-[0.28em] uppercase text-olive transition-colors hover:bg-secondary"
            >
              Can't Make It
            </button>
          </div>
        )}
        <p className="mt-8 text-center font-body text-xs text-muted-foreground">
          Questions?{" "}
          <a
            href="https://wa.me/919000000000"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[var(--gold)] underline-offset-4"
          >
            Message us on WhatsApp
          </a>
        </p>
      </Section>

      {/* Closing */}
      <section className="px-5 pt-8 pb-20 text-center">
        <Reveal>
          <p className="mx-auto max-w-[16rem] font-script text-2xl leading-snug text-olive">
            We can't wait to celebrate with you
          </p>
          <p className="mt-8 font-body text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground">
            {COUPLE.bride} & {COUPLE.groom} · October 31
          </p>
        </Reveal>
      </section>
    </main>
  );
}