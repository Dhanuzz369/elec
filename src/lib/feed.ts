import { absoluteUrl, site } from "@/data/site";
import type { Post } from "@/lib/posts";

const MAX_ITEMS = 30;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function postUrl(post: Pick<Post, "slug" | "canonical">): string {
  return post.canonical ?? absoluteUrl(`/blog/${post.slug}`);
}

// RSS 2.0 for the latest posts. Expects posts already sorted newest first.
export function buildRss(posts: Post[]): string {
  const items = posts
    .slice(0, MAX_ITEMS)
    .map((p) => {
      const url = postUrl(p);
      return [
        "<item>",
        `<title>${esc(p.title)}</title>`,
        `<link>${esc(url)}</link>`,
        `<guid isPermaLink="true">${esc(url)}</guid>`,
        `<pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `<description>${esc(p.description)}</description>`,
        ...p.tags.map((t) => `<category>${esc(t)}</category>`),
        "</item>",
      ].join("");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(site.name)} blog</title>
<link>${absoluteUrl("/blog")}</link>
<atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
<description>${esc(`Guides for buyers of electrical equipment exported by ${site.name}: HSN codes, standards, certificates and shipping.`)}</description>
<language>en</language>
${items}
</channel>
</rss>
`;
}
