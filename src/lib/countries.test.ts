import { countries } from "@/data/countries";
import { getFamily } from "@/data/products";
import {
  conformityInSentence,
  countryDescription,
  countryFaq,
  countrySlug,
  familyLineFor,
  getCountryBySlug,
} from "@/lib/countries";

const byCode = (code: string) => countries.find((c) => c.code === code)!;

test("country slugs are readable", () => {
  expect(countrySlug(byCode("SA"))).toBe("saudi-arabia");
  expect(countrySlug(byCode("AE"))).toBe("united-arab-emirates");
  expect(countrySlug(byCode("US"))).toBe("united-states");
});

test("country slugs are unique", () => {
  const slugs = countries.map(countrySlug);
  expect(new Set(slugs).size).toBe(slugs.length);
});

test("looks a country up by slug", () => {
  expect(getCountryBySlug("nigeria")?.code).toBe("NG");
  expect(getCountryBySlug("atlantis")).toBeUndefined();
});

test("Saudi FAQ names the certificate and says GoodBiz arranges it", () => {
  const faq = countryFaq(byCode("SA"));
  expect(faq).toHaveLength(4);
  expect(faq.some((f) => f.a.includes("SASO / SABER certificate") && /arrange/i.test(f.a))).toBe(true);
});

test("no country FAQ claims manufacturing", () => {
  for (const c of countries) {
    for (const f of countryFaq(c)) expect(f.a).not.toMatch(/we manufacture|our factory|we build/i);
  }
});

test("every country description is 120 to 160 characters", () => {
  for (const c of countries) {
    const d = countryDescription(c);
    expect(d.length, `${c.name}: ${d}`).toBeGreaterThanOrEqual(120);
    expect(d.length, `${c.name}: ${d}`).toBeLessThanOrEqual(160);
  }
});

test("family line carries the country's grid", () => {
  const line = familyLineFor(byCode("NG"), getFamily("transformers")!);
  expect(line).toContain("50 Hz");
  expect(line).toContain("11 kV · 33 kV");
});

test("LV families use the low-voltage figure", () => {
  expect(familyLineFor(byCode("US"), getFamily("lt-panels")!)).toContain("480/277 V");
});

test("certificate reads naturally mid-sentence without lowercasing acronyms", () => {
  expect(conformityInSentence(byCode("AE"))).toBe("utility approval list, ECAS where listed");
  expect(conformityInSentence(byCode("SA"))).toBe("SASO / SABER certificate");
  expect(conformityInSentence(byCode("KE"))).toBe("PVoC certificate of conformity");
  expect(countryDescription(byCode("AE"))).toContain("with the utility approval list");
});

test("no country description is cut mid-sentence", () => {
  for (const c of countries) expect(countryDescription(c)).toMatch(/(arranged by GoodBiz|by sea or air)\.$/);
});
