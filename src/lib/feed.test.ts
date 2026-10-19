import { absoluteUrl, site } from "@/data/site";
import { buildRss } from "@/lib/feed";
import type { Post } from "@/lib/posts";

function post(over: Partial<Post>): Post {
  return {
    slug: "a",
    title: "A",
    description: "d",
    date: "2026-10-01",
    author: "GoodBiz",
    tags: ["t"],
    faq: [],
    draft: false,
    html: "",
    headings: [],
    readingMinutes: 1,
    ...over,
  };
}

test("escapes xml in titles and descriptions", () => {
  const xml = buildRss([post({ title: "Panels & <boards>", description: "a < b & c" })]);
  expect(xml).toContain("<title>Panels &amp; &lt;boards&gt;</title>");
  expect(xml).toContain("<description>a &lt; b &amp; c</description>");
});

test("keeps at most 30 items, newest first as given", () => {
  const posts = Array.from({ length: 35 }, (_, i) => post({ slug: `p${i}`, title: `P${i}` }));
  const xml = buildRss(posts);
  expect(xml.match(/<item>/g)).toHaveLength(30);
  expect(xml.indexOf("<title>P0</title>")).toBeLessThan(xml.indexOf("<title>P1</title>"));
});

test("links to this site unless a canonical is set", () => {
  const xml = buildRss([post({ slug: "own" }), post({ slug: "syn", canonical: "https://other.example/x" })]);
  expect(xml).toContain(`<link>${absoluteUrl("/blog/own")}</link>`);
  expect(xml).toContain('<guid isPermaLink="true">https://other.example/x</guid>');
});

test("dates are RFC 822", () => {
  expect(buildRss([post({ date: "2026-10-05" })])).toContain("<pubDate>Mon, 05 Oct 2026 00:00:00 GMT</pubDate>");
});

test("empty input is a valid channel with no items", () => {
  const xml = buildRss([]);
  expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  expect(xml).toContain(`<title>${site.name} blog</title>`);
  expect(xml).not.toContain("<item>");
});
