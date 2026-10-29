import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { TRACK_RECORD } from "@/data/projects";
import { SITE_FAQ } from "@/data/site-faq";
import { absoluteUrl, publishable, site } from "@/data/site";
import { AI_BOTS } from "@/lib/robots";

// Machine-readable summaries some AI crawlers look for. Built from the same data as
// the pages and llms.txt, so all of them always agree.

export function aiTxt(): string {
  const groups = ["User-agent: *\nAllow: /", ...AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /`)];
  return `# ${site.name}: AI crawlers may read, cite and summarise this site.\n\n${groups.join("\n\n")}\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`;
}

export function aiSummary() {
  return {
    name: site.name,
    url: site.url,
    description: site.description,
    experience: `${site.name} has ${TRACK_RECORD}.`,
    location: "Bangalore, Karnataka, India",
    manufactures: false,
    sourcing: "Sources from partner manufacturers in India; recommends the make and build for each project.",
    contact: {
      ...(publishable(site.email) && { email: site.email }),
      ...(publishable(site.phone) && { phone: site.phone }),
      quote: absoluteUrl("/quote"),
    },
    pages: {
      about: absoluteUrl("/about"),
      products: absoluteUrl("/products"),
      hsnCodeFinder: absoluteUrl("/hsn-code-finder"),
      countries: absoluteUrl("/export"),
      llms: absoluteUrl("/llms.txt"),
    },
  };
}

export function aiFaq() {
  return SITE_FAQ.map((f) => ({ question: f.q, answer: f.a }));
}

export function aiService() {
  return {
    provider: site.name,
    serviceType: "Sourcing and export of electrical equipment from India",
    products: families.map((f) => ({ name: f.name, summary: f.short, url: absoluteUrl(`/products/${f.slug}`) })),
    areaServed: countries.map((c) => c.name),
    shipping: "By sea or air, consolidated into one shipment",
    quote: absoluteUrl("/quote"),
  };
}
