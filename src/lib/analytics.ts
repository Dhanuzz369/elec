// Google Analytics 4 with Consent Mode v2.
// - Analytics cookies are on by default, except in the EEA, the UK and Switzerland,
//   where they wait for the visitor's choice (Google applies the region by IP).
// - Advertising storage is always denied: the site runs no ads.
// - No personal data ever reaches Google: event parameters pass a whitelist and any
//   value that looks like an email or phone number is dropped.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "G-SZNDGG2SJC";

export const CONSENT_KEY = "goodbiz-analytics-consent";

// EEA (EU + Iceland, Liechtenstein, Norway), the UK and Switzerland.
export const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

// Runs inline in <head>, before gtag.js, so consent defaults are set before any hit.
export function consentScript(id = GA_ID): string {
  const regions = CONSENT_REGIONS.map((r) => `'${r}'`).join(",");
  return [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}",
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});",
    `gtag('consent','default',{analytics_storage:'denied',region:[${regions}]});`,
    `try{var c=localStorage.getItem('${CONSENT_KEY}');if(c)gtag('consent','update',{analytics_storage:c==='granted'?'granted':'denied'});}catch(e){}`,
    "gtag('js',new Date());",
    `gtag('config','${id}');`,
  ].join("");
}

// The banner is only offered where consent is required. The visitor's time zone is
// a good, private stand-in for their location; Google's own region check above is
// what actually decides whether cookies are set.
const CONSENT_TIME_ZONES = /^(Europe\/|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$)/;

export function needsConsentPrompt(timeZone: string, stored: string | null): boolean {
  return stored === null && CONSENT_TIME_ZONES.test(timeZone);
}

const ALLOWED = new Set([
  "lead_source",
  "product",
  "variety",
  "country",
  "quantity",
  "terms",
  "prefilled",
  "step",
  "step_number",
  "method",
  "link_location",
  "search_term",
  "content_type",
  "content_id",
]);
const EMAIL = /\S+@\S+\.\S+/;
const SEARCH_TERM = /^[\p{L}\p{N} .,/()&+-]{2,40}$/u;

export function cleanParams(params: Record<string, string | number | undefined>): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, raw] of Object.entries(params)) {
    if (!ALLOWED.has(key) || raw === undefined || raw === "") continue;
    if (typeof raw === "number") {
      out[key] = raw;
      continue;
    }
    // Ten or more digits is a phone number, not an 8-digit HSN code.
    if (EMAIL.test(raw) || (raw.match(/\d/g)?.length ?? 0) >= 10) continue;
    // Search terms are kept only when they look like a product word or code.
    if (key === "search_term" && !SEARCH_TERM.test(raw)) continue;
    out[key] = raw.slice(0, 100);
  }
  return out;
}

type Gtag = (...args: unknown[]) => void;

export function track(event: string, params: Record<string, string | number | undefined> = {}) {
  if (!GA_ID || typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", event, cleanParams(params));
}

export function setAnalyticsConsent(granted: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    // Private mode: the choice lasts for this page view only.
  }
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
}
