import { getFamily } from "@/data/products";
import { mailtoHref, whatsappHref } from "@/data/site";
import { OTHER, QUANTITY_CHOICES, TERMS_CHOICES, productChoices, varietyChoices } from "@/lib/quote/options";
import type { Answers, Prefill, StepId } from "@/lib/quote/steps";
import { fill, getStrings } from "@/lib/quote/strings";

export type Stage = StepId | "submitted";

export type LeadPayload = {
  leadId: string;
  stage: Stage;
  source: "quick" | "configurator";
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  productOther: string;
  variety: string;
  quantity: string;
  quantityOther: string;
  country: string;
  port: string;
  terms: string;
  notes: string;
  details: string;
  page: string;
  prefilled: "yes" | "no";
  lang: string;
  userAgent: string;
};

type Context = { leadId: string; stage: Stage; prefill: Prefill; page: string; lang: string; userAgent: string };

const labelOf = (choices: { id: string; label: string }[], id: string) => choices.find((c) => c.id === id)?.label ?? "";

// The sheet stores what the visitor saw (labels), so it reads without a lookup table.
export function buildPayload(a: Answers, ctx: Context): LeadPayload {
  const t = getStrings(ctx.lang);
  const product = a.product === OTHER ? t.choices.other : (getFamily(a.product)?.name ?? labelOf(productChoices(), a.product));
  return {
    leadId: ctx.leadId,
    stage: ctx.stage,
    source: "quick",
    name: a.name.trim(),
    company: a.company.trim(),
    email: a.email.trim(),
    phone: a.phone.trim(),
    product,
    productOther: a.product === OTHER ? a.productOther.trim() : "",
    variety: labelOf(varietyChoices(a.product), a.variety),
    quantity: labelOf(QUANTITY_CHOICES, a.quantity),
    quantityOther: a.quantity === OTHER ? a.quantityOther.trim() : "",
    country: a.country.trim(),
    port: a.port.trim(),
    terms: labelOf(TERMS_CHOICES, a.terms),
    notes: a.notes.trim(),
    details: "",
    page: ctx.page,
    prefilled: ctx.prefill.product ? "yes" : "no",
    lang: ctx.lang,
    userAgent: ctx.userAgent,
  };
}

export function requestSummary(p: LeadPayload): string {
  const s = getStrings(p.lang).summary;
  const rows: [string, string][] = [
    [s.name, p.name],
    [s.company, p.company],
    [s.email, p.email],
    [s.phone, p.phone],
    [s.product, p.productOther ? `${p.product}: ${p.productOther}` : p.product],
    [s.variety, p.variety],
    [s.quantity, p.quantityOther ? `${p.quantity}: ${p.quantityOther}` : p.quantity],
    [s.country, p.country],
    [s.port, p.port],
    [s.terms, p.terms],
    [s.notes, p.notes],
  ];
  const lines = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  return p.details ? [...lines, "", p.details].join("\n") : lines.join("\n");
}

export function fallbackLinks(p: LeadPayload): { whatsapp: string; email: string } {
  const t = getStrings(p.lang);
  const body = requestSummary(p);
  const subject = fill(t.emailSubject, { product: p.productOther || p.product, country: p.country });
  return { whatsapp: whatsappHref(body), email: mailtoHref(subject, body) };
}
