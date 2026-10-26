// Every business fact the site publishes lives here: canonical URLs, sitemap,
// structured data, footer and enquiry links all read from this one object.
// Fields marked PLACEHOLDER must be filled before launch.

const FUTURE_DOMAIN = "https://www.goodbizpower.com";

// The public address of the site, in order of preference:
// 1. NEXT_PUBLIC_SITE_URL, set in Vercel once goodbizpower.com is live;
// 2. Vercel's production host (the vercel.app address until a domain is added);
// 3. the future domain, for local builds.
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = (env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? env.VERCEL_PROJECT_PRODUCTION_URL)?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return FUTURE_DOMAIN;
}

export const site = {
  name: "GoodBiz Power Systems",
  // The first word, used where the full name is set in two sizes (header, footer mark).
  shortName: "GoodBiz",
  legalName: "GoodBiz Power Systems", // PLACEHOLDER — required before launch
  url: resolveSiteUrl({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  }),
  email: "export@goodbiz.example", // PLACEHOLDER — required before launch
  phone: "+91 00000 00000", // PLACEHOLDER — required before launch
  whatsapp: "910000000000", // PLACEHOLDER — required before launch, digits only
  address: {
    street: "", // PLACEHOLDER — required before launch
    city: "", // PLACEHOLDER — required before launch
    region: "", // PLACEHOLDER — required before launch
    postalCode: "", // PLACEHOLDER — required before launch
    country: "IN",
  },
  logo: "/logo.png",
  // Posts go live on their date in this time zone (builds usually run in UTC).
  timeZone: "Asia/Kolkata",
  foundingDate: undefined as string | undefined,
  sameAs: [] as string[], // LinkedIn, IndiaMART and other official profiles when they exist
  description:
    "GoodBiz Power Systems is an Indian exporter and supplier of LT panels, MV switchgear, RMUs, transformers, breakers and enclosures, sourced from partner manufacturers to each destination country's standards.",
  googleSiteVerification: undefined as string | undefined,
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

export function whatsappHref(): string {
  return `https://wa.me/${site.whatsapp}`;
}
