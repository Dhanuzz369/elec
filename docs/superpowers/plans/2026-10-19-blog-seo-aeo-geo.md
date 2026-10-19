# Blog and SEO/AEO/GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Markdown-fed blog, country export pages, answer blocks, structured data, full metadata, sitemap/robots/RSS/llms.txt, and correct the copy so GoodBiz reads as an exporter and supplier.

**Architecture:** Pure data and string builders live in `src/lib/` and are unit-tested with Vitest. App Router pages and route handlers stay thin and call them. Everything is statically generated at build time; Markdown is parsed on the server only.

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript, Vitest 3, gray-matter, unified/remark/rehype (remark-parse, remark-gfm, remark-rehype, rehype-slug, rehype-sanitize, rehype-stringify).

**Spec:** `docs/superpowers/specs/2026-10-19-blog-seo-aeo-geo-design.md`

## Global Constraints

- All business facts come from `src/data/site.ts`; no other file hard-codes the domain, email, phone or WhatsApp number.
- GoodBiz sources every product: no copy or JSON-LD may say GoodBiz manufactures, builds, winds or tests in its own factory; JSON-LD `Product` has **no `brand` or `manufacturer`**.
- GoodBiz arranges destination certificates; pages may say so.
- No `AggregateRating`, `Review`, or `Offer.price` anywhere.
- Meta descriptions are 120–160 characters, unique per route, never equal to the title.
- Headlines (`h1`–`h6`) stay two lines or fewer at 1440/768/390px; no eyebrows, gradients, monospace, or new type faces; colours only via tokens in `globals.css`.
- Markdown is parsed at build time on the server; no client-side Markdown or SEO libraries.
- Post files: `content/blog/<slug>.md`, slug `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Drafts show only when `NODE_ENV === "development"` or `SHOW_DRAFTS === "1"`, and then with `noindex`.
- Tag pages with fewer than 2 posts are `noindex` and left out of the sitemap.
- Commit after every task on `main` (the repo exists; no remote).

## Review Focus

- A post file with a missing or wrong-typed required field must fail `npm run build` with a message naming the file and the field (test in Task 3).
- A post dated in the future, or with `draft: true`, must not appear in production lists, feed, sitemap or llms.txt (tests in Tasks 3, 4 and 9).
- Tags with capitals, spaces or symbols ("Export Compliance", "HSN & customs") must map to one stable URL slug, and two spellings of the same tag must merge (test in Task 3).
- Raw HTML in a post body (`<script>`, `onclick`) must be stripped from the rendered page (test in Task 3).
- A post with `canonical` pointing at another site must emit that canonical and stay out of this site's sitemap (tests in Tasks 3 and 9).

---

### Task 1: Test harness and site settings

**Files:**
- Create: `vitest.config.ts`, `src/data/site.ts`, `src/lib/site.test.ts`
- Modify: `package.json` (scripts `test`, `test:watch`; devDeps `vitest@3.2.4`, `vite-tsconfig-paths@5.1.4`)
- Modify: `src/components/SiteFooter.tsx:55-62`, `src/components/Configurator.tsx:177`

**Interfaces:**
- Produces: `site` object (fields exactly as spec §1, plus `logo: "/icon.png"`); `absoluteUrl(path: string): string` exported from `src/data/site.ts`; `mailtoHref(subject?: string, body?: string): string`; `whatsappHref(): string`.

- [ ] **Step 1: Write the failing test** `src/lib/site.test.ts`

```ts
import { absoluteUrl, site, mailtoHref, whatsappHref } from "@/data/site";
test("url has no trailing slash", () => expect(site.url.endsWith("/")).toBe(false));
test("absoluteUrl joins once", () => {
  expect(absoluteUrl("/blog")).toBe(`${site.url}/blog`);
  expect(absoluteUrl("blog")).toBe(`${site.url}/blog`);
  expect(absoluteUrl("/")).toBe(`${site.url}/`);
});
test("mailto encodes", () =>
  expect(mailtoHref("A & B", "x\ny")).toBe(`mailto:${site.email}?subject=A%20%26%20B&body=x%0Ay`));
test("whatsapp link", () => expect(whatsappHref()).toBe(`https://wa.me/${site.whatsapp}`));
```

- [ ] **Step 2: Run** `npx vitest run src/lib/site.test.ts` — Expected: FAIL (cannot resolve `@/data/site`).
- [ ] **Step 3: Implement** `vitest.config.ts` (plugin `vite-tsconfig-paths`, `environment: "node"`, `globals: true`, include `src/**/*.test.ts`), `src/data/site.ts` with the placeholders from spec §1 marked `// PLACEHOLDER — required before launch`, and the three helpers. Replace the footer's hard-coded email/WhatsApp and the configurator's `mailto:` with the helpers.
- [ ] **Step 4: Run** `npm test` — Expected: 4 passed. `npm run build` — Expected: success.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: central site settings and vitest"`

---

### Task 2: Copy correction to exporter/supplier

**Files:**
- Create: `src/lib/copy.test.ts`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/components/SiteFooter.tsx`, `src/components/Configurator.tsx`, `src/data/products.ts` (every `summary`), `src/data/brands.ts` (comment)

**Interfaces:** none new.

- [ ] **Step 1: Write the failing test** — reads every file under `src/` (excluding `*.test.ts` and `hsn.json`) and asserts none matches:

```ts
const BANNED = [/made in india/i, /our factory/i, /\bwe build\b/i, /built in india/i, /built or sourced/i, /\bwe fit\b/i, /\bwound in\b/i, /built for your grid/i];
```

- [ ] **Step 2: Run** `npx vitest run src/lib/copy.test.ts` — Expected: FAIL listing the 11 matches.
- [ ] **Step 3: Rewrite** using spec §10's table. Exact strings: hero H1 `Matched to your grid`; hero sentence `Panels, transformers, RMUs and switchgear sourced from proven manufacturers to the voltage, standard and paperwork of the country they ship to.`; layout default title `GoodBiz · Electrical equipment sourced for your grid`; brands tile `We source the breakers, relays and meters your specification names, so spares and approvals stay simple on site.`; contractor band `…Tell us the project and the country; we source to match, arrange the certificates and ship it.`; footer `Sourced in India, shipped worldwide.`; plate header `Supplied by GoodBiz · Origin India`; plate intro `Your rating plate, as it would ship to {country.name}…`. Product summaries: describe the product and that partner manufacturers build it to the buyer's specification.
- [ ] **Step 4: Run** `npm test` (all pass) and the design inspector on `/` (`node <taste-skill>/scripts/inspect.mjs http://localhost:3010/`) — Expected: 0 FAIL (headline still ≤ 2 lines).
- [ ] **Step 5: Commit** `git commit -am "fix: copy reflects exporter and supplier role"`

---

### Task 3: Blog content library and contract

**Files:**
- Create: `src/lib/posts.ts`, `src/lib/posts.test.ts`, `src/lib/__fixtures__/posts/*.md` (fixtures below), `content/blog/README.md`
- Modify: `package.json` deps: `gray-matter@4.0.3`, `unified@11.0.5`, `remark-parse@11.0.0`, `remark-gfm@4.0.1`, `remark-rehype@11.1.2`, `rehype-slug@6.0.0`, `rehype-sanitize@6.0.0`, `rehype-stringify@10.0.1`

**Interfaces:**
- Produces (all from `src/lib/posts.ts`):
  - `type Faq = { q: string; a: string }` (re-exported for Tasks 6–8)
  - `type Post = { slug: string; title: string; description: string; date: string; updated?: string; author: string; tags: string[]; family?: string; countries?: string[]; cover?: string; coverAlt?: string; faq: Faq[]; draft: boolean; canonical?: string; html: string; headings: { id: string; text: string; depth: 2 | 3 }[]; readingMinutes: number }`
  - `class PostValidationError extends Error { file: string; field: string }`
  - `getAllPosts(opts?: { dir?: string; now?: Date; includeDrafts?: boolean }): Promise<Post[]>` — newest first; excludes `date > now` and (unless `includeDrafts`) `draft`. Default `dir` = `path.join(process.cwd(), "content/blog")`, default `includeDrafts` = `showDrafts()`.
  - `getPost(slug: string, opts?): Promise<Post | undefined>`
  - `getAllTags(opts?): Promise<{ tag: string; slug: string; count: number }[]>` — display name = first spelling seen; sorted by count desc.
  - `tagSlug(tag: string): string`
  - `showDrafts(): boolean`

Fixtures in `src/lib/__fixtures__/posts/`: `valid-post.md` (all fields, `##` × 3, a GFM table, `<script>alert(1)</script>` and `<a onclick="x">`), `draft-post.md` (`draft: true`), `future-post.md` (`date: 2099-01-01`), `syndicated.md` (`canonical: https://other.example/a`, tags `["Export Compliance"]`); `bad/missing-title.md` and `bad/bad-date.md` (`date: 19-10-2026`) in a separate `__fixtures__/posts-bad/` folder.

- [ ] **Step 1: Write the failing tests** (`now = new Date("2026-10-19")`):

```ts
test("lists published posts newest first", …) // slugs equal ["valid-post","syndicated"] in date order
test("drafts only with includeDrafts", …)      // includeDrafts:true adds "draft-post"
test("future posts hidden", …)                 // "future-post" absent even with includeDrafts
test("missing required field names file and field", async () => {
  await expect(getAllPosts({ dir: BAD })).rejects.toMatchObject({ name: "PostValidationError", field: "title" });
}); // and message contains "missing-title.md"
test("date must be YYYY-MM-DD", …)             // field "date", file "bad-date.md" (run with a dir containing only it)
test("strips raw html", …)                      // html contains neither "<script" nor "onclick"
test("renders gfm tables and heading ids", …)  // html contains "<table"; headings[0].id === slug of first ## text
test("tagSlug normalises", () => {
  expect(tagSlug("Export Compliance")).toBe("export-compliance");
  expect(tagSlug("HSN & customs")).toBe("hsn-customs");
  expect(tagSlug("  Transformers ")).toBe("transformers");
});
test("tags merge by slug", …)                  // "export compliance" and "Export Compliance" → one entry, count 2
test("reading time ≥ 1 minute at 220 wpm", …)
test("canonical kept", …)                       // syndicated.canonical === "https://other.example/a"
test("slug must match file-name pattern", …)    // a fixture "Bad Name.md" → PostValidationError field "slug"
```

- [ ] **Step 2: Run** `npx vitest run src/lib/posts.test.ts` — Expected: FAIL (module not found).
- [ ] **Step 3: Implement** with `gray-matter` for front matter, the unified chain `remark-parse → remark-gfm → remark-rehype (allowDangerousHtml: false) → rehype-slug → rehype-sanitize (defaultSchema, allow id on h2/h3) → rehype-stringify`; collect h2/h3 from the hast tree; validate each field against the spec §2 table; `canonical` must be an absolute `https://` URL. `gray-matter` parses YAML dates into `Date` — normalise to `YYYY-MM-DD` before validating.
- [ ] **Step 4: Write** `content/blog/README.md`: the spec §2 table, the `canonical` row, the slug rule, "add file → commit → host rebuilds", "future dates need a daily rebuild hook", an example file.
- [ ] **Step 5: Run** `npm test` — Expected: all pass.
- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: markdown blog content library"`

---

### Task 4: Blog pages, RSS and starter drafts

**Files:**
- Create: `src/lib/feed.ts`, `src/lib/feed.test.ts`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/tag/[tag]/page.tsx`, `src/app/feed.xml/route.ts`, `src/components/PostList.tsx`, `src/components/ArticleBody.tsx`
- Create content: `content/blog/hsn-codes-electrical-panels-switchgear.md`, `content/blog/certificates-by-country-electrical-equipment.md`, `content/blog/oil-filled-vs-dry-type-transformer-export.md` (all `draft: true`, `author: GoodBiz`, each with `faq` × 3 and `family`/`countries` links)
- Modify: `src/components/SiteHeader.tsx` (nav "Blog"), `src/components/SiteFooter.tsx` ("Blog" under For buyers), `src/app/globals.css` (blog styles, tokens only)

**Interfaces:**
- Consumes: `getAllPosts`, `getPost`, `getAllTags`, `tagSlug`, `showDrafts`, `Post` (Task 3); `site`, `absoluteUrl` (Task 1).
- Produces: `buildRss(posts: Post[]): string` (latest 30, RSS 2.0, `<link>` = canonical or absoluteUrl, `<guid isPermaLink="true">`, `<pubDate>` RFC 822, XML-escaped title/description); `PostList({ posts }: { posts: Post[] })`; `ArticleBody({ post }: { post: Post })`.

- [ ] **Step 1: Write the failing test** `feed.test.ts`: escapes `&`/`<` in titles; ≤ 30 items; first item is newest; syndicated post's `<link>` equals its canonical; empty input yields a valid channel with zero `<item>`.
- [ ] **Step 2: Run** `npx vitest run src/lib/feed.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** `buildRss`; `feed.xml/route.ts` with `export const dynamic = "force-static"` returning `content-type: application/rss+xml; charset=utf-8`.
- [ ] **Step 4: Build the pages.** `/blog`: H1 `Notes for buyers`, one-sentence intro, tag links (`/blog/tag/<slug>`), `PostList` as banded rows like the product explorer (date, title, description, reading time, primary tag); designed empty state `No posts yet. The first one is on its way.` with a link to `/products#hsn`. `/blog/[slug]`: `generateStaticParams` from `getAllPosts()`, `notFound()` otherwise; title, dates (`Published`/`Updated`), author, reading time, cover (`next/image` only for local paths, plain `<img>` for absolute URLs), table of contents when ≥ 3 h2, body, FAQ (Task 6's `FaqList` — until then render a plain `<dl>`), related block (family page and configurator `?family=`; country links are added in Task 7), previous/next. Drafts render a "Draft" label and `robots: { index: false }`. `/blog/tag/[tag]`: lists posts for that slug; `robots.index = count >= 2`.
- [ ] **Step 5: Write the three starter posts** per spec §11, facts taken only from `src/data/hsn.json`, `products.ts` and `countries.ts`; no manufacturing claims; post 2 says GoodBiz arranges the certificate with the shipment.
- [ ] **Step 6: Run** `npm test`, `npm run build` (Expected: `/blog`, `/feed.xml` static; with `SHOW_DRAFTS=1 npm run build` the three posts appear in the route list), then `npm run dev` and inspect `/blog` and one post with the design inspector — Expected: 0 FAIL.
- [ ] **Step 7: Commit** `git add -A && git commit -m "feat: blog index, articles, tags, RSS and starter drafts"`

---

### Task 5: Metadata helper, share images and icons

**Files:**
- Create: `src/lib/meta.ts`, `src/lib/meta.test.ts`, `src/app/opengraph-image.tsx`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`, `src/app/products/[slug]/opengraph-image.tsx`, `scripts/check-meta.mjs`
- Modify: `src/app/layout.tsx` (`metadataBase: new URL(site.url)`, `verification.google` when set, default OG/twitter), every `page.tsx` (`metadata`/`generateMetadata` via `pageMeta`), `package.json` script `check:meta`

**Interfaces:**
- Consumes: `site`, `absoluteUrl`.
- Produces: `pageMeta(input: { title: string; description: string; path: string; image?: string; noindex?: boolean; canonical?: string; type?: "website" | "article"; publishedTime?: string; modifiedTime?: string }): Metadata` — sets `title`, `description`, `alternates.canonical` (= `canonical ?? path`), `openGraph` (url, siteName `site.name`, locale `en`, type, images), `twitter.card = "summary_large_image"`, `robots` (`noindex` → `{ index: false, follow: true }`).

- [ ] **Step 1: Write the failing tests:** canonical defaults to `path`; explicit `canonical` wins; `noindex` sets `robots.index === false`; `type: "article"` carries `publishedTime`; throws `RangeError` when description length is outside 120–160 or equals title.
- [ ] **Step 2: Run** `npx vitest run src/lib/meta.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** `pageMeta`; apply to every route with hand-written descriptions (home, products, configurator, blog, export index) and generated ones (family: `summary` + `HSN {first}–{last}`, trimmed to ≤ 160 at a word boundary; post: front-matter `description`; tag: `Guides and notes on {tag} for buyers of electrical equipment exported from India: HSN codes, standards, certificates and shipping.` trimmed to ≤ 160 at a word boundary). Country pages call `pageMeta` themselves in Task 7.
- [ ] **Step 4: Implement** share images with `ImageResponse` 1200×630: `--bg` ground, seafoam circle pair (the motif) at right, page title in General Sans 700 (fetch the font file from Fontshare at build; fall back to system sans if the fetch fails), wordmark bottom-left. `icon.tsx` 32×32 and `apple-icon.tsx` 180×180 draw the two-circle motif in `--action` on `--bg`. Delete `src/app/favicon.ico`.
- [ ] **Step 5: Implement** `scripts/check-meta.mjs`: after `next build`, read every `.next/server/app/**/*.html`, extract `<title>` and `<meta name="description">`, print and exit 1 on: missing description, length outside 120–160, duplicate title, duplicate description, missing `rel="canonical"`.
- [ ] **Step 6: Run** `npm test && npm run build && npm run check:meta` — Expected: all pass, check prints `OK n pages`.
- [ ] **Step 7: Commit** `git add -A && git commit -m "feat: per-page metadata, share images and icons"`

---

### Task 6: Structured data and answer blocks

**Files:**
- Create: `src/lib/jsonld.ts`, `src/lib/jsonld.test.ts`, `src/components/JsonLd.tsx`, `src/components/FaqList.tsx`
- Modify: `src/data/products.ts` (`faq: Faq[]` on `Family`, 4–6 per family), `src/app/layout.tsx`, `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/components/HsnFinder.tsx` (FAQ block + "Last updated 19 October 2026"), `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/globals.css` (`details`/`summary` styles)

**Interfaces:**
- Consumes: `site`, `absoluteUrl`, `Family`, `Post`, `Faq`, `hsn.json` entries.
- Produces (pure functions returning plain objects with `@context` only on the top-level graph):
  - `organizationLd(): object`, `websiteLd(): object`
  - `breadcrumbLd(items: { name: string; path: string }[]): object`
  - `familyLd(fam: Family): object` — `ItemList` of `Product`
  - `familiesListLd(): object`, `hsnTermSetLd(entries: { code: string; description: string; product: string }[]): object`
  - `faqLd(faq: Faq[]): object | null` (null when empty)
  - `blogPostingLd(post: Post): object`, `blogLd(posts: Post[]): object`
  - `countryPageLd(c: Country, path: string): object` (Task 7 calls it)
  - `JsonLd({ data }: { data: object | (object | null)[] })` — renders one `<script type="application/ld+json">` with `JSON.stringify` and `<` escaped as `<`.
  - `FaqList({ faq, title }: { faq: Faq[]; title?: string })` — `<details>`/`<summary>` list, default title `Questions buyers ask`.

- [ ] **Step 1: Write the failing tests:**

```ts
test("products carry no brand or manufacturer", () => {
  const s = JSON.stringify(familyLd(families[0]));
  expect(s).not.toMatch(/"brand"|"manufacturer"|"aggregateRating"|"review"|"price"/);
});
test("offers name GoodBiz as seller", …)        // every Product.offers.seller.name === site.name
test("HSN appears as additionalProperty", …)    // propertyID "HSN" value equals variant.hsn
test("organization describes an exporter", …)   // description matches /export/i and not /manufactur/i
test("blogPosting author is Organization when author === site.name, else Person", …)
test("blogPosting uses canonical for mainEntityOfPage when set", …)
test("faqLd returns null for empty and Question/Answer pairs otherwise", …)
test("JsonLd escapes </script>", …)             // render to string; output lacks "</script><"
test("every family has 4–6 FAQs answered in ≤ 3 sentences", …)
```

- [ ] **Step 2: Run** `npx vitest run src/lib/jsonld.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** the builders and components; write the per-family FAQs (direct answer first, includes rating, standard and HSN from the same family's data; no manufacturing claims).
- [ ] **Step 4: Wire** per the spec §6 table: Organization + WebSite in layout; BreadcrumbList on every non-home route; `familyLd` + `faqLd` + `FaqList` on family pages; `familiesListLd` + `hsnTermSetLd` + HSN FAQ on `/products`; `blogLd` on `/blog`; `blogPostingLd` + `faqLd` + `FaqList` on posts (replacing Task 4's `<dl>`).
- [ ] **Step 5: Run** `npm test && npm run build`; then in the browser pane, on `/`, `/products/lt-panels` and a draft post (dev server), run `JSON.parse` on every `script[type="application/ld+json"]` — Expected: all parse, no errors in the console.
- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: structured data and FAQ answer blocks"`

---

### Task 7: Country export pages

**Files:**
- Create: `src/lib/countries.ts`, `src/lib/countries.test.ts`, `src/app/export/page.tsx`, `src/app/export/[country]/page.tsx`
- Modify: `src/components/Configurator.tsx` (read `?country=<ISO>`), `src/components/SiteFooter.tsx` ("Countries we ship to" → `/export`), `src/app/blog/[slug]/page.tsx` (country links), `src/app/globals.css`

**Interfaces:**
- Consumes: `countries`, `Country`, `families`, `Faq`, `countryPageLd`, `faqLd`, `breadcrumbLd`, `JsonLd`, `FaqList`, `pageMeta`.
- Produces: `countrySlug(c: Country): string`; `getCountryBySlug(slug: string): Country | undefined`; `countryFaq(c: Country): Faq[]` (4 items: voltage/frequency, standards, certificate — stating GoodBiz arranges it, design ambient); `familyLineFor(c: Country, fam: Family): string` (one sentence naming the family with that country's rated voltage, frequency and standard); `countryDescription(c: Country): string` (120–160 chars).

- [ ] **Step 1: Write the failing tests:** `countrySlug` gives `saudi-arabia`, `united-arab-emirates`, `united-states`; all slugs unique; `getCountryBySlug("nigeria")?.code === "NG"`; `countryFaq(SA)` has 4 entries and one answer contains `SASO / SABER certificate` and `arrange`; no FAQ answer matches `/manufactur|our factory/i`; `countryDescription` length in 120–160 for every country; `familyLineFor(NG, transformers)` contains `50 Hz`.
- [ ] **Step 2: Run** `npx vitest run src/lib/countries.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** the helpers, then the pages. `/export/[country]`: H1 `Electrical equipment for {name}` (≤ 2 lines at 390px; for long names use `Equipment for {name}`), grid facts as a definition list in a seafoam field, all eight families via `familyLineFor` linking to family pages, `FaqList`, a "typical values, your specification wins" note, CTA `/configurator?country={code}`, "Last updated 19 October 2026". `/export`: countries grouped by region. Configurator: on mount, if `country` matches a code, apply `fromCountry(code)`. Blog article related block: add links to `/export/{countrySlug}` for each code in `post.countries`.
- [ ] **Step 4: Run** `npm test && npm run build && npm run check:meta`; inspect `/export/saudi-arabia` with the design inspector — Expected: 0 FAIL on headline lines and body size; `/configurator?country=NG` plate shows `SONCAP certificate`.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: country export pages"`

---

### Task 8: Sitemap, robots and llms.txt

**Files:**
- Create: `src/lib/sitemap.ts`, `src/lib/robots.ts`, `src/lib/llms.ts`, `src/lib/discovery.test.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`

**Interfaces:**
- Consumes: `getAllPosts`, `getAllTags`, `families`, `countries`, `countrySlug`, `hsn.json`, `site`, `absoluteUrl`.
- Produces:
  - `sitemapEntries(input: { posts: Post[]; tags: { slug: string; count: number }[] }): MetadataRoute.Sitemap` — static routes, families, countries, `/export`, `/blog`, posts **without** `canonical` (`lastModified` = `updated ?? date`), tags with `count >= 2`.
  - `AI_BOTS: readonly string[]` = `["GPTBot","OAI-SearchBot","ChatGPT-User","PerplexityBot","ClaudeBot","Claude-Web","Google-Extended","Applebot-Extended","Bingbot"]`; `robotsConfig(): MetadataRoute.Robots` (allow `/` for `*` and each bot, `sitemap: absoluteUrl("/sitemap.xml")`, `host: site.url`).
  - `buildLlmsTxt(posts: Post[]): string` (llmstxt.org format: `# GoodBiz`, `> one-line summary`, sections Products, Countries, Guides, Contact) and `buildLlmsFullTxt(): string` (families with every variant's rating, standard and HSN; all countries' grid facts).

- [ ] **Step 1: Write the failing tests:** sitemap excludes a post with `canonical`, excludes drafts (they are never passed in), excludes a tag with count 1, includes `/export/saudi-arabia`, all URLs start with `site.url`; robots lists every `AI_BOTS` entry with `allow: "/"` and the sitemap URL; llms.txt starts with `# GoodBiz`, contains `85371000` in the full file only, contains no `/manufactur/i`.
- [ ] **Step 2: Run** `npx vitest run src/lib/discovery.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** the libs and the four route files (`dynamic = "force-static"`, `text/plain; charset=utf-8` for the llms routes).
- [ ] **Step 4: Run** `npm test && npm run build`; `curl -s localhost:3010/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/feed.xml` on `npm start` — Expected: 200 for each, sitemap lists country and family URLs.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: sitemap, robots and llms.txt"`

---

### Task 9: Final verification and hand-off

**Files:**
- Modify: `content/blog/README.md` (launch checklist), `docs/superpowers/specs/2026-10-19-blog-seo-aeo-geo-design.md` (nothing unless a deviation was made; record it)

- [ ] **Step 1: Run** `npm test && npm run build && npm run check:meta` — Expected: all green.
- [ ] **Step 2: Add a new post** `content/blog/zz-smoke.md` with valid front matter, rebuild — Expected: appears at `/blog/zz-smoke`, in `/feed.xml`, `/sitemap.xml`, `/llms.txt`. Break its `date`, rebuild — Expected: build fails naming `zz-smoke.md` and `date`. Delete the file.
- [ ] **Step 3: Inspect** `/`, `/blog`, a post (dev, drafts shown), `/export/saudi-arabia`, `/products/transformers` with the design inspector — Expected: 0 FAIL each.
- [ ] **Step 4: Append the launch checklist** to `content/blog/README.md`: fill every `PLACEHOLDER` in `src/data/site.ts`; review and un-draft the three starter posts; set up a daily rebuild hook; submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools; set `googleSiteVerification`; run Google's Rich Results Test on a family page, a post and a country page.
- [ ] **Step 5: Commit** `git add -A && git commit -m "docs: launch checklist"`
