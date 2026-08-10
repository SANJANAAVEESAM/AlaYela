import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { MUSIC_SRC } from "@/lib/music";

/**
 * SCRATCH ROUTE — reports what the browser actually does with the track.
 *
 * Android gives no sound and nothing here can reproduce it, so this asks the
 * device directly: can it decode the format, does it honour volume, does play()
 * resolve or reject, and what the element reports afterwards.
 *
 * Delete once the cause is found.
 */
export const Route = createFileRoute("/audio-check")({
  head: () => ({ meta: [{ title: "Audio check" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AudioCheck,
});

type Line = { k: string; v: string; bad?: boolean };

const ERR: Record<number, string> = {
  1: "ABORTED — fetch stopped",
  2: "NETWORK — download failed",
  3: "DECODE — file fetched but could not be decoded",
  4: "SRC_NOT_SUPPORTED — format refused, or file not found",
};

function AudioCheck() {
  const [lines, setLines] = useState<Line[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    if (running) return;
    setRunning(true);
    const out: Line[] = [];
    const add = (k: string, v: string, bad = false) => out.push({ k, v, bad });

    const probe = document.createElement("audio");
    add("User agent", navigator.userAgent.slice(0, 90));
    add("audio/mp4", probe.canPlayType("audio/mp4") || "(empty = no)", !probe.canPlayType("audio/mp4"));
    add(
      'audio/mp4; codecs="mp4a.40.2"',
      probe.canPlayType('audio/mp4; codecs="mp4a.40.2"') || "(empty = no)",
      !probe.canPlayType('audio/mp4; codecs="mp4a.40.2"'),
    );
    add("audio/mpeg (mp3)", probe.canPlayType("audio/mpeg") || "(empty = no)");

    // Can the file be fetched at all, and as what?
    try {
      const res = await fetch(MUSIC_SRC, { method: "GET", headers: { Range: "bytes=0-1023" } });
      add("Fetch status", String(res.status), !(res.status === 200 || res.status === 206));
      add("Content-Type", res.headers.get("content-type") ?? "(none)");
    } catch (e) {
      add("Fetch", "FAILED: " + String(e), true);
    }

    const el = new Audio(MUSIC_SRC);
    el.loop = true;
    el.preload = "auto";

    el.volume = 0.5;
    const settable = Math.abs(el.volume - 0.5) < 0.01;
    add(
      "WHAT THE SITE DOES HERE",
      settable
        ? "plays the element directly, no AudioContext involved"
        : "routes through Web Audio (the iOS path)",
    );
    add("Volume settable", String(settable));
    el.volume = 0.3;

    let played = false;
    try {
      await el.play();
      played = true;
      add("play()", "resolved");
    } catch (e) {
      const err = e as Error;
      add("play()", `REJECTED — ${err.name}: ${err.message}`, true);
    }

    await new Promise((r) => setTimeout(r, 900));

    add("paused", String(el.paused), el.paused && played);
    add("muted", String(el.muted), el.muted);
    add("volume now", String(el.volume));
    add("currentTime", el.currentTime.toFixed(2) + "s", played && el.currentTime === 0);
    add("readyState", `${el.readyState} (4 = can play through)`, el.readyState === 0);
    add("networkState", String(el.networkState));
    if (el.error) add("element error", `${el.error.code} — ${ERR[el.error.code] ?? "unknown"}`, true);

    // Is anything reaching the output? Only meaningful where Web Audio works.
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) {
        const c = new Ctor();
        add("AudioContext state", c.state + " (a new one is always suspended — not a fault)");
        void c.close();
      } else {
        add("AudioContext", "unavailable");
      }
    } catch (e) {
      add("AudioContext", "FAILED: " + String(e), true);
    }

    el.pause();
    setLines(out);
    setRunning(false);
  };

  return (
    <main className="mx-auto max-w-[26rem] px-5 pt-10 pb-20">
      <p className="eyebrow text-center text-muted-foreground">Audio check</p>
      <p className="mx-auto mt-4 max-w-[20rem] text-center font-body text-[0.8rem] leading-relaxed text-muted-foreground">
        Tap the button. It tries to play the invitation's track and reports what
        the browser does. Send me a screenshot of the result.
      </p>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onPointerDown={run}
          onClick={(e) => {
            if (e.detail === 0) run();
          }}
          className="rounded-full bg-bronze px-8 py-4 font-body text-[0.68rem] font-medium tracking-[0.24em] uppercase text-primary-foreground"
          style={{ touchAction: "manipulation" }}
        >
          {running ? "Testing…" : "Run the test"}
        </button>
      </div>

      {lines.length > 0 && (
        <div
          className="mt-8 rounded-2xl px-4 py-4"
          style={{ background: "color-mix(in srgb, white 72%, transparent)" }}
        >
          {lines.map((l) => (
            <div
              key={l.k}
              className="flex flex-col gap-0.5 border-b border-[color-mix(in_oklab,var(--gold)_25%,transparent)] py-2 last:border-0"
            >
              <span className="font-body text-[0.55rem] font-medium tracking-[0.18em] uppercase text-muted-foreground">
                {l.k}
              </span>
              <span
                className="font-body text-[0.8rem] break-words"
                style={{ color: l.bad ? "oklch(0.5 0.19 27)" : "var(--foreground)" }}
              >
                {l.v}
              </span>
            </div>
          ))}
          <p className="mt-3 font-body text-[0.68rem] text-muted-foreground">
            The lines that matter most are <strong>play()</strong> and{" "}
            <strong>currentTime</strong>. If play() resolved and currentTime is
            still 0.00s, the browser accepted it but is not actually playing.
          </p>
        </div>
      )}
    </main>
  );
}
