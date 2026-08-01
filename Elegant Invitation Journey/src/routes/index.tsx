import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Envelope } from "@/components/wedding/Envelope";
import { Microsite } from "@/components/wedding/Microsite";

const TITLE = "Lasya & Avyay — October 31 in Hyderabad";
const DESCRIPTION =
  "Open our invitation: ceremony details, program, venue map, dress code, celebrations and RSVP for the wedding of Lasya & Avyay on October 31.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);

  return entered ? <Microsite /> : <Envelope onEnter={() => setEntered(true)} />;
}
