import type { Metadata } from "next";
import { site } from "@/data/site";

// One way to describe a page to search engines and link previews. Share images
// come from the nearest opengraph-image.tsx unless `image` is given.

// The home page names the business first; every other page uses "%s · GoodBiz Power Systems".
export const HOME_TITLE = "GoodBiz Power Systems · Panels & Transformers from India";

export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  // What this page should be found for, most important first; the company keywords are added after.
  keywords: string[];
  image?: string;
  noindex?: boolean;
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function trimDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_MAX) return clean;
  const cut = clean.slice(0, DESCRIPTION_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–—-]+$/, "")}.`;
}

export function pageMeta(input: PageMetaInput): Metadata {
  const { title, description, path, image, noindex, canonical, type = "website" } = input;
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    throw new RangeError(
      `Meta description for ${path} is ${description.length} characters; keep it ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}.`,
    );
  }
  if (description.trim() === title.trim()) {
    throw new RangeError(`Meta description for ${path} repeats the title.`);
  }

  const url = canonical ?? path;
  // The site-wide card unless the page passes its own; a segment's opengraph-image file still wins.
  const shareImage = image ?? "/opengraph-image";
  const images = [{ url: shareImage, width: 1200, height: 630, alt: title }];
  const shareTitle = title.includes(site.name) ? title : `${title} · ${site.name}`;
  const seen = new Set<string>();
  const keywords = [...input.keywords, ...site.keywords].filter((k) => {
    const key = k.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    title,
    description,
    keywords,
    // Every page points feed readers and AI crawlers to the RSS feed.
    alternates: { canonical: url, types: { "application/rss+xml": [{ url: "/feed.xml", title: `${site.name} guides` }] } },
    openGraph: {
      type,
      url,
      title: shareTitle,
      description,
      siteName: site.name,
      locale: "en",
      images,
      ...(type === "article" && {
        publishedTime: input.publishedTime,
        modifiedTime: input.modifiedTime ?? input.publishedTime,
      }),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [shareImage] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
