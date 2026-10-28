import { QUANTITY_CHOICES, TERMS_CHOICES, productChoices, slugify, varietyChoices } from "@/lib/quote/options";
import { getStrings } from "@/lib/quote/strings";

test("product choices are the six families then Something else", () => {
  const choices = productChoices();
  expect(choices).toHaveLength(7);
  expect(choices.at(-1)?.id).toBe("other");
  // Breakers & contactors has no photograph yet; its card shows a drawn symbol instead.
  for (const c of choices.slice(0, 6)) if (c.id !== "breakers-contactors") expect(c.image).toMatch(/^\/images\//);
});

test("variety choices come from the family, then Any", () => {
  const ids = varietyChoices("lt-panels").map((c) => c.id);
  expect(ids).toContain("motor-control-centre-mcc");
  expect(ids.at(-1)).toBe("any");
  expect(varietyChoices("nope")).toEqual([]);
});

test("quantity and terms ids", () => {
  expect(QUANTITY_CHOICES.map((c) => c.id)).toEqual(["sample", "2-5", "6-20", "project", "other"]);
  expect(TERMS_CHOICES.map((c) => c.id)).toEqual(["fob", "cif", "dap", "unsure"]);
  for (const t of TERMS_CHOICES) expect(t.hint?.length).toBeGreaterThan(0);
});

test("slugify", () => {
  expect(slugify("  Motor control centre (MCC) ")).toBe("motor-control-centre-mcc");
});

test("unknown languages fall back to English", () => {
  expect(getStrings("ar")).toEqual(getStrings("en"));
});

function allStrings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (v && typeof v === "object") return Object.values(v).flatMap(allStrings);
  return [];
}

test("form copy never claims manufacturing", () => {
  for (const s of allStrings(getStrings("en"))) expect(s).not.toMatch(/we manufacture|our factory|we build/i);
});
