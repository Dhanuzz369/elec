// Every business fact the site publishes lives here: canonical URLs, sitemap,
// structured data, footer and enquiry links all read from this one object.
// Fields marked PLACEHOLDER must be filled before launch.

const DOMAIN = "https://www.goodbizpower.com";

// The public address of the site. goodbizpower.com is live, so canonicals,
// the sitemap and structured data always name it; the old vercel.app host
// redirects there (src/lib/hosts.ts). NEXT_PUBLIC_SITE_URL overrides it for
// a staging copy.
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  return explicit ? explicit.replace(/\/+$/, "") : DOMAIN;
}

// Placeholder contact details must never reach search engines as real ones.
export function publishable(value: string | undefined): string | undefined {
  return value && !/\.example$|0000/.test(value) ? value : undefined;
}

export const site = {
  name: "GoodBiz Power Systems",
  // The first word, used where the full name is set in two sizes (header, footer mark).
  shortName: "GoodBiz",
  legalName: "GoodBiz Power Systems", // PLACEHOLDER — required before launch
  url: resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL }),
  email: "power@goodbizglobal.com",
  phone: "+91 88847 99369",
  whatsapp: "918884799369", // digits only, for wa.me links
  address: {
    street: "",
    city: "Bangalore",
    region: "Karnataka",
    postalCode: "",
    country: "IN",
  },
  // Google Apps Script web app that saves leads to the "Power" sheet (docs/lead-sheet-setup.md).
  // Not a secret: visitors' browsers post to it. NEXT_PUBLIC_LEAD_ENDPOINT overrides it (the browser tests use a fake one).
  leadEndpoint:
    process.env.NEXT_PUBLIC_LEAD_ENDPOINT?.trim() ||
    "https://script.google.com/macros/s/AKfycbyQHcpOdgt6dOpQV5ZHilU4XSRudZ9ZA9lr1ldSpRIWcxpSLajfyIDsBjf065w3y3u-qA/exec",
  logo: "/logo.png",
  // Posts go live on their date in this time zone (builds usually run in UTC).
  timeZone: "Asia/Kolkata",
  foundingDate: undefined as string | undefined,
  sameAs: [] as string[], // LinkedIn, IndiaMART and other official profiles when they exist
  description:
    "GoodBiz Power Systems is an Indian exporter and supplier of LT panels, MV switchgear, RMUs, transformers, breakers and enclosures, sourced from partner manufacturers to each destination country's standards.",
  // Search Console and Bing Webmaster Tools tokens, set in Vercel (docs/search-console-setup.md).
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim() || undefined,
};

export function absoluteUrl(path: string): string {
  return `${site.url}/${path.replace(/^\/+/, "")}`;
}

export function mailtoHref(subject?: string, body?: string): string {
  const params = [
    subject !== undefined && `subject=${encodeURIComponent(subject)}`,
    body !== undefined && `body=${encodeURIComponent(body)}`,
  ].filter(Boolean);
  return `mailto:${site.email}${params.length ? `?${params.join("&")}` : ""}`;
}

export function whatsappHref(text?: string): string {
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
