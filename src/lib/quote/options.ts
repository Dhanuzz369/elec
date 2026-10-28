import { families, getFamily } from "@/data/products";

// The choices offered by the quick quote form. Product and variety come from the
// product data so the form never offers something the site does not list.

export type Choice = { id: string; label: string; hint?: string; image?: string };

export const OTHER = "other";
export const ANY = "any";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productChoices(): Choice[] {
  return [
    ...families.map((f) => ({ id: f.slug, label: f.name, image: f.gallery?.[0]?.src ?? f.image?.src })),
    { id: OTHER, label: "Something else" },
  ];
}

export function varietyChoices(product: string): Choice[] {
  const fam = getFamily(product);
  if (!fam) return [];
  return [...fam.variants.map((v) => ({ id: slugify(v.name), label: v.name })), { id: ANY, label: "Any / not sure" }];
}

export const QUANTITY_CHOICES: Choice[] = [
  { id: "sample", label: "Single unit / sample" },
  { id: "2-5", label: "2–5 units" },
  { id: "6-20", label: "6–20 units" },
  { id: "project", label: "Project or tender quantity" },
  { id: OTHER, label: "Another amount" },
];

export const TERMS_CHOICES: Choice[] = [
  { id: "fob", label: "FOB Indian port", hint: "We load it on the ship; you arrange freight." },
  { id: "cif", label: "CIF your port", hint: "We pay freight and insurance to your port." },
  { id: "dap", label: "DAP your site", hint: "We deliver to your site; you clear customs." },
  { id: "unsure", label: "Not sure", hint: "We'll suggest the best option." },
];
