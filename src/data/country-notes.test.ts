import { countries } from "@/data/countries";
import { countryNotes } from "@/data/country-notes";

test("every country has its own notes", () => {
  for (const c of countries) {
    const n = countryNotes[c.code];
    expect(n, c.name).toBeDefined();
    for (const v of Object.values(n)) expect(v.length).toBeGreaterThan(40);
  }
  const texts = countries.map((c) => Object.values(countryNotes[c.code]).join(" "));
  expect(new Set(texts).size).toBe(countries.length);
});

// Notes must never contradict the grid table on the same page.
const EXTRA: Record<string, string[]> = { US: ["208/120 V"], ID: ["11 kV"] };
test("every figure in the notes matches that country's grid data", () => {
  for (const c of countries) {
    const text = Object.values(countryNotes[c.code]).join(" ");
    const allowed = [c.lv, c.mv, `${c.hz} Hz`, `${c.ambient} °C`, ...(EXTRA[c.code] ?? [])].join(" ");
    for (const m of text.matchAll(/\d{2,3}\/\d{2,3} V|\d+(?:\.\d+)? kV|\d+ Hz|\d+ °C/g)) {
      expect(allowed, `${c.name}: ${m[0]}`).toContain(m[0]);
    }
  }
});
