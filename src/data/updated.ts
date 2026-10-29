// When each page's content last changed, for the sitemap's lastmod. Update the date
// whenever a page's wording or data changes, not on every build: search engines
// stop trusting lastmod when every URL claims to change every day.
export const PAGE_UPDATED: Record<string, string> = {
  "/": "2026-10-29",
  "/about": "2026-10-29",
  "/products": "2026-10-29",
  "/quote": "2026-10-29",
  "/configurator": "2026-10-29",
  "/export": "2026-10-29",
  "/hsn-code-finder": "2026-10-29",
  "/privacy": "2026-10-29",
};

// Every product family page and every country page shares one template and data file.
export const FAMILIES_UPDATED = "2026-10-29";
export const COUNTRIES_UPDATED = "2026-10-29";
