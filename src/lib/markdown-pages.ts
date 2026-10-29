import { ABOUT_RANGE, ABOUT_STEPS } from "@/data/about";
import { countries, type Country } from "@/data/countries";
import { countryNotes } from "@/data/country-notes";
import { HSN_FAQ } from "@/data/hsn-faq";
import { families, type Family } from "@/data/products";
import { TRACK_RECORD, aboutFaq, projectTypes } from "@/data/projects";
import { SITE_FAQ } from "@/data/site-faq";
import { absoluteUrl, publishable, site } from "@/data/site";
import { certificatePerShipment, countryFaq, countrySlug, familyLineFor } from "@/lib/countries";
import { defaultHsnEntries } from "@/lib/hsn";
import type { Faq } from "@/lib/posts";

// Markdown versions of the pages for AI agents that ask for text/markdown (see
// src/middleware.ts). Built from the same data as the pages, so they never disagree.

const faqBlock = (faq: Faq[], title = "Questions") => [`## ${title}`, "", ...faq.flatMap((f) => [`### ${f.q}`, "", f.a, ""])];

const contactBlock = () => [
  "## Contact",
  "",
  `- Quote form: ${absoluteUrl("/quote")}`,
  ...(publishable(site.email) ? [`- Email: ${site.email}`] : []),
  ...(publishable(site.phone) ? [`- WhatsApp: ${site.phone}`] : []),
  "- Bangalore, Karnataka, India · shipping worldwide by sea and air",
  "",
];

function home(): string[] {
  return [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} has ${TRACK_RECORD}. It does not manufacture: it sources from partner manufacturers in India and recommends the make and build that suit each project.`,
    "",
    "## Products",
    "",
    ...families.map((f) => `- [${f.name}](${absoluteUrl(`/products/${f.slug}`)}): ${f.short}`),
    "",
    ...faqBlock(SITE_FAQ, "Questions buyers ask first"),
    ...contactBlock(),
  ];
}

function about(): string[] {
  return [
    `# About ${site.name}`,
    "",
    `${site.name} has ${TRACK_RECORD}. That work taught us which panel, which switchgear and which brand holds up on a real site, inspected to a utility's standard.`,
    "",
    "## Right product for your project",
    "",
    ...projectTypes.flatMap((p) => [
      `### ${p.name}`,
      "",
      p.summary,
      "",
      `Typically needs: ${p.needs.map((n) => n.name).join(", ")}.`,
      "",
      `What we watch for: ${p.watch.join("; ")}.`,
      "",
    ]),
    "## One stop",
    "",
    ...ABOUT_RANGE.map(([name, slug]) => `- [${name}](${absoluteUrl(`/products/${slug}`)})`),
    "",
    "We don't manufacture, and that's deliberate: we are not tied to one factory, so we recommend the brand and build that suit your project.",
    "",
    "## How we work",
    "",
    ...ABOUT_STEPS.map(([title, text], i) => `${i + 1}. **${title}**: ${text}`),
    "",
    ...faqBlock(aboutFaq(), "Questions buyers ask about us"),
    ...contactBlock(),
  ];
}

function products(): string[] {
  return [
    "# Products and HSN codes",
    "",
    ...families.flatMap((f) => [`## [${f.name}](${absoluteUrl(`/products/${f.slug}`)})`, "", f.summary, ""]),
    `Search every tariff line in the [HSN code finder](${absoluteUrl("/hsn-code-finder")}).`,
    "",
  ];
}

function family(f: Family): string[] {
  return [
    `# ${f.name}: product lines and HSN codes`,
    "",
    f.summary,
    "",
    "| Product | Notes | Typical rating | HSN (India) |",
    "| --- | --- | --- | --- |",
    ...f.variants.map((v) => `| ${v.name} | ${v.note} | ${v.rating} | ${v.hsn} |`),
    "",
    `Standards: ${f.standards.join(", ")}.`,
    "",
    `Built for: ${f.builtFor.join(", ")}.`,
    "",
    `Options: ${f.options.join(", ")}.`,
    "",
    ...faqBlock(f.faq),
    ...contactBlock(),
  ];
}

function countryIndex(): string[] {
  return [
    "# Countries we ship to",
    "",
    ...countries.map((c) => `- [${c.name}](${absoluteUrl(`/export/${countrySlug(c)}`)}): ${c.lv}, ${c.hz} Hz, ${c.conformity}`),
    "",
  ];
}

function country(c: Country): string[] {
  const n = countryNotes[c.code];
  return [
    `# Electrical panels and transformers for ${c.name}`,
    "",
    "## The grid at a glance",
    "",
    `- Low voltage: ${c.lv}`,
    `- Medium voltage: ${c.mv}`,
    `- Frequency: ${c.hz} Hz`,
    `- Standards: ${c.standard}`,
    `- Certificate: ${c.conformity}, ${certificatePerShipment(c) ? "arranged for each shipment" : "held by the manufacturer"}`,
    `- Design ambient: ${c.ambient} °C`,
    `- Nameplates: ${c.plate}`,
    "",
    `## Supplying ${c.name}`,
    "",
    `- The network: ${n.utilities}`,
    `- Shipping from India: ${n.ports}`,
    `- Import certificate: ${n.certificate}`,
    `- What to specify: ${n.specify}`,
    "",
    "## What we supply",
    "",
    ...families.map((f) => `- ${familyLineFor(c, f)}`),
    "",
    ...faqBlock(countryFaq(c)),
    ...contactBlock(),
  ];
}

function hsnFinder(): string[] {
  return [
    "# HSN code finder for electrical equipment",
    "",
    "Indian 8-digit tariff lines for panels, switchgear, transformers, breakers, enclosures and parts. Your import code shares the first six digits.",
    "",
    "| HSN (India) | Product | Tariff description |",
    "| --- | --- | --- |",
    ...defaultHsnEntries().map((e) => `| ${e.code} | ${e.product} | ${e.description} |`),
    "",
    `Search all lines at ${absoluteUrl("/hsn-code-finder")}.`,
    "",
    ...faqBlock(HSN_FAQ, "HSN questions"),
  ];
}

const simple = (title: string, text: string) => () => [`# ${title}`, "", text, "", ...contactBlock()];

const PAGES: Record<string, () => string[]> = {
  "/": home,
  "/about": about,
  "/products": products,
  "/export": countryIndex,
  "/hsn-code-finder": hsnFinder,
  "/quote": simple(
    "Get a quote",
    "Send the product, ratings, quantity and destination country through the quote form; we reply with a quotation that lists the Indian HSN code for each line.",
  ),
  "/configurator": simple(
    "Configure your requirement",
    "Pick the destination and we fill in its grid, standards and certificate; then set the equipment and ratings and send it for a quotation.",
  ),
  "/privacy": simple(
    "Privacy policy",
    `We use the details sent through the quote form and configurator only to answer the request. Full policy: ${absoluteUrl("/privacy")}.`,
  ),
  ...Object.fromEntries(families.map((f) => [`/products/${f.slug}`, () => family(f)])),
  ...Object.fromEntries(countries.map((c) => [`/export/${countrySlug(c)}`, () => country(c)])),
};

export function markdownPaths(): string[] {
  return Object.keys(PAGES);
}

export function pageMarkdown(path: string): string | null {
  const build = PAGES[path];
  return build ? `${build().join("\n").trim()}\n` : null;
}
