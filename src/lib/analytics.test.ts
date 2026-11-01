import { CONSENT_REGIONS, GA_ID, cleanParams, consentScript, needsConsentPrompt } from "@/lib/analytics";

test("the measurement id is the site's GA4 property", () => {
  expect(GA_ID).toBe("G-SZNDGG2SJC");
});

// GA4 terms forbid personal data: names, emails and phone numbers never leave the site.
test("event parameters drop personal data and unknown fields", () => {
  const out = cleanParams({
    lead_source: "quick_quote",
    country: "Kenya",
    email: "amina@example.com",
    name: "Amina",
    phone: "+254 700 000 000",
    search_term: "call me on +91 88847 99369",
    notes: "anything",
  });
  expect(out).toEqual({ lead_source: "quick_quote", country: "Kenya" });
});

test("long values are cut and contact details inside values are refused", () => {
  expect(cleanParams({ search_term: "x".repeat(300) }).search_term).toHaveLength(100);
  expect(cleanParams({ search_term: "mail power@goodbizglobal.com" })).toEqual({});
});

test("analytics cookies wait for consent in the EEA, UK and Switzerland", () => {
  for (const code of ["DE", "FR", "IT", "GB", "CH", "NO", "IE"]) expect(CONSENT_REGIONS).toContain(code);
  for (const code of ["IN", "SA", "AE", "NG", "KE", "US", "AU"]) expect(CONSENT_REGIONS).not.toContain(code);
  const js = consentScript();
  expect(js).toContain("'consent','default'");
  expect(js).toContain("ad_storage:'denied'");
  expect(js).toMatch(/analytics_storage:'denied',region:\[/);
  expect(js).toContain(`'config','${GA_ID}'`);
});

test("the consent prompt shows only for European time zones without a stored choice", () => {
  expect(needsConsentPrompt("Europe/London", null)).toBe(true);
  expect(needsConsentPrompt("Europe/Berlin", null)).toBe(true);
  expect(needsConsentPrompt("Europe/Berlin", "granted")).toBe(false);
  expect(needsConsentPrompt("Asia/Kolkata", null)).toBe(false);
  expect(needsConsentPrompt("Africa/Lagos", null)).toBe(false);
  expect(needsConsentPrompt("America/New_York", null)).toBe(false);
});
