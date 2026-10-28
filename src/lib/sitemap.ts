import type { MetadataRoute } from "next";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { countrySlug } from "@/lib/countries";
import type { Post } from "@/lib/posts";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

// Posts with a cross-site canonical belong to another site's sitemap, and tag
// pages with a single post are noindex, so both are left out.
export function sitemapEntries(input: { posts: Post[]; tags: { slug: string; count: number }[] }): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, lastModified = BUILD_DATE) => ({
    url: absoluteUrl(path),
    lastModified,
    priority,
  });
  return [
    page("/", 1),
    page("/products", 0.9),
    page("/quote", 0.9),
    page("/configurator", 0.8),
    page("/export", 0.8),
    page("/blog", 0.7),
    ...families.map((f) => page(`/products/${f.slug}`, 0.9)),
    ...countries.map((c) => page(`/export/${countrySlug(c)}`, 0.8)),
    ...input.posts.filter((p) => !p.canonical).map((p) => page(`/blog/${p.slug}`, 0.6, p.updated ?? p.date)),
    ...input.tags.filter((t) => t.count >= 2).map((t) => page(`/blog/tag/${t.slug}`, 0.4)),
  ];
}
