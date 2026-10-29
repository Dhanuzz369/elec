import { countries } from "@/data/countries";
import { TRACK_RECORD } from "@/data/projects";
import { site } from "@/data/site";
import type { Faq } from "@/lib/posts";

// The questions buyers ask first, shown on the home page and served to AI engines
// (FAQPage markup and /ai/faq.json). Every answer restates something already on the site.
export const SITE_FAQ: Faq[] = [
  {
    q: "What does GoodBiz Power Systems supply?",
    a: "LT panels (PCC, MCC, APFC, ATS and PLC panels), MV switchgear and RMUs, oil-filled and dry-type transformers, breakers and contactors, enclosures and junction boxes, and busbars and panel parts, sourced from partner manufacturers in India.",
  },
  {
    q: "Does GoodBiz Power Systems manufacture the equipment?",
    a: "No. GoodBiz Power Systems sources from partner manufacturers in India and recommends the make and build that suit each project. Every order is tested before it ships.",
  },
  {
    q: "What experience is behind GoodBiz Power Systems?",
    a: `${TRACK_RECORD.charAt(0).toUpperCase()}${TRACK_RECORD.slice(1)}.`,
  },
  {
    q: "Which countries does GoodBiz Power Systems ship to?",
    a: `${countries.map((c) => c.name).join(", ")}, by sea or air, with each order matched to the destination's voltage, frequency, standards and import certificate.`,
  },
  {
    q: "How do I get a quote?",
    a: `Use the quote form at ${site.url}/quote, or send the product, ratings, quantity and destination to ${site.email} or on WhatsApp at ${site.phone}.`,
  },
];
