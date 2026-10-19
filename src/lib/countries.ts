import { countries, type Country } from "@/data/countries";
import type { Family } from "@/data/products";
import { trimDescription } from "@/lib/meta";
import type { Faq } from "@/lib/posts";

// Copy for the country export pages, generated from the grid data in
// src/data/countries.ts so each page states facts for that country only.

export const MV_FAMILIES = new Set(["mv-switchgear-rmu", "transformers", "substations", "switchyard-cables-ups"]);

export function countrySlug(c: Country): string {
  return c.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => countrySlug(c) === slug);
}

export function familyLineFor(c: Country, fam: Family): string {
  const grid = MV_FAMILIES.has(fam.slug) ? `${c.mv} and ${c.lv}` : c.lv;
  return `${fam.name} for ${c.name}: ${grid}, ${c.hz} Hz, to ${c.standard}.`;
}

// "Utility approval list" reads as "the utility approval list" mid-sentence;
// acronyms such as SASO or PVoC keep their capitals.
export function conformityInSentence(c: Country): string {
  return /^[A-Z][a-z]/.test(c.conformity) ? c.conformity[0].toLowerCase() + c.conformity.slice(1) : c.conformity;
}

export function countryDescription(c: Country): string {
  const lead = `Electrical panels, transformers, RMUs and switchgear for ${c.name}: ${c.lv}, ${c.hz} Hz`;
  const tail = `with the ${conformityInSentence(c)} arranged by GoodBiz.`;
  // Drop the standards list before cutting a sentence in half.
  let text = `${lead}, ${c.standard}, ${tail}`;
  if (text.length > 160) text = `${lead}, ${tail}`;
  if (text.length < 120) text = `${text} Sourced in India and shipped by sea or air.`;
  return trimDescription(text);
}

export function countryFaq(c: Country): Faq[] {
  return [
    {
      q: `What voltage and frequency does electrical equipment for ${c.name} use?`,
      a: `Typically ${c.lv} at ${c.hz} Hz on the low-voltage side, with medium-voltage networks at ${c.mv}. Your project specification always takes priority.`,
    },
    {
      q: `Which standards apply to electrical panels and switchgear for ${c.name}?`,
      a: `${c.standard}. GoodBiz sources panels, switchgear and transformers to these standards from partner manufacturers.`,
    },
    {
      q: `Which certificate do I need to import electrical equipment into ${c.name}?`,
      a: `${c.conformity}. GoodBiz arranges it with the shipment, so it travels with the equipment.`,
    },
    {
      q: `What design ambient temperature should I specify for ${c.name}?`,
      a: `${c.ambient} °C is typical for ${c.name}. Equipment is rated or cooled for it, and nameplates are supplied in ${c.plate}.`,
    },
  ];
}
