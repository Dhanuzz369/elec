import { OTHER } from "@/lib/quote/options";
import type { QuoteStrings } from "@/lib/quote/strings";

export type StepId = "contact" | "product" | "variety" | "quantity" | "destination" | "terms" | "notes";

export const ALL_STEPS: StepId[] = ["contact", "product", "variety", "quantity", "destination", "terms", "notes"];

export type Answers = {
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
  // Honeypot: real visitors never see or tick it.
  website: boolean;
};

export type Prefill = { product?: string; variety?: string };

export function emptyAnswers(): Answers {
  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    product: "",
    productOther: "",
    variety: "",
    quantity: "",
    quantityOther: "",
    country: "",
    port: "",
    terms: "",
    notes: "",
    website: false,
  };
}

export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
}

export function phoneDigits(s: string): number {
  return s.replace(/\D/g, "").length;
}

// Pre-filled steps are skipped, and "Something else" has no variety to pick.
export function visibleSteps(a: Answers, prefill: Prefill): StepId[] {
  return ALL_STEPS.filter((s) => {
    if (s === "product") return !prefill.product;
    if (s === "variety") return !prefill.variety && a.product !== OTHER;
    return true;
  });
}

type StepError = { field: keyof Answers; message: string };

export function validateStep(step: StepId, a: Answers, t: QuoteStrings): StepError | null {
  const blank = (s: string) => !s.trim();
  switch (step) {
    case "contact": {
      if (blank(a.name)) return { field: "name", message: t.errors.name };
      // A half-typed email is flagged even when the phone is fine, so the sheet never holds a broken address.
      if (!blank(a.email) && !isValidEmail(a.email)) return { field: "email", message: t.errors.email };
      if (isValidEmail(a.email) || phoneDigits(a.phone) >= 7) return null;
      return { field: "email", message: t.errors.contact };
    }
    case "product":
      if (blank(a.product)) return { field: "product", message: t.errors.product };
      if (a.product === OTHER && blank(a.productOther)) return { field: "productOther", message: t.errors.productOther };
      return null;
    case "variety":
      return blank(a.variety) ? { field: "variety", message: t.errors.variety } : null;
    case "quantity":
      if (blank(a.quantity)) return { field: "quantity", message: t.errors.quantity };
      if (a.quantity === OTHER && blank(a.quantityOther)) return { field: "quantityOther", message: t.errors.quantityOther };
      return null;
    case "destination":
      return blank(a.country) ? { field: "country", message: t.errors.country } : null;
    case "terms":
      return blank(a.terms) ? { field: "terms", message: t.errors.terms } : null;
    case "notes":
      return null;
  }
}

export function clearDependents(a: Answers, changed: keyof Answers): Answers {
  if (changed === "product") return { ...a, variety: "", productOther: a.product === OTHER ? a.productOther : "" };
  if (changed === "quantity" && a.quantity !== OTHER) return { ...a, quantityOther: "" };
  return a;
}
