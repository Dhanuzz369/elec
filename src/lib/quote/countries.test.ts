import { countryNames, suggestCountries } from "@/lib/quote/countries";

const names = countryNames("en");

test("export markets come first, then everyone else", () => {
  expect(names[0]).toBe("Saudi Arabia");
  expect(names).toContain("Germany");
  expect(names.length).toBeGreaterThan(200);
  expect(new Set(names).size).toBe(names.length);
});

test("suggestions prefer names that start with the query", () => {
  expect(suggestCountries("sau", names)[0]).toBe("Saudi Arabia");
  expect(suggestCountries("africa", names)).toContain("South Africa");
  expect(suggestCountries("", names)).toEqual([]);
  expect(suggestCountries("  ", names)).toEqual([]);
  expect(suggestCountries("a", names)).toHaveLength(6);
});

test("accents and case are ignored", () => {
  expect(suggestCountries("cote", names).some((n) => n.startsWith("C"))).toBe(true);
  expect(suggestCountries("CÔTE", names)).toEqual(suggestCountries("cote", names));
});

test("other languages get their own names", () => {
  expect(countryNames("fr")).toContain("Allemagne");
});
