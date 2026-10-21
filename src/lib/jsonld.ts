import { countries, type Country } from "@/data/countries";
import { families, type Family } from "@/data/products";
import { absoluteUrl, site } from "@/data/site";
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
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl(site.logo),
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: postalAddress(),
    ...(site.foundingDate && { foundingDate: site.foundingDate }),
    ...(site.sameAs.length && { sameAs: site.sameAs }),
    areaServed: countries.map((c) => ({ "@type": "Country", name: c.name })),
    knowsAbout: [
      ...families.map((f) => f.name),
      "HSN codes for electrical equipment",
      ...[...new Set(countries.map((c) => c.conformity))],
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phone,
      areaServed: countries.map((c) => c.code),
      availableLanguage: ["English"],
    },
  };
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

export function breadcrumbLd(items: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function familyLd(fam: Family): Node {
  const url = absoluteUrl(`/products/${fam.slug}`);
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
        name: v.name,
        description: `${v.note}. ${fam.summary}`,
        category: fam.name,
        url,
        additionalProperty: [
          { "@type": "PropertyValue", propertyID: "HSN", name: "HSN code (India, 8-digit)", value: v.hsn },
          { "@type": "PropertyValue", name: "Typical rating", value: v.rating },
          { "@type": "PropertyValue", name: "Standards", value: fam.standards.join(", ") },
        ],
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/PreOrder",
          seller: { "@type": "Organization", name: site.name, "@id": ORG_ID },
          areaServed: countries.map((c) => c.name),
          url: absoluteUrl(`/configurator?family=${fam.slug}`),
        },
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
    url: absoluteUrl("/products#hsn"),
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

export function blogLd(posts: Post[]): Node {
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
  return {
    "@type": "WebPage",
    name: `Electrical equipment for ${c.name}`,
    url: absoluteUrl(path),
    isPartOf: { "@id": SITE_ID },
    about: { "@type": "Country", name: c.name },
    publisher: orgRef,
  };
}
