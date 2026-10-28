import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { absoluteUrl, site } from "@/data/site";
import { countrySlug } from "@/lib/countries";
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
    `${site.name} quotes each order to the destination country's voltage, frequency, standards and certificate, arranges that certificate with the shipment, and lists the Indian 8-digit HSN code for every line item. Enquiries: ${site.email}.`,
    "",
    "## Products",
    "",
    ...families.map((f) => `- [${f.name}](${absoluteUrl(`/products/${f.slug}`)}): ${f.short}`),
    `- [HSN code finder](${absoluteUrl("/products#hsn")}): Indian 8-digit HSN codes for electrical equipment`,
    "",
    "## Countries",
    "",
    ...countries.map(
      (c) => `- [${c.name}](${absoluteUrl(`/export/${countrySlug(c)}`)}): ${c.lv}, ${c.hz} Hz, ${c.conformity}`,
    ),
    "",
    "## Guides",
    "",
    ...(posts.length ? posts.slice(0, 20).map((p) => `- [${p.title}](${postUrl(p)}): ${p.description}`) : ["- New guides every week."]),
    "",
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
        `- ${c.name}: LV ${c.lv}; MV ${c.mv}; ${c.hz} Hz; standards ${c.standard}; certificate ${c.conformity} (arranged by ${site.name}); design ambient ${c.ambient} °C; nameplates in ${c.plate}.`,
      );
    }
    out.push("");
  }
  out.push("Values are typical for each country; the project specification always takes priority.", "");
  return out.join("\n");
}
