# GoodBiz: blog and search visibility (SEO, AEO, GEO)

Date: 2026-10-19
Project: `goodbiz/` (Next.js 15 App Router, React 19, Three.js, static export-friendly)

## Intent

GoodBiz exports LV/MV/HV electrical equipment (panels, transformers, RMUs, switchgear, enclosures) from India, built to each destination country's standards. Buyers are contractors and plant engineers abroad who search by product, rating, HSN code and country. The owner wants the site to be found first through any kind of search: classic search engines (SEO), answer boxes and voice answers (AEO), and AI assistants such as ChatGPT, Perplexity, Gemini and Google AI Overviews (GEO, generative engine optimisation).

They also want a blog with a new post every week. Posts will be published by an automation the owner builds later, shared across their four websites, so the blog must accept posts without anyone editing code.

## Goals

1. A blog at `/blog` with an index, topic filtering and article pages, fed by Markdown files.
2. A documented post-file format that an external automation can write to.
3. Complete technical SEO on every page: unique title, unique meta description, canonical URL, Open Graph and Twitter cards, a generated share image, sitemap, robots, RSS.
4. Structured data (schema.org JSON-LD) across the site so search engines and AI assistants can read who GoodBiz is, what it sells and what each article says.
5. Answer-ready content: question-and-answer blocks on product pages and country pages, marked up as FAQPage.
6. Country landing pages, one per destination in `src/data/countries.ts`, because buyers search with their country.
7. GEO extras: `llms.txt`, AI crawlers allowed in robots, quotable fact-dense copy.
8. Three starter posts, marked as drafts for the owner to check.

## Non-goals

- The publishing automation itself (the owner builds it later; we only define the file contract).
- A CMS, database or admin login.
- Changes to the request/quote button (owner said to leave it for now).
- Paid ads, backlink building, Google Business Profile, Search Console verification (owner's accounts; we leave the verification meta hook ready).
- Translations or hreflang (English only for now).

## Anti-goals (would be a failure even if it "works")

- Keyword-stuffed or obviously generated copy; meta descriptions that repeat the title.
- Invented proof: no fake reviews, ratings (`AggregateRating`), customer logos, certifications GoodBiz does not hold, or made-up project counts.
- Structured data that does not match visible page content (Google treats this as spam).
- Breaking the existing design system (house rules from the taste-skill build: no eyebrows, no gradients, headlines at most two lines, tokens in `globals.css`).
- Making the site slower: no client-side Markdown parsing, no heavy SEO libraries.

## Constraints

- Real business facts are not supplied yet: domain, registered address, phone/WhatsApp, export email. All of these live in ONE file, `src/data/site.ts`, with obvious placeholders (`https://www.goodbiz.example`, etc.) and a comment marking them as required before launch. Every canonical URL, sitemap entry and JSON-LD block reads from it.
- Pages stay statically generated (`generateStaticParams`), so the automation's flow is: add file → rebuild/redeploy.
- The design direction stays: pastel green ground, seafoam fields, deep forest ink, General Sans, the two-circle transformer motif.

## Decided by the owner

- **GoodBiz sources every product from partner manufacturers.** It is an exporter and supplier, not a maker. Nothing on the site or in structured data may say GoodBiz manufactures, builds, winds or tests equipment in its own factory.
- **GoodBiz arranges the destination certificates** (SASO/SABER, SONCAP, PVoC, UL listing, RCM, UKCA and the others in `countries.ts`) with each shipment. Pages may say so.
- Weekly blog, posted by a future automation across four sites.
- Full SEO, AEO and GEO, including a meta description on every page.
- Starter content and the blog/SEO plan as played back in chat were accepted.

## Design

### 1. Site settings: `src/data/site.ts`

```ts
export const site = {
  name: "GoodBiz",
  legalName: "GoodBiz",                       // PLACEHOLDER
  url: "https://www.goodbiz.example",         // PLACEHOLDER, no trailing slash
  email: "export@goodbiz.example",            // PLACEHOLDER
  phone: "+91 00000 00000",                   // PLACEHOLDER
  whatsapp: "910000000000",                   // PLACEHOLDER
  address: { street: "", city: "", region: "", postalCode: "", country: "IN" }, // PLACEHOLDER
  foundingDate: undefined as string | undefined,
  sameAs: [] as string[],                     // LinkedIn, IndiaMART, etc. when they exist
  description: "...one factual sentence...",
  googleSiteVerification: undefined as string | undefined,
};
```

Footer, configurator `mailto:` and WhatsApp links read from here instead of hard-coded strings.

### 2. Blog content contract

Location: `goodbiz/content/blog/<slug>.md`. The file name (without `.md`) is the URL slug: lowercase, hyphenated, ASCII.

Front matter (YAML):

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | ≤ 65 chars recommended; used as `<h1>` and `<title>` |
| `description` | yes | string | 120–160 chars; the meta description and card summary |
| `date` | yes | `YYYY-MM-DD` | publish date; future dates are not published until that date at build time |
| `updated` | no | `YYYY-MM-DD` | shown and used as `dateModified` |
| `author` | yes | string | name shown and used in Article JSON-LD |
| `tags` | yes | string[] | free tags; first tag is the primary topic |
| `family` | no | slug from `products.ts` | links the post to a product family and back |
| `countries` | no | ISO codes from `countries.ts` | links to country pages |
| `cover` | no | path under `/public` or absolute URL | falls back to the generated share image |
| `coverAlt` | if `cover` | string | |
| `faq` | no | `{ q, a }[]` | rendered at the end and marked up as FAQPage |
| `draft` | no | boolean | `true` hides it in production builds |
| `canonical` | no | absolute URL | when the same post is published on several of the owner's sites, the original's URL; sets a cross-domain canonical and `mainEntityOfPage`, and the post is left out of this site's sitemap |

Body: CommonMark + GFM tables. `##` and `###` headings only (the page owns `<h1>`); headings get anchor ids and feed a table of contents when there are 3+ `##`.

Parsing happens at build time on the server only (`gray-matter` + `remark`/`rehype` with `remark-gfm`, `rehype-slug`, sanitised HTML). Invalid front matter fails the build with a message naming the file and field, so the automation sees errors instead of silently publishing broken pages.

A copy of this table goes into `goodbiz/content/blog/README.md` for whoever builds the automation.

### 3. Blog pages

- `/blog` — index. Newest first. Topic filter as links (`/blog/tag/<tag>`) rather than client-side state, so every filter view is a crawlable page with its own title and description. Each item: title, description, date, reading time, primary tag.
- `/blog/[slug]` — article. Title, date (and updated), author, reading time, cover, table of contents, body, FAQ, then a "related" block: the linked product family page, linked country pages, and the configurator with the family preselected (`/configurator?family=…`). Previous/next post.
- `/blog/tag/[tag]` — tag listing.
- `/feed.xml` — RSS 2.0 of the latest 30 posts.
- Header nav gains "Blog"; footer gains a Blog link.
- Layout follows the existing system: the article column at 65–75 characters, body 18–19px, two type faces at most (General Sans only), motif bullets for lists, no card grids on the index (a banded list like the product explorer).

### 4. Country pages

`/export/[country]` for each entry in `countries.ts` (slug from the name, e.g. `/export/saudi-arabia`). Content generated from data:

- H1 like "Electrical equipment for Saudi Arabia" (two lines max).
- A grid facts block: LV/MV, frequency, standards, conformity, design ambient, nameplate language.
- Which product families are typically supplied, linking to each family page.
- An FAQ (3–5 Q&As generated from the data, e.g. "What voltage do panels for Saudi Arabia use?").
- CTA into the configurator with that country preselected (`/configurator?country=SA`; the configurator already reads `family`, add `country`).
- An index page `/export` listing all countries by region.

Copy must say the values are typical and the project specification wins, as the configurator already does.

### 5. Metadata on every page

Use Next.js `metadata` / `generateMetadata` with `metadataBase = site.url`:

- `title` (template `%s · GoodBiz`), unique `description` (120–160 chars, never just the title), `alternates.canonical`, `openGraph` (type, url, title, description, images, siteName, locale `en`), `twitter` (`summary_large_image`), `robots`.
- Product family pages: description built from the family's summary plus its HSN code range.
- Generated share images via `opengraph-image.tsx` (Next `ImageResponse`) per route group: the motif, the page title, GoodBiz wordmark, in the site palette. 1200×630.
- `icon` and `apple-icon` from the two-circle motif.
- `google-site-verification` meta only when set in `site.ts`.

### 6. Structured data (JSON-LD)

One small `JsonLd` server component that renders `<script type="application/ld+json">`.

| Page | Types |
| --- | --- |
| All pages (layout) | `Organization` (name, url, logo, email, telephone, address, sameAs, `description` as an exporter and supplier, `areaServed`, `knowsAbout` for the product families and certificates) and `WebSite` |
| Every page below home | `BreadcrumbList` |
| `/products/[slug]` | `ItemList` of `Product` per variant (name, description, category, `additionalProperty` for rating, standard and HSN code). **No `brand` or `manufacturer`** (GoodBiz is not the maker). Each product carries an `offers` `Offer` with `seller` = the Organization, `availability` = `PreOrder`/made to order, `areaServed` = the countries list, and no price. `FAQPage` for its Q&A |
| `/products` | `ItemList` of families; `Dataset`-free, HSN table as `DefinedTermSet` of `DefinedTerm` (code + description) |
| `/export/[country]` | `WebPage` with `about` = Country (`Place`), `FAQPage` |
| `/blog/[slug]` | `BlogPosting` (headline, description, datePublished, dateModified, author, publisher = Organization, image, mainEntityOfPage, keywords, about) + `FAQPage` when `faq` present |
| `/blog` | `Blog` with `blogPost` list |

No `Offer` prices, `AggregateRating` or `Review` (we have none; inventing them is an anti-goal). Validate with Google's Rich Results Test before launch (owner or builder, needs the live URL).

### 7. AEO: answer blocks

- Product family pages get a "Questions buyers ask" section, 4–6 Q&As written per family in `products.ts` (new `faq` field). Each answer is 1–3 sentences, starts with the direct answer, includes numbers (rating, standard, HSN). Rendered as a native `<details>`/`<summary>` list (accessible, no JS), styled to the system.
- HSN finder page: the top questions ("What is the HSN code for LT panels?", "…for transformers above 10 MVA?") as an FAQ block.
- Headings phrased the way people ask where it reads naturally.

### 8. GEO: AI assistants

- `/robots.txt` (from `app/robots.ts`): allow all, explicitly allow `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-Web`, `Google-Extended`, `Applebot-Extended`, `Bingbot`; point to the sitemap.
- `/llms.txt`: plain-text summary of who GoodBiz is, product families with ratings and HSN codes, countries served, and links to key pages and the latest posts. Generated at build from the same data so it never drifts. Also `/llms-full.txt` with the full product and HSN tables.
- Copy style on product, country and blog pages: short factual sentences that state the entity, the number and the standard together, so a quoted sentence still makes sense on its own.
- Every page shows a visible "last updated" date where it matters (blog, HSN finder, country pages).

### 9. Sitemap

`app/sitemap.ts` lists home, products, each family, configurator, blog index, each published post (with `lastModified` from `updated`/`date`), tag pages, export index and each country page.

### 10. Copy correction (existing pages)

The current copy implies manufacturing. Rewrite these to the exporter/supplier truth, keeping each headline two lines or fewer:

| Where | Now | Change to (direction) |
| --- | --- | --- |
| `layout.tsx` default title | "Electrical equipment built for your grid" | "Electrical equipment sourced and exported for your grid" or similar |
| `page.tsx` hero H1 | "Built for your grid" | keep the idea without "built", e.g. "Matched to your grid" |
| `page.tsx` hero sentence | "…made to the voltage, standard and paperwork…" | "…sourced from proven manufacturers to the voltage, standard and paperwork…" |
| `page.tsx` brands tile | "We fit the breakers…" | "We source the breakers, relays and meters your specification names…" |
| `page.tsx` contractor band | "we build to match and ship it" | "we source to match, arrange the certificates and ship it" |
| `products/page.tsx` | "built or sourced to order" | "sourced to order" |
| `products/[slug]` CTA | "We build to match and ship it." | "We source to match and ship it." |
| `products.ts` summaries | "wound in copper or aluminium, tested to IEC…", "Low-voltage panels built to your single-line diagram…", etc. | describe the product and what the buyer gets ("supplied with…", "built by our partner manufacturers to your SLD") |
| `SiteFooter.tsx` | "Built in India, shipped worldwide." | "Sourced in India, shipped worldwide." |
| `Configurator.tsx` plate | "GoodBiz · Made in India", "as it would leave our factory" | "Supplied by GoodBiz · Origin India", "as it would ship to {country}" |
| `brands.ts` comment | "brands GoodBiz actually builds with" | "brands GoodBiz sources" |
| Country pages, FAQs, starter post 2 | — | state that GoodBiz arranges the destination certificate with the shipment |

### 11. Starter posts (drafts)

1. "HSN codes for electrical panels and switchgear: an exporter's guide" — 8537/8538/8536 lines, links to the HSN finder.
2. "Certificates your electrical equipment needs, country by country" — SASO, SONCAP, PVoC, UL, RCM, UKCA, from `countries.ts`.
3. "Oil-filled or dry-type transformer: how to choose for an export project".

Each has `draft: true`, a FAQ, links to the relevant family and country pages. Facts reuse the verified HSN research and the country data; anything not verified is phrased as typical. The owner reviews and flips `draft` to `false`.

## Builder's calls (not decided by the owner)

- **Cross-site duplicates:** optional `canonical` front-matter field (see contract) so the automation can mark the original when one article goes to all four sites. Without it, each site's copy is self-canonical.
- **Hosting:** no `output: 'export'`; target a Node host such as Vercel, so `opengraph-image`, `robots.ts` and `sitemap.ts` work as-is. The automation commits a file to `content/blog` and the host rebuilds. Future-dated posts need a daily rebuild (a scheduled deploy hook), noted in the README.
- **Drafts:** hidden in production; shown with a "Draft" label and `noindex` in `npm run dev` and when `SHOW_DRAFTS=1` is set (for a preview deploy). An empty `/blog` gets a designed empty state, and the `Blog` JSON-LD and feed are simply empty.
- **Author:** if `author` equals the site name, JSON-LD uses the `Organization`; otherwise a `Person` with that name. No author pages yet.
- **Country pages list all eight families,** each line tailored with that country's data (e.g. the rated voltage and standard that family would be built to), rather than an invented per-country subset.
- **Thin tag pages** (fewer than 2 posts) are `noindex` and left out of the sitemap.

- Markdown files over a CMS (simplest target for a cross-site automation).
- Libraries: `gray-matter`, `unified`/`remark`/`rehype` (+ `remark-gfm`, `rehype-slug`, `rehype-sanitize`, `rehype-stringify`); reading time computed locally.
- Country pages under `/export/…`.
- Exact Q&A wording, starter post wording, OG image layout within the design system.

## Done when

- `npm run build` passes; all new routes are statically generated.
- Every route has a unique title and a 120–160 char meta description (a build-time check script lists any duplicates or out-of-range lengths).
- JSON-LD on each page type parses as valid JSON and matches visible content.
- `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt` are served.
- Adding a new `.md` file to `content/blog` and rebuilding publishes it with no code change; a broken front-matter file fails the build with a clear message.
- The design inspector passes on `/blog` and one article page.
- Placeholders in `site.ts` are listed in the hand-off as required before launch.
