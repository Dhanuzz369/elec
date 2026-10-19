import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JsonLd } from "@/components/JsonLd";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { site } from "@/data/site";
import {
  blogLd,
  blogPostingLd,
  breadcrumbLd,
  countryPageLd,
  faqLd,
  familyLd,
  hsnTermSetLd,
  organizationLd,
} from "@/lib/jsonld";
import type { Post } from "@/lib/posts";

const post = (over: Partial<Post> = {}): Post => ({
  slug: "a",
  title: "A title",
  description: "d",
  date: "2026-10-10",
  author: "GoodBiz",
  tags: ["HSN codes"],
  faq: [],
  draft: false,
  html: "",
  headings: [],
  readingMinutes: 1,
  ...over,
});

test("products carry no brand, manufacturer, rating, review or price", () => {
  for (const fam of families) {
    expect(JSON.stringify(familyLd(fam))).not.toMatch(/"brand"|"manufacturer"|"aggregateRating"|"review"|"price"/);
  }
});

test("every product offer names GoodBiz as seller", () => {
  const list = familyLd(families[0]) as { itemListElement: { item: { offers: { seller: { name: string } } } }[] };
  expect(list.itemListElement).toHaveLength(families[0].variants.length);
  for (const el of list.itemListElement) expect(el.item.offers.seller.name).toBe(site.name);
});

test("HSN code appears as an additionalProperty", () => {
  const list = familyLd(families[0]) as {
    itemListElement: { item: { additionalProperty: { propertyID: string; value: string }[] } }[];
  };
  const hsn = list.itemListElement[0].item.additionalProperty.find((p) => p.propertyID === "HSN");
  expect(hsn?.value).toBe(families[0].variants[0].hsn);
});

test("organization describes an exporter, not a manufacturer", () => {
  const org = organizationLd() as { description: string; url: string; "@type": string };
  expect(org["@type"]).toBe("Organization");
  expect(org.description).toMatch(/export/i);
  expect(org.description).not.toMatch(/manufacturer of|we manufacture/i);
  expect(org.url).toBe(site.url);
});

test("blog author is the Organization when it is the site name, otherwise a Person", () => {
  expect((blogPostingLd(post()) as { author: { "@type": string } }).author["@type"]).toBe("Organization");
  expect((blogPostingLd(post({ author: "Asha Rao" })) as { author: { "@type": string; name: string } }).author).toEqual({
    "@type": "Person",
    name: "Asha Rao",
  });
});

test("blog posting points at the canonical original when set", () => {
  const ld = blogPostingLd(post({ canonical: "https://other.example/a" })) as { mainEntityOfPage: string };
  expect(ld.mainEntityOfPage).toBe("https://other.example/a");
  expect((blogPostingLd(post()) as { mainEntityOfPage: string }).mainEntityOfPage).toBe(`${site.url}/blog/a`);
});

test("faqLd is null when empty and Question/Answer pairs otherwise", () => {
  expect(faqLd([])).toBeNull();
  expect(faqLd([{ q: "Q?", a: "A." }])).toMatchObject({
    "@type": "FAQPage",
    mainEntity: [{ "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } }],
  });
});

test("breadcrumbs are absolute and ordered", () => {
  expect(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])).toMatchObject({
    "@type": "BreadcrumbList",
    itemListElement: [
      { position: 1, name: "Home", item: `${site.url}/` },
      { position: 2, name: "Blog", item: `${site.url}/blog` },
    ],
  });
});

test("HSN term set lists codes as defined terms", () => {
  expect(hsnTermSetLd([{ code: "85371000", description: "Boards ≤ 1000 V", product: "LT panel" }])).toMatchObject({
    "@type": "DefinedTermSet",
    hasDefinedTerm: [{ "@type": "DefinedTerm", termCode: "85371000", name: "LT panel" }],
  });
});

test("blog lists its posts", () => {
  expect((blogLd([post(), post({ slug: "b" })]) as { blogPost: unknown[] }).blogPost).toHaveLength(2);
});

test("country page is about the country", () => {
  expect(countryPageLd(countries[0], "/export/saudi-arabia")).toMatchObject({
    "@type": "WebPage",
    url: `${site.url}/export/saudi-arabia`,
    about: { "@type": "Country", name: "Saudi Arabia" },
  });
});

test("JsonLd escapes closing script tags", () => {
  const html = renderToStaticMarkup(createElement(JsonLd, { data: { name: "</script><script>alert(1)</script>" } }));
  expect(html.match(/<\/script>/g)).toHaveLength(1);
  expect(html).toContain("\\u003c/script>");
});

test("JsonLd adds @context to each node in a graph and drops nulls", () => {
  const html = renderToStaticMarkup(createElement(JsonLd, { data: [{ "@type": "A" }, null] }));
  const json = JSON.parse(html.replace(/^<script[^>]*>|<\/script>$/g, ""));
  expect(json).toEqual({ "@context": "https://schema.org", "@graph": [{ "@type": "A" }] });
});

test("every family has 4 to 6 FAQs answered in at most three sentences", () => {
  for (const fam of families) {
    expect(fam.faq.length).toBeGreaterThanOrEqual(4);
    expect(fam.faq.length).toBeLessThanOrEqual(6);
    for (const f of fam.faq) {
      expect(f.a.split(/(?<=[.!?])\s+(?=[A-Z])/).length).toBeLessThanOrEqual(3);
      expect(f.a).not.toMatch(/we manufacture|manufactured by goodbiz|our factory|we build/i);
    }
  }
});
