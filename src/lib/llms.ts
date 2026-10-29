import { countries } from "@/data/countries";
import { countryNotes } from "@/data/country-notes";
import { families } from "@/data/products";
import { TRACK_RECORD, projectTypes } from "@/data/projects";
import { absoluteUrl, site, publishable } from "@/data/site";
import { certificatePerShipment, countrySlug } from "@/lib/countries";
import { postUrl } from "@/lib/feed";
import type { Post } from "@/lib/posts";

// llms.txt (llmstxt.org): a plain summary AI assistants can read and quote.
// Built from the same data as the pages so the two never disagree.

const REGIONS = ["Gulf", "Africa", "Asia", "Oceania", "Europe", "Americas"];

export function buildLlmsTxt(posts: Post[]): string {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} quotes each order to the destination country's voltage, frequency, standards and certificate, arranges that certificate with the shipment, and lists the Indian 8-digit HSN code for every line item. Enquiries: ${publishable(site.email) ?? absoluteUrl("/quote")}.`,
    "",
    "## About",
    "",
    `- [About ${site.name}](${absoluteUrl("/about")}): 25+ years in power distribution with its group companies, on KPTCL projects and as a licensed EPC contractor for BESCOM and other public discoms; recommends the right products for apartments, commercial buildings, IT parks and industries, and supplies all of it in one order`,
    "",
    "## Products",
    "",
    ...families.map((f) => `- [${f.name}](${absoluteUrl(`/products/${f.slug}`)}): ${f.short}`),
    `- [HSN code finder](${absoluteUrl("/hsn-code-finder")}): Indian 8-digit HSN codes for electrical equipment`,
    "",
    "## Countries",
    "",
    ...countries.map(
      (c) => `- [${c.name}](${absoluteUrl(`/export/${countrySlug(c)}`)}): ${c.lv}, ${c.hz} Hz, ${c.conformity}`,
    ),
    "",
    ...(posts.length
      ? ["## Guides", "", ...posts.slice(0, 20).map((p) => `- [${p.title}](${postUrl(p)}): ${p.description}`), ""]
      : []),
    "## Request a quote",
    "",
    `- [Get a quote](${absoluteUrl("/quote")}): a one-minute form for any product above; GoodBiz Power Systems replies within one working day`,
    "",
    "## Optional",
    "",
    `- [Full product, HSN and country data](${absoluteUrl("/llms-full.txt")})`,
    `- [Configure a requirement](${absoluteUrl("/configurator")})`,
    "",
  ];
  return lines.join("\n");
}

export function buildLlmsFullTxt(): string {
  const out = [`# ${site.name}: full product, HSN and country data`, "", `> ${site.description}`, ""];
  out.push("## About", "", `${site.name} has ${TRACK_RECORD}. It recommends the right products and brands for each kind of project and supplies all of it in one order, tested before shipping. More: ${absoluteUrl("/about")}`, "");
  for (const p of projectTypes) {
    out.push(`### ${p.name}`, "", p.summary, "", `Typically needs: ${p.needs.map((n) => n.name).join(", ")}.`, `What to watch for: ${p.watch.join("; ")}.`, "");
  }
  for (const f of families) {
    out.push(`## ${f.name}`, "", f.summary, "", "| Product | Typical rating | HSN (India) |", "| --- | --- | --- |");
    for (const v of f.variants) out.push(`| ${v.name} (${v.note}) | ${v.rating} | ${v.hsn} |`);
    out.push("", `Standards: ${f.standards.join(", ")}.`, `Options: ${f.options.join(", ")}.`, "");
    for (const q of f.faq) out.push(`Q: ${q.q}`, `A: ${q.a}`, "");
  }
  out.push("## Countries", "");
  for (const region of REGIONS) {
    out.push(`### ${region}`, "");
    for (const c of countries.filter((x) => x.region === region)) {
      out.push(
        `- ${c.name}: LV ${c.lv}; MV ${c.mv}; ${c.hz} Hz; standards ${c.standard}; certificate ${c.conformity} (${certificatePerShipment(c) ? `arranged by ${site.name} per shipment` : "held by the manufacturer"}); design ambient ${c.ambient} °C; nameplates in ${c.plate}. ${Object.values(countryNotes[c.code]).join(" ")}`,
      );
    }
    out.push("");
  }
  out.push("Values are typical for each country; the project specification always takes priority.", "");
  return out.join("\n");
}
