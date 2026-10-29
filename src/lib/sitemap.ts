import type { MetadataRoute } from "next";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { COUNTRIES_UPDATED, FAMILIES_UPDATED, PAGE_UPDATED } from "@/data/updated";
import { countrySlug } from "@/lib/countries";
import type { Post } from "@/lib/posts";

// Posts with a cross-site canonical belong to another site's sitemap, and tag
// pages with a single post are noindex, so both are left out. No priority: Google ignores it.
export function sitemapEntries(input: { posts: Post[]; tags: { slug: string; count: number }[] }): MetadataRoute.Sitemap {
  const page = (path: string, lastModified = PAGE_UPDATED[path]) => ({ url: absoluteUrl(path), lastModified });
  const latestPost = input.posts.map((p) => p.updated ?? p.date).sort().at(-1);
  return [
    page("/"),
    page("/products"),
    page("/quote"),
    page("/about"),
    page("/configurator"),
    page("/export"),
    page("/hsn-code-finder"),
    page("/privacy"),
    // An empty blog is noindex, so it only joins the sitemap once a post is live.
    ...(input.posts.length && latestPost ? [page("/blog", latestPost)] : []),
    ...families.map((f) => page(`/products/${f.slug}`, FAMILIES_UPDATED)),
    ...countries.map((c) => page(`/export/${countrySlug(c)}`, COUNTRIES_UPDATED)),
    ...input.posts.filter((p) => !p.canonical).map((p) => page(`/blog/${p.slug}`, p.updated ?? p.date)),
    ...input.tags.filter((t) => t.count >= 2).map((t) => page(`/blog/tag/${t.slug}`, latestPost)),
  ];
}
