import { families } from "@/data/products";
import { SITE_FAQ } from "@/data/site-faq";
import { markdownPaths, pageMarkdown } from "@/lib/markdown-pages";

test("the home page has a Markdown version that defines the company and answers the FAQ", () => {
  const md = pageMarkdown("/")!;
  expect(md.startsWith("# GoodBiz Power Systems")).toBe(true);
  for (const f of SITE_FAQ) expect(md).toContain(f.q);
});

test("product, country and HSN pages carry their own facts in Markdown", () => {
  expect(pageMarkdown("/products/transformers")).toContain("85042100");
  expect(pageMarkdown("/export/kenya")).toContain("Port of Mombasa");
  expect(pageMarkdown("/hsn-code-finder")).toContain("85371000");
  expect(pageMarkdown("/about")).toContain("BESCOM");
});

test("unknown pages have no Markdown version", () => {
  expect(pageMarkdown("/nope")).toBeNull();
});

test("every core page, product and country has a Markdown version", () => {
  for (const p of ["/", "/about", "/products", "/export", "/quote", "/configurator", "/hsn-code-finder", "/privacy"])
    expect(markdownPaths()).toContain(p);
  for (const f of families) expect(markdownPaths()).toContain(`/products/${f.slug}`);
  expect(markdownPaths().filter((p) => p.startsWith("/export/"))).toHaveLength(18);
  for (const p of markdownPaths()) expect(pageMarkdown(p), p).not.toBeNull();
});
