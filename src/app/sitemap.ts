import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { sitemapEntries } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts({ includeDrafts: false }), getAllTags({ includeDrafts: false })]);
  return sitemapEntries({ posts, tags });
}
