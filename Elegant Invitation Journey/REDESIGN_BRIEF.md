# Lasya & Avyay — "Cordially × Apple × handcrafted stationery" redesign

This brief redesigns the existing TanStack Start wedding site in this repo.
Read the whole file before writing code. Keep the existing stack
(TanStack Start v1, React 19, TypeScript, Tailwind v4 — no tailwind.config.js,
tokens live in `src/styles.css` under `@theme inline` + `:root`).

---

## 0. Decisions already made (don't re-ask)

- **Dates: Oct 29–31, with the muhurtham (wedding ceremony) Oct 31 at 7:25 PM IST.**
  ⚠️ YEAR IS UNCONFIRMED: the reference doc says 2027, the current repo says 2026.
  Default to **2026** (matching `WEDDING_DATE` already in the repo) but define the
  year ONCE in `data.ts` as `const WEDDING_YEAR = 2026` so it's a one-line fix.
  7:25 PM IST = 13:55 UTC → `new Date(Date.UTC(WEDDING_YEAR, 9, 31, 13, 55))`.
- **Couple photo**: `src/assets/couple-photo.jpg` (torn-paper edges baked in — use
  this one for the hero, the torn edges ARE the aesthetic) and
  `src/assets/couple-photo-clean.jpg` (cropped, no torn edges — use for og:image
  and any place a clean rectangle is needed). Both are provided; copy them in.
- **RSVP**: there is no backend. Keep RSVP client-side (name + attending +
  guest-count + note), show a confirmation with falling petals, and offer a
  prefilled WhatsApp deep link (`https://wa.me/919000000000?text=...`) carrying
  the form contents so the couple actually receives it.
- **Venue map links**: real venue names/links were NOT provided. Use
  `https://www.google.com/maps/search/?api=1&query=<placeholder>` and mark each
  with `// TODO(venue)` so they're greppable.
- **No sound.** The reference doc asks for a paper-opening sound; skip it
  (autoplay restrictions make it unreliable and it annoys on mobile).

## 1. Palette & type shift (edit `src/styles.css` tokens in place)

Move from sage/olive to Cordially's warm editorial cream. Keep oklch:

- `--background`: warm ivory `oklch(0.965 0.012 80)`
- `--foreground`: espresso ink `oklch(0.28 0.02 60)`
- `--accent` / primary buttons: bronze `oklch(0.55 0.09 65)` (Cordially's brown CTA)
- Silver foil (envelope monogram): `oklch(0.8 0.01 260)` with a subtle
  `background: linear-gradient(110deg, #cfd2d8, #f4f5f7 45%, #b9bdc7)` +
  `background-clip: text` shimmer.
- Keep `--gold` for small ornaments; retire sage/olive envelope vars.
- Type: keep Cormorant Garamond (display, tight leading, large sizes like the
  screenshots: hero lines at ~clamp(2.5rem, 9vw, 4rem)), Karla (UI/body).
  Drop the global `body { font-weight: 600 }` — Cordially's body copy is 400;
  keep 500–600 only for labels/buttons.

## 2. Screen flow (exact sequence)

### Scene 1 — Envelope (`src/components/wedding/Envelope.tsx`, rewrite)
Full-screen, no scroll/nav. Warm **ivory** envelope (~70% of viewport), embossed
botanical pattern (SVG tile, `mix-blend-mode: multiply` at low opacity — mimic
the tone-on-tone embossing in the reference screenshot), soft drop shadow, thin
silver border, visible folded flap. Center: **"LA"** in Parisienne with the
silver-foil gradient text treatment (no wax seal). Below the envelope:
"Tap to Open" in small tracked-out caps.

### Scene 2 — Opening
On tap: flap rotates open (rotateX from top fold), inner card slides up ~40px,
envelope halves ease apart. ~4s total using CSS transitions with
`cubic-bezier(0.22, 1, 0.36, 1)`. GPU transforms only (transform/opacity).

### Scene 3 — Scratch reveal (`src/components/wedding/ScratchCard.tsx`, new)
Ivory card: "Scratch Me" (display serif) + "Reveal our special announcement"
(small gold caps). A `<canvas>` overlays the card painted with a metallic-foil
fill (layered linear gradients + noise). Pointer events scratch via
`globalCompositeOperation = "destination-out"` with a soft round brush
(~28px radius, interpolate between move events so fast swipes leave no gaps).
Emit small particle flecks from the scratch point (short-lived absolutely
positioned spans, or a second canvas). Track cleared ratio by sampling
`getImageData` on a 1-in-10 downsampled grid every ~300ms; at **≥40% cleared**,
fade the whole foil layer out over 600ms and call `onRevealed()`.
Support mouse + touch (pointer events), `touch-action: none` on the canvas.

### Scene 4 — Hero
Cross-fade from the scratch card into the microsite hero — no hard cut:
the card's photo peek becomes the hero image (shared element feel is fine to
fake with a fade-through-cream).

Hero = full-viewport rounded-corner (24px) photo card with margins on cream,
exactly like the Cordially "Jim & Pam" screenshot: `couple-photo.jpg`,
warm cream overlay gradient at the bottom, soft vignette, **very slow zoom**
(scale 1 → 1.06 over 30s, pausable via `prefers-reduced-motion`).
Content over the photo, bottom-anchored:
- "We're Getting Married" (small caps eyebrow)
- "Lasya ♡ Avyay" (script ♡ between display-serif names)
- "October 29–31" + year from `WEDDING_YEAR`
- "SCROLL TO EXPLORE" hairline + arrow.

Directly under the hero (first cream section): live **Countdown**
(reuse/restyle `Countdown.tsx` — Cordially style: big serif numerals,
letter-spaced tiny labels, colon separators, NO boxes) and an
**Add to Calendar** button (see §6).

## 3. Floating navigation (`src/components/wedding/FloatingNav.tsx`, new)
Appears only after the hero is revealed (not during envelope/scratch).
Pinned pill, top of viewport, phone-width aware: white glass
(`backdrop-blur-md bg-white/70`), large soft shadow, rounded-full.
Contents: "LA" monogram (scrolls to top) · bronze **RSVP** pill button
(scrolls to RSVP) · hamburger. Hamburger opens a FULL-SCREEN cream menu
(fade+rise, staggered links): Home, Story, Events, Gallery, RSVP, Travel, FAQs —
each scrolls to its section (single page, no route changes). Lock body scroll
while open. `Esc`/X closes.

## 4. Scroll behavior
Scroll-linked, user-controlled, nothing autonomous (Apple-style):
- Implement a tiny `useScrollProgress(ref)` hook with
  `requestAnimationFrame` + passive scroll listener returning 0–1 progress;
  drive hero photo blur/soften, content drift-up, countdown fade from it.
  **Do not install GSAP/Lenis/Framer Motion** unless something proves
  impossible without them — native scroll + rAF + CSS keeps the bundle small
  and avoids fighting TanStack SSR. If you do add one, add ONLY framer-motion.
- Section reveals: keep the existing `Reveal.tsx` IntersectionObserver
  (opacity 0 / translateY 26px → in, 900ms, same bezier).
- Background transitions: blend, never swap — sections sit on cream, and a
  fixed botanical SVG watermark fades in via scroll progress after the hero.

## 5. Sections (single scrolling page, in order)
1. **Hero** (above).
2. **Story** — huge serif heading ("our story" lowercase, like the reference),
   "chapter one: how we met" bold small heading, 2 short paragraphs (keep the
   existing library/monsoon copy), then stacked rotated polaroids
   (reuse Gallery data; tap to enlarge in the shared modal, swipe/arrows
   between them).
3. **Editorial interlude** — the Cordially trick: a full-width serif paragraph
   where words fill from muted→ink as you scroll (split into word spans, color
   driven by scroll progress). Copy: "The vision is simple: all of our most
   beloved people in one place, over three days of colour, music and one
   very important muhurtham."
4. **Events ("The Celebrations")** — editorial cards (rounded 24px, photo top,
   name + theme + time), each opening a premium bottom-sheet modal
   (`Modal.tsx`, new, shared): theme, dress code, time, venue + "Open in Maps",
   Add to Calendar (per-event), description, existing event illustration.
   **Replace the old program with:**
   | # | Date | Event | Theme | Time | Notes |
   |---|------|-------|-------|------|-------|
   | 1 | Oct 29 | Haldi | Carnival | 12:00 PM onwards | Mehendi follows at 5 PM |
   | 2 | Oct 29 | Mehendi | Garden lanterns | 5:00 PM onwards | — |
   | 3 | Oct 30 | Pellikuthuru | Vintage | 9:30 AM onwards | Dress code: anything except sarees |
   | 4 | Oct 30 | Sangeet & Cocktail | Masquerade Ball — Bling | 6:00 PM onwards | — |
   | 5 | Oct 31 | Pellikoduku | Vintage | 11:15 AM onwards | — |
   | 6 | Oct 31 | Wedding Ceremony | Muhurtham | 7:25 PM | The main ceremony |
   Update `data.ts` (this replaces the old 2026-program & event pages; delete
   the `/events/$slug` route + its file — modals replace it — and remove the
   now-unused per-event route links).
5. **Additional details** — Cordially-style large photo cards with a "+" chip:
   Wedding Party, Accommodation, Travel, Dress Codes, Venue Information,
   Nearby Hotels, Transportation. Each opens the shared modal with placeholder
   copy marked `// TODO(content)`.
6. **FAQs** — "Questions and answers" serif heading, "Reach out to Lasya or
   Avyay" link opening a small modal (copy email / open mail app — mirror the
   reference screenshot), then an accordion (chevron rotates, height animates).
   Seed with the existing Things-to-Know Q&A + "When should I RSVP by?",
   "Can I bring a plus one or my kids?".
7. **RSVP** — floating card form: first name, last name, attending (segmented
   Joyfully Accept / Regretfully Decline), guests (1–4), note. Validate, then
   confirmation + gentle petal fall (reuse `Petals.tsx`, recolor to
   cream/bronze) + prefilled WhatsApp link.
8. **Closing** — script "We can't wait to celebrate with you", small caps
   "Lasya & Avyay · October 29–31".

## 6. Add to Calendar (`src/lib/calendar.ts`, new)
Two options in a tiny popover: **Apple/Outlook (.ics)** — generate the ICS text
client-side (UID per event, DTSTART/DTEND in UTC, escape commas/newlines),
download via Blob URL — and **Google Calendar** — the
`calendar.google.com/calendar/render?action=TEMPLATE&...` URL. One entry for
the whole wedding (Oct 29 12:00 IST → Oct 31 23:00 IST) from the hero button;
per-event entries from event modals.

## 7. Root layout (`src/routes/__root.tsx`)
- Remove the fixed couple-illustration background + veil entirely (the hero
  owns the photo now). Body background = cream token.
- Keep phone-width `max-w-[26rem] mx-auto` for content, but let the hero card
  and nav feel edge-to-edge within it.
- og:image → `couple-photo-clean.jpg`. Keep existing title/description.
- Keep the Google Fonts link (same three families).

## 8. Performance & quality bar
60fps: animate only transform/opacity/filter; `will-change` sparingly;
lazy-load every image below the fold (`loading="lazy"`); no layout shift
(explicit aspect ratios on all images); honor `prefers-reduced-motion`
(skip zoom, scratch auto-reveals via a "Reveal" button fallback — also the
no-JS/keyboard path); envelope & scratch reachable by keyboard (Enter/Space).
`bun run build` must pass with zero TS errors before you finish.

## 9. What to keep from the current codebase
`Reveal.tsx` (as-is), `Petals.tsx` (recolor), `Countdown.tsx` (restyle),
`Ornament.tsx` (thin the line weight), fonts, the `Section`/eyebrow pattern in
`Microsite.tsx` as a starting skeleton. Everything sage/olive-envelope specific
goes. Commit in logical chunks with clear messages.
