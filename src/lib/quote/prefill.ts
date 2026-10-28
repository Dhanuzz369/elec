import { families } from "@/data/products";
import { ANY, slugify, varietyChoices } from "@/lib/quote/options";
import type { Prefill } from "@/lib/quote/steps";

const MAX = 80;

// Links from product pages (?product=<slug>&variety=<variant slug>) skip those
// steps. Each value is checked only against its own option group; anything
// unknown is dropped and the step shows as normal.
export function parsePrefill(params: URLSearchParams): Prefill {
  const raw = (key: string) => {
    const v = params.get(key)?.trim() ?? "";
    return v && v.length <= MAX ? v : "";
  };
  const product = raw("product");
  if (!families.some((f) => f.slug === product)) return {};
  const variety = slugify(raw("variety"));
  const ok = variety && variety !== ANY && varietyChoices(product).some((c) => c.id === variety);
  return ok ? { product, variety } : { product };
}
