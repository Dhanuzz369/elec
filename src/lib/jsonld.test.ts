import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JsonLd } from "@/components/JsonLd";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { projectTypes } from "@/data/projects";
import { site } from "@/data/site";
import {
  aboutPageLd,
  blogLd,
  blogPostingLd,
  breadcrumbLd,
  countryPageLd,
  faqLd,
  familyLd,
  hsnTermSetLd,
  organizationLd,
  websiteLd,
  webPageLd,
} from "@/lib/jsonld";
import type { Post } from "@/lib/posts";

const post = (over: Partial<Post> = {}): Post => ({
  slug: "a",
  title: "A title",
  description: "d",
  date: "2026-10-10",
  author: "GoodBiz Power Systems",
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

// No price exists, so no Offer: an Offer without a price draws Search Console warnings.
test("product lines carry no offer, but an id and an image", () => {
  const list = familyLd(families[0]) as { itemListElement: { item: { offers?: unknown; "@id": string; image?: string } }[] };
  expect(list.itemListElement).toHaveLength(families[0].variants.length);
  const ids = list.itemListElement.map((el) => el.item["@id"]);
  expect(new Set(ids).size).toBe(ids.length);
  for (const el of list.itemListElement) {
    expect(el.item.offers).toBeUndefined();
    expect(el.item.image).toMatch(/^https:\/\/www\.goodbizpower\.com\/images\//);
  }
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
      { position: 1, name: "Home", item: site.url },
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

test("placeholder contact details are never published in structured data", () => {
  const text = JSON.stringify(organizationLd());
  expect(text).not.toMatch(/\.example\b/);
  expect(text).not.toMatch(/0000/);
});

test("the organization carries its real contact details", () => {
  const org = organizationLd() as { email?: string; telephone?: string; address: { addressLocality?: string; addressRegion?: string } };
  expect(org.email).toBe("power@goodbizglobal.com");
  expect(org.telephone).toBe("+91 88847 99369");
  expect(org.address.addressLocality).toBe("Bangalore");
  expect(org.address.addressRegion).toBe("Karnataka");
});

test("About page is about the organization", () => {
  expect(aboutPageLd()).toMatchObject({
    "@type": "AboutPage",
    url: `${site.url}/about`,
    mainEntity: { "@id": `${site.url}/#organization` },
  });
});

test("organization knows the four project types", () => {
  const knows = (organizationLd() as { knowsAbout: string[] }).knowsAbout;
  for (const p of projectTypes) expect(knows).toContain(`Electrical supply for ${p.name.toLowerCase()}`);
});

test("the company description carries the track record", () => {
  const { description } = organizationLd() as { description: string };
  expect(description).toMatch(/25\+ years in power distribution/);
  expect(description).toMatch(/BESCOM/);
  expect(description).toMatch(/KPTCL/);
});

test("breadcrumbs carry an id and start at the canonical home address", () => {
  const b = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Get a quote", path: "/quote" },
  ]) as { "@id": string; itemListElement: { item: string }[] };
  expect(b["@id"]).toBe(`${site.url}/quote#breadcrumb`);
  expect(b.itemListElement[0].item).toBe(site.url);
});

test("each page node has an id, its breadcrumb and a modified date", () => {
  expect(webPageLd({ path: "/quote", name: "Get a quote", type: "ContactPage" })).toMatchObject({
    "@type": "ContactPage",
    "@id": `${site.url}/quote#webpage`,
    url: `${site.url}/quote`,
    isPartOf: { "@id": `${site.url}/#website` },
    breadcrumb: { "@id": `${site.url}/quote#breadcrumb` },
    dateModified: "2026-10-29",
  });
  expect(aboutPageLd()).toMatchObject({ breadcrumb: { "@id": `${site.url}/about#breadcrumb` }, dateModified: "2026-10-29" });
});

test("country pages describe the export service to that country", () => {
  expect(countryPageLd(countries[0], "/export/saudi-arabia")).toMatchObject({
    "@id": `${site.url}/export/saudi-arabia#webpage`,
    breadcrumb: { "@id": `${site.url}/export/saudi-arabia#breadcrumb` },
    mainEntity: {
      "@type": "Service",
      provider: { "@id": `${site.url}/#organization` },
      areaServed: { "@type": "Country", name: "Saudi Arabia" },
    },
  });
});

test("an empty blog emits no Blog node", () => {
  expect(blogLd([])).toBeNull();
});

test("the organization states no legal name until the registered one is known", () => {
  const org = organizationLd() as { legalName?: string; knowsAbout: string[] };
  expect(org.legalName).toBeUndefined();
  expect(org.knowsAbout.length).toBeLessThanOrEqual(15);
});

test("the site offers a search action into the HSN code finder", () => {
  expect(websiteLd()).toMatchObject({
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/hsn-code-finder?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });
});
