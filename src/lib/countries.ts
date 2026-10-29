import { countries, type Country } from "@/data/countries";
import type { Family } from "@/data/products";
import { trimDescription } from "@/lib/meta";
import type { Faq } from "@/lib/posts";

// Copy for the country export pages, generated from the grid data in
// src/data/countries.ts so each page states facts for that country only.

export const MV_FAMILIES = new Set(["mv-switchgear-rmu", "transformers"]);

export function countrySlug(c: Country): string {
  return c.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => countrySlug(c) === slug);
}

// Countries that do not build to IEC name their own standard per family; everywhere
// else each family is quoted against its own IEC standard (60076 for transformers…).
const NATIONAL_STANDARDS: Record<string, Record<string, string>> = {
  US: {
    "lt-panels": "UL 891 / UL 508A",
    "mv-switchgear-rmu": "IEEE C37.20",
    transformers: "IEEE C57.12",
    "breakers-contactors": "UL 489 / UL 60947-4-1",
    "enclosures-junction-boxes": "UL 50E / NEMA 250",
    parts: "UL-recognised components",
  },
  GB: {
    "lt-panels": "BS EN 61439",
    "mv-switchgear-rmu": "BS EN 62271",
    transformers: "BS EN 60076",
    "breakers-contactors": "BS EN 60947",
    "enclosures-junction-boxes": "BS EN 62208",
    parts: "BS EN 61439",
  },
  AU: {
    "lt-panels": "AS/NZS 61439",
    "mv-switchgear-rmu": "AS 62271",
    transformers: "AS 60076",
    "breakers-contactors": "AS/NZS IEC 60947",
    "enclosures-junction-boxes": "AS 60529 (IP rating)",
    parts: "AS/NZS 61439",
  },
};

export function standardFor(c: Country, fam: Family): string {
  return NATIONAL_STANDARDS[c.code]?.[fam.slug] ?? fam.standards[0];
}

export function familyLineFor(c: Country, fam: Family): string {
  const grid = MV_FAMILIES.has(fam.slug) ? `${c.mv} and ${c.lv}` : c.lv;
  return `${fam.name} for ${c.name}: ${grid}, ${c.hz} Hz, to ${standardFor(c, fam)}.`;
}

// SASO, SONCAP and PVoC certificates are issued per shipment, so they can be arranged
// with the order. UL listings, UKCA marks and utility approvals belong to the
// manufacturer or the product: we source equipment that already carries them.
const SHIPMENT_CERTIFICATES = new Set(["SA", "NG", "KE", "TZ"]);

export function certificatePerShipment(c: Country): boolean {
  return SHIPMENT_CERTIFICATES.has(c.code);
}

// "Utility approval list" reads as "the utility approval list" mid-sentence;
// acronyms such as SASO or PVoC keep their capitals.
export function conformityInSentence(c: Country): string {
  return /^[A-Z][a-z]/.test(c.conformity) ? c.conformity[0].toLowerCase() + c.conformity.slice(1) : c.conformity;
}

export function countryDescription(c: Country): string {
  const grid = `${c.lv}, ${c.hz} Hz`;
  const tail = certificatePerShipment(c)
    ? `with the ${conformityInSentence(c)} arranged by GoodBiz Power Systems.`
    : `with equipment sourced to meet the ${conformityInSentence(c)}.`;
  // Shed detail in order (standards list, then product names) before cutting a sentence in half.
  const options = [
    `Electrical panels, transformers, RMUs and switchgear for ${c.name}: ${grid}, ${c.standard}, ${tail}`,
    `Electrical panels, transformers, RMUs and switchgear for ${c.name}: ${grid}, ${tail}`,
    `Electrical equipment for ${c.name}: ${grid}, ${tail}`,
  ];
  let text = options.find((o) => o.length <= 160) ?? options[options.length - 1];
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
      a: `${c.standard}. GoodBiz Power Systems sources panels, switchgear and transformers to these standards from partner manufacturers.`,
    },
    {
      q: `Which certificate do I need to import electrical equipment into ${c.name}?`,
      a: certificatePerShipment(c)
        ? `${c.conformity}. GoodBiz Power Systems arranges it with the shipment, so it travels with the equipment.`
        : `${c.conformity}. It is held by the manufacturer or the product, so GoodBiz Power Systems sources equipment that already carries it and sends the supporting documents with the order.`,
    },
    {
      q: `What design ambient temperature should I specify for ${c.name}?`,
      a: `${c.ambient} °C is typical for ${c.name}. Equipment is rated or cooled for it, and nameplates are supplied in ${c.plate}.`,
    },
  ];
}
