import type { Metadata } from "next";
import { site } from "@/data/site";

// One way to describe a page to search engines and link previews. Share images
// come from the nearest opengraph-image.tsx unless `image` is given.

export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
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
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: "en",
      ...(images && { images }),
      ...(type === "article" && {
        publishedTime: input.publishedTime,
        modifiedTime: input.modifiedTime ?? input.publishedTime,
      }),
    },
    twitter: { card: "summary_large_image", title, description, ...(images && { images: [image!] }) },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
