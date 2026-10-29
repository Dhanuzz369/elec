import { countries, type Country } from "@/data/countries";
import { families, type Family } from "@/data/products";
import { projectTypes } from "@/data/projects";
import { absoluteUrl, publishable, site } from "@/data/site";
import { COUNTRIES_UPDATED, PAGE_UPDATED } from "@/data/updated";
import type { Faq, Post } from "@/lib/posts";

// schema.org builders. Every claim here must also be visible on the page.
// GoodBiz Power Systems sources every product, so products never carry brand or manufacturer,
// and there are no prices, ratings or reviews.

type Node = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const orgRef = { "@id": ORG_ID };

function postalAddress() {
  const a = site.address;
  return {
    "@type": "PostalAddress",
    ...(a.street && { streetAddress: a.street }),
    ...(a.city && { addressLocality: a.city }),
    ...(a.region && { addressRegion: a.region }),
    ...(a.postalCode && { postalCode: a.postalCode }),
    addressCountry: a.country,
  };
}

export function organizationLd(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    // Stated only once the registered name (Pvt Ltd, LLP…) is known; the trade name is not a legal name.
    ...(site.legalName !== site.name && { legalName: site.legalName }),
    url: site.url,
    logo: absoluteUrl(site.logo),
    description: site.description,
    ...(publishable(site.email) && { email: site.email }),
    ...(publishable(site.phone) && { telephone: site.phone }),
    address: postalAddress(),
    ...(site.foundingDate && { foundingDate: site.foundingDate }),
    ...(site.sameAs.length && { sameAs: site.sameAs }),
    areaServed: countries.map((c) => ({ "@type": "Country", name: c.name })),
    knowsAbout: [
      ...families.map((f) => f.name),
      "HSN codes for electrical equipment",
      ...projectTypes.map((p) => `Electrical supply for ${p.name.toLowerCase()}`),
      "Export of electrical equipment from India",
      "Electrical standards and certificates by country",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      ...(publishable(site.email) && { email: site.email }),
      ...(publishable(site.phone) && { telephone: site.phone }),
      url: absoluteUrl("/quote"),
      areaServed: countries.map((c) => c.code),
      availableLanguage: ["English"],
    },
  };
}

// One node per page, linked to the site, its breadcrumb and (when known) its last change.
export function webPageLd(input: { path: string; name: string; type?: string; extra?: Node }): Node {
  const url = input.path === "/" ? site.url : absoluteUrl(input.path);
  return {
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    isPartOf: { "@id": SITE_ID },
    ...(input.path !== "/" && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    ...(PAGE_UPDATED[input.path] && { dateModified: PAGE_UPDATED[input.path] }),
    inLanguage: "en",
    ...input.extra,
  };
}

export function aboutPageLd(): Node {
  return webPageLd({ path: "/about", name: "About us", type: "AboutPage", extra: { mainEntity: orgRef } });
}

export function websiteLd(): Node {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    url: site.url,
    publisher: orgRef,
    inLanguage: "en",
  };
}

// Home is written as the canonical address (no trailing slash) so the two never differ.
export function breadcrumbLd(items: { name: string; path: string }[]): Node {
  const at = (path: string) => (path === "/" ? site.url : absoluteUrl(path));
  return {
    "@type": "BreadcrumbList",
    "@id": `${at(items[items.length - 1].path)}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: at(it.path),
    })),
  };
}

// No price is published, so products carry no Offer (an Offer without a price draws
// Search Console warnings). Each line gets its own @id and the family photograph.
export function familyLd(fam: Family): Node {
  const url = absoluteUrl(`/products/${fam.slug}`);
  const photo = fam.gallery?.[0]?.src ?? fam.image?.src;
  const lineId = (name: string) => `${url}#line-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  return {
    "@type": "ItemList",
    name: fam.name,
    description: fam.summary,
    url,
    numberOfItems: fam.variants.length,
    itemListElement: fam.variants.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        "@id": lineId(v.name),
        name: v.name,
        ...(photo && { image: absoluteUrl(photo) }),
        description: `${v.note}. ${fam.summary}`,
        category: fam.name,
        url,
        additionalProperty: [
          { "@type": "PropertyValue", propertyID: "HSN", name: "HSN code (India, 8-digit)", value: v.hsn },
          { "@type": "PropertyValue", name: "Typical rating", value: v.rating },
          { "@type": "PropertyValue", name: "Standards", value: fam.standards.join(", ") },
        ],
      },
    })),
  };
}

export function familiesListLd(): Node {
  return {
    "@type": "ItemList",
    name: `${site.name} product families`,
    itemListElement: families.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.name,
      url: absoluteUrl(`/products/${f.slug}`),
    })),
  };
}

export function hsnTermSetLd(entries: { code: string; description: string; product: string }[]): Node {
  return {
    "@type": "DefinedTermSet",
    name: "HSN codes for electrical equipment (India, 8-digit)",
    url: absoluteUrl("/hsn-code-finder"),
    hasDefinedTerm: entries.map((e) => ({
      "@type": "DefinedTerm",
      termCode: e.code,
      name: e.product,
      description: e.description,
    })),
  };
}

export function faqLd(faq: Faq[]): Node | null {
  if (!faq.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function authorLd(name: string): Node {
  return name === site.name ? { "@type": "Organization", name: site.name, "@id": ORG_ID } : { "@type": "Person", name };
}

export function blogPostingLd(post: Post): Node {
  const url = post.canonical ?? absoluteUrl(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: authorLd(post.author),
    publisher: orgRef,
    mainEntityOfPage: url,
    url,
    image: post.cover ? (post.cover.startsWith("/") ? absoluteUrl(post.cover) : post.cover) : absoluteUrl(`/blog/${post.slug}/opengraph-image`),
    keywords: post.tags.join(", "),
    inLanguage: "en",
    ...(post.family && { about: { "@type": "Thing", name: families.find((f) => f.slug === post.family)?.name } }),
  };
}

export function blogLd(posts: Post[]): Node | null {
  if (!posts.length) return null;
  return {
    "@type": "Blog",
    name: `${site.name} blog`,
    url: absoluteUrl("/blog"),
    publisher: orgRef,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.date,
      url: p.canonical ?? absoluteUrl(`/blog/${p.slug}`),
    })),
  };
}

export function countryPageLd(c: Country, path: string): Node {
  const country = { "@type": "Country", name: c.name };
  return webPageLd({
    path,
    name: `Electrical equipment for ${c.name}`,
    extra: {
      about: country,
      publisher: orgRef,
      dateModified: COUNTRIES_UPDATED,
      mainEntity: {
        "@type": "Service",
        name: `Electrical equipment supply to ${c.name}`,
        serviceType: "Sourcing and export of electrical panels, switchgear and transformers",
        provider: orgRef,
        areaServed: country,
      },
    },
  });
}
