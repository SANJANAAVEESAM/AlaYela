import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { COUPLE } from "@/components/wedding/data";
import { getEvent, type WeddingEvent } from "@/components/wedding/events";
import { Ornament, SectionLabel } from "@/components/wedding/Ornament";
import { Reveal } from "@/components/wedding/Reveal";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Celebration not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const { event } = loaderData;
    const title = `${event.name} — ${event.theme} · ${COUPLE.bride} & ${COUPLE.groom}`;
    const description = `${event.tagline}. ${event.date}, ${event.time} at ${event.venue.name}, Hyderabad.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventPage,
});

function EventPage() {
  const { event } = Route.useLoaderData() as { event: WeddingEvent };
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.venue.mapsQuery,
  )}`;

  return (
    <main className="animate-rise relative mx-auto w-full max-w-[26rem] pb-20 text-shadow-soft">
      <div className="w-full px-5 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-[0.65rem] tracking-[0.24em] uppercase text-muted-foreground transition-colors hover:text-olive"
        >
          <span aria-hidden="true">←</span> All celebrations
        </Link>
      </div>

      {/* Hero — transparent so the couple background shows through the image */}
      <section className="w-full px-5 pt-8 text-center">
        <SectionLabel>{event.when}</SectionLabel>
        <h1 className="mt-4 font-display text-[2.6rem] tracking-wide text-olive">
          {event.name}
        </h1>
        <p className="mt-3 font-script text-3xl text-gold text-shadow-gold">{event.theme}</p>
        <Ornament className="my-7" />
        <p className="mx-auto w-full font-display text-lg leading-relaxed text-foreground/85 italic">
          {event.tagline}
        </p>
        <img
          src={event.img}
          alt={`Watercolour illustration for the ${event.name} celebration`}
          width={1024}
          height={1024}
          className="mx-auto mt-10 w-full"
        />
      </section>

      {/* Intro + when — transparent against the couple background */}
      <section className="w-full px-5 py-16">
        <Reveal>
          <p className="mx-auto w-full text-center font-body text-sm leading-relaxed text-muted-foreground">
            {event.intro}
          </p>
          <dl className="mx-auto mt-8 grid w-full grid-cols-2 gap-px overflow-hidden rounded-sm bg-[var(--gold)]/25 sm:grid-cols-2">
            <div className="px-6 py-6 text-center">
              <dt className="eyebrow">Date</dt>
              <dd className="mt-2 font-display text-xl text-olive">{event.date}</dd>
            </div>
            <div className="px-6 py-6 text-center">
              <dt className="eyebrow">Time</dt>
              <dd className="mt-2 font-display text-xl text-olive">{event.time}</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      {/* Venue */}
      <section className="w-full px-5 pb-16">
        <Reveal>
          <SectionLabel>The Venue</SectionLabel>
          <Ornament className="mt-6 mb-8" />
          <div className="rounded-sm px-7 py-8 text-center ring-1 ring-[var(--gold)]/25">
            <h2 className="font-display text-2xl text-olive">{event.venue.name}</h2>
            <p className="mx-auto mt-3 max-w-xs font-body text-sm leading-relaxed text-muted-foreground">
              {event.venue.address}
            </p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-sm bg-olive px-7 py-3 font-body text-[0.7rem] tracking-[0.24em] uppercase text-ivory transition-opacity hover:opacity-90"
            >
              Open in Maps
            </a>
          </div>
        </Reveal>
      </section>

      {/* Schedule */}
      <section className="w-full px-5 pb-16">
        <Reveal>
          <SectionLabel>Order of the Day</SectionLabel>
          <Ornament className="mt-6 mb-8" />
          <ol className="mx-auto w-full divide-y divide-[var(--gold)]/20">
            {event.schedule.map((s) => (
              <li key={s.title} className="flex items-baseline gap-5 py-5">
                <span className="w-24 shrink-0 font-body text-[0.65rem] tracking-[0.2em] uppercase text-gold">
                  {s.time}
                </span>
                <span>
                  <span className="block font-display text-xl text-olive">{s.title}</span>
                  <span className="mt-1 block font-body text-sm text-muted-foreground">
                    {s.note}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Dress code */}
      <section className="w-full px-5 pb-16">
        <Reveal>
          <SectionLabel>Dress Code</SectionLabel>
          <Ornament className="mt-6 mb-8" />
          <p className="mx-auto max-w-sm text-center font-body text-sm leading-relaxed text-muted-foreground">
            {event.dressCode}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-6">
            {event.palette.map((c) => (
              <div key={c.name} className="text-center">
                <span
                  className="block size-14 rounded-full ring-1 ring-[var(--gold)]/35"
                  style={{ background: c.value }}
                />
                <span className="mt-3 block font-body text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Details */}
      <section className="w-full px-5 pb-16">
        <Reveal>
          <SectionLabel>Good to Know</SectionLabel>
          <Ornament className="mt-6 mb-8" />
          <dl className="mx-auto w-full divide-y divide-[var(--gold)]/20">
            {event.details.map((d) => (
              <div key={d.q} className="py-5">
                <dt className="font-display text-lg text-olive">{d.q}</dt>
                <dd className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">
                  {d.a}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <div className="px-6 pb-16 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/50 px-8 py-4 font-body text-[0.7rem] tracking-[0.28em] uppercase text-olive transition-colors hover:bg-secondary"
        >
          Back to the invitation
        </Link>
      </div>
    </main>
  );
}