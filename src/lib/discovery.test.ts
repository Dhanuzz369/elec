import { site } from "@/data/site";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms";
import type { Post } from "@/lib/posts";
import { AI_BOTS, robotsConfig } from "@/lib/robots";
import { sitemapEntries } from "@/lib/sitemap";

const post = (over: Partial<Post>): Post => ({
  slug: "a",
  title: "A",
  description: "d",
  date: "2026-10-10",
  author: "GoodBiz Power Systems",
  tags: ["t"],
  faq: [],
  draft: false,
  html: "",
  headings: [],
  readingMinutes: 1,
  ...over,
});

const posts = [post({ slug: "own", updated: "2026-10-12" }), post({ slug: "syn", canonical: "https://other.example/x" })];
const tags = [
  { slug: "busy", count: 2 },
  { slug: "thin", count: 1 },
];
const urls = () => sitemapEntries({ posts, tags }).map((e) => e.url);

test("sitemap leaves out syndicated posts", () => {
  expect(urls()).toContain(`${site.url}/blog/own`);
  expect(urls().some((u) => u.endsWith("/blog/syn"))).toBe(false);
});

test("sitemap leaves out thin tag pages", () => {
  expect(urls()).toContain(`${site.url}/blog/tag/busy`);
  expect(urls()).not.toContain(`${site.url}/blog/tag/thin`);
});

test("sitemap covers products, countries and core pages", () => {
  for (const path of ["/", "/products", "/configurator", "/blog", "/export", "/export/saudi-arabia", "/products/transformers"]) {
    expect(urls()).toContain(path === "/" ? `${site.url}/` : `${site.url}${path}`);
  }
});

test("sitemap urls are absolute on this site and unique", () => {
  const all = urls();
  expect(all.every((u) => u.startsWith(site.url))).toBe(true);
  expect(new Set(all).size).toBe(all.length);
});

test("post lastModified uses updated date", () => {
  const own = sitemapEntries({ posts, tags }).find((e) => e.url.endsWith("/blog/own"));
  expect(own?.lastModified).toBe("2026-10-12");
});

test("robots allows every AI crawler and points at the sitemap", () => {
  const cfg = robotsConfig();
  const rules = Array.isArray(cfg.rules) ? cfg.rules : [cfg.rules];
  for (const bot of AI_BOTS) {
    expect(rules.some((r) => r.userAgent === bot && r.allow === "/")).toBe(true);
  }
  expect(rules.some((r) => r.userAgent === "*" && r.allow === "/")).toBe(true);
  expect(cfg.sitemap).toBe(`${site.url}/sitemap.xml`);
});

test("llms.txt follows the llmstxt.org shape", () => {
  const txt = buildLlmsTxt(posts);
  expect(txt.startsWith(`# ${site.name}\n\n> `)).toBe(true);
  expect(txt).toContain("## Products");
  expect(txt).toContain("## Countries");
  expect(txt).toContain(`[A](${site.url}/blog/own)`);
  expect(txt).not.toMatch(/we manufacture|our factory|we build/i);
});

test("the full file carries every HSN code, the short one does not", () => {
  expect(buildLlmsFullTxt()).toContain("85371000");
  expect(buildLlmsTxt(posts)).not.toContain("85371000");
});

test("robots has no Host line (Google ignores it)", () => {
  expect(robotsConfig().host).toBeUndefined();
});
