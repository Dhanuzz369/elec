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

test("Saudi FAQ names the certificate and says GoodBiz Power Systems arranges it", () => {
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
  expect(countryDescription(byCode("AE"))).toContain("sourced to meet the utility approval list");
  expect(countryDescription(byCode("SA"))).toContain("with the SASO / SABER certificate arranged");
});

test("no country description is cut mid-sentence", () => {
  for (const c of countries) {
    const d = countryDescription(c);
    expect(d).toMatch(/\.$/);
    expect(d).toMatch(/arranged by GoodBiz Power Systems\.|sourced to meet the|by sea or air\./);
  }
});

test("each family line cites that family's own IEC standard in IEC countries", () => {
  const expected: Record<string, RegExp> = {
    "lt-panels": /IEC 61439/,
    "mv-switchgear-rmu": /IEC 62271/,
    transformers: /IEC 60076/,
    "breakers-contactors": /IEC 60947/,
    "enclosures-junction-boxes": /IEC 62208/,
  };
  for (const c of countries.filter((x) => !["US", "GB", "AU"].includes(x.code))) {
    for (const [slug, re] of Object.entries(expected)) {
      const line = familyLineFor(c, getFamily(slug)!);
      expect(line, line).toMatch(re);
    }
    expect(familyLineFor(c, getFamily("transformers")!)).not.toMatch(/61439|62271/);
    expect(familyLineFor(c, getFamily("breakers-contactors")!)).not.toMatch(/61439|62271/);
  }
});

test("supply lines use the destination's own standards", () => {
  const tx = getFamily("transformers")!;
  const lt = getFamily("lt-panels")!;
  expect(familyLineFor(byCode("US"), tx)).toContain("IEEE C57.12");
  expect(familyLineFor(byCode("US"), lt)).toContain("UL 891");
  expect(familyLineFor(byCode("US"), lt)).not.toMatch(/IEC/);
  expect(familyLineFor(byCode("GB"), tx)).toContain("BS EN 60076");
  expect(familyLineFor(byCode("AU"), lt)).toContain("AS/NZS 61439");
  expect(familyLineFor(byCode("SA"), tx)).toContain("IEC 60076");
});

// UL listings, UKCA marks and utility approvals belong to the manufacturer or the
// product; only shipment certificates (SASO, SONCAP, PVoC) are arranged per order.
test("only shipment certificates are said to be arranged", () => {
  for (const code of ["US", "GB", "AE", "QA"]) {
    const c = byCode(code);
    const text = [countryDescription(c), ...countryFaq(c).map((f) => f.a)].join(" ");
    expect(text).not.toMatch(/arrange/i);
  }
  for (const code of ["SA", "NG", "KE", "TZ"]) {
    const c = byCode(code);
    expect(countryFaq(c).some((f) => /arranges it with the shipment/.test(f.a))).toBe(true);
  }
});
