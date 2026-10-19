import hsn from "@/data/hsn.json";

export type HsnEntry = { code: string; description: string; product: string; family: string };

// The rows the HSN finder shows before anyone types. Structured data lists only
// these, so search engines are never told about codes the page does not show.
export const DEFAULT_HSN_COUNT = 12;

export function hsnEntries(): HsnEntry[] {
  return (hsn as HsnEntry[]).filter((e) => e.code.startsWith("85"));
}

export function defaultHsnEntries(): HsnEntry[] {
  return hsnEntries()
    .filter((e) => /^853[678]/.test(e.code) || /^85042/.test(e.code))
    .slice(0, DEFAULT_HSN_COUNT);
}
