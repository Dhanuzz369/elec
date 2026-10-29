# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/about`, a page that proves GoodBiz Power Systems' 25 years of licensed EPC work for BESCOM, public discoms and KPTCL, and shows which products each kind of project needs, then link it from the rest of the site.

**Architecture:**
- Project-type content lives in `src/data/projects.ts`, next to `products.ts`.
- The page is a server component (`src/app/about/page.tsx`). Its one interactive part is a client component (`src/components/about/ProjectTypes.tsx`) that always renders all four project panels in the HTML.
- `@media (scripting: enabled)` stacks the panels in one grid cell and shows the tablist. Without JS, the panels flow one after another, the same pattern the quote form uses.
- Discovery (sitemap, llms, JSON-LD) is built from the same data.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, plain CSS in `src/app/globals.css`, Vitest 3, Playwright 1.64 (`phone` and `desktop` projects).

**Spec:** `docs/superpowers/specs/2026-10-29-about-page-design.md`. The approved mockup of the centrepiece is `../.superpowers/brainstorm/82769-1793256722/content/projects-v2.html`, relative to the repo root. Its CSS and motion values are the reference.

## Global Constraints

- **Naming.** Every "GoodBiz" in `src/` is followed by " Power Systems". `src/lib/copy.test.ts` enforces this. Never write "GoodBiz's" or a bare "GoodBiz".
- **No manufacturing claims.** No copy may claim GoodBiz Power Systems manufactures. The existing `BANNED` list in `src/lib/copy.test.ts` applies to all new files, and includes `/\bwe build\b/` and `/our factory/`.
- **No invented proof.** Use only the claims below:
  - 25+ years in power distribution;
  - GoodBiz Power Systems and its group companies hold EPC licences;
  - licensed EPC contractor for BESCOM and other public discoms, and served KPTCL;
  - project types: apartments, commercial, IT parks, industries;
  - tests before shipping; drawings, test reports and export paperwork; one consolidated shipment; one point of contact;
  - does not manufacture, and sources from partner manufacturers.
  - No counts, client names, certifications or reply-time promises.
- **Look.** Use the existing tokens (`--bg`, `--ink`, `--action`, `--accent`, `--line`, `--surface`, `--surface-2`, `--field-1`, `--muted`, `--ease-out`, `--ease-in-out`, `--step-*`, `--margin`, `--section`) and **square corners**.
- **Motion.**
  - Animate only `transform`, `opacity`, `filter` and `clip-path`.
  - Gate hover effects behind `@media (hover: hover) and (pointer: fine)`.
  - Under `prefers-reduced-motion: reduce`, keep only opacity fades.
- **Photos.** Only CC0 or public-domain photos, and never captioned as GoodBiz projects. No credit is shown on the site.
- **Dependencies.** None added.
- **Meta description.** 120–160 characters, because `npm run check:meta` enforces it.

## Review Focus

1. **Rapid clicks.** Clicking tabs quickly, mid-transition, must end with exactly the last-clicked panel visible and interactive. Every other panel must be `inert` and hidden from assistive tech.
2. **Phone width.** At 375px the tab row scrolls sideways inside itself, and the page itself never scrolls sideways. The header with the new "About" link still fits.
3. **Without JS.** All four panels, with photo, cards and watch list, are visible in order, and no tab buttons show.
4. **Keyboard.** Arrow keys move selection and focus, and Tab leaves the tablist straight into the active panel. Hidden panels' links are unreachable.
5. **Copy guards.** The new page passes the naming test and the manufacturing ban, and the new `BANNED` patterns don't flag "We don't manufacture" or "India's manufacturers".

---

### Task 0: Branch

- [ ] **Step 1: Create the branch**

```bash
git checkout -b about-page
```

---

### Task 1: Project data, photos and image record

**Files:**
- Create: `src/data/projects.ts`
- Create: `public/images/projects/{apartments,commercial,it-parks,industries}.webp`
- Modify: `assets/credits.json` (append four entries)
- Test: `src/data/projects.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ProjectNeed = { name: string; image?: string; href?: string };
  export type ProjectType = {
    id: "apartments" | "commercial" | "it-parks" | "industries";
    name: string;
    summary: string;
    photo: { src: string; width: number; height: number };
    needs: ProjectNeed[];   // 5 each
    watch: string[];        // 3 each
  };
  export const projectTypes: ProjectType[];
  ```

- [ ] **Step 1: Write the failing test** `src/data/projects.test.ts`

```ts
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { families } from "@/data/products";
import { projectTypes } from "@/data/projects";

const pub = (src: string) => path.join(process.cwd(), "public", src);

test("four project types in page order", () => {
  expect(projectTypes.map((p) => p.id)).toEqual(["apartments", "commercial", "it-parks", "industries"]);
  for (const p of projectTypes) {
    expect(p.needs).toHaveLength(5);
    expect(p.watch).toHaveLength(3);
  }
});

test("every photo exists and every link goes to a real product family", () => {
  const slugs = families.map((f) => `/products/${f.slug}`);
  for (const p of projectTypes) {
    expect(existsSync(pub(p.photo.src))).toBe(true);
    for (const n of p.needs) {
      if (n.image) expect(existsSync(pub(n.image))).toBe(true);
      if (n.href) expect(slugs).toContain(n.href);
    }
  }
});

test("project photos are free to use without credit", () => {
  const credits = JSON.parse(readFileSync(path.join(process.cwd(), "assets/credits.json"), "utf8")) as {
    file: string; license: string; creditRequired: boolean;
  }[];
  for (const p of projectTypes) {
    const c = credits.find((x) => x.file === `public${p.photo.src}`);
    expect(c?.license).toMatch(/^(CC0|Public domain)$/);
    expect(c?.creditRequired).toBe(false);
  }
});

test("watch lines are not India-only rules", () => {
  expect(JSON.stringify(projectTypes)).not.toMatch(/BESCOM|KPTCL|discom/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/data/projects.test.ts`
Expected: FAIL, because it cannot resolve `@/data/projects`.

- [ ] **Step 3: Fetch and convert the four photos**

All four are CC0 Unsplash imports on Wikimedia Commons.

```bash
mkdir -p public/images/projects && T=$(mktemp -d)
B=https://upload.wikimedia.org/wikipedia/commons/thumb
UA="GoodBizSite/1.0 (power@goodbizglobal.com)"
curl -sA "$UA" -o $T/a.jpg "$B/7/78/Modern_apartment_building_%28Unsplash%29.jpg/1920px-Modern_apartment_building_%28Unsplash%29.jpg"
curl -sA "$UA" -o $T/c.jpg "$B/2/2f/Office_buildings_under_clouds_%28Unsplash%29.jpg/1920px-Office_buildings_under_clouds_%28Unsplash%29.jpg"
curl -sA "$UA" -o $T/i.jpg "$B/e/e9/Office_bridge_%28Unsplash%29.jpg/1920px-Office_bridge_%28Unsplash%29.jpg"
curl -sA "$UA" -o $T/n.jpg "$B/b/bf/Heavy_industry_%28Unsplash%29.jpg/1920px-Heavy_industry_%28Unsplash%29.jpg"
for p in a:apartments c:commercial i:it-parks n:industries; do cwebp -quiet -q 78 -resize 1600 0 $T/${p%%:*}.jpg -o public/images/projects/${p#*:}.webp; done
sips -g pixelWidth -g pixelHeight public/images/projects/*.webp
```

Expected: four files, each 1600px wide. Note each height for `photo.height`.

Append four entries to `assets/credits.json` in the existing shape. Use the exact values:
- `file`: `"public/images/projects/<name>.webp"`
- `license`: `"CC0"`
- `creditRequired`: `false`
- `via`: `"Wikimedia Commons (Unsplash)"`
- `page`: the Commons file page, `https://commons.wikimedia.org/wiki/File:<title>`
- `credit`: `null`

- [ ] **Step 4: Write `src/data/projects.ts`**

Use the content of the mockup's `P` array, with these exact values. Product images are `/images/products/<file>.webp`.

| id / name | summary | needs: name → image, href |
|---|---|---|
| `apartments` / Residential apartments | Hundreds of homes on one supply: safe, metered and quiet. | RMU or compact substation → enc-outdoor-grp-kiosk, mv-switchgear-rmu · Distribution transformer → transformer-oil-onan, transformers · Metering cabinet → enclosure-metering-cabinet, enclosures-junction-boxes · Generator changeover (ATS) → lt-ats-changeover, lt-panels · Floor distribution boards → lt-distribution-board, lt-panels |
| `commercial` / Commercial buildings | Offices, malls and hotels where tenants change and loads grow. | Dry-type transformer → transformer-dry-cast-resin, transformers · PCC with ACB incomers → lt-pcc-acb-incomers, lt-panels · APFC panel → (no image), lt-panels · Sub-distribution boards → enclosure-modular-distribution, enclosures-junction-boxes · Changeover (ATS) → lt-ats-changeover, lt-panels |
| `it-parks` / IT parks | Campuses that run day and night, where a minute down costs more than the panel. | RMUs in a ring → (no image), mv-switchgear-rmu · Dry-type transformers → transformer-dry-cast-resin, transformers · PCC with dual incomers → lt-pcc-acb-incomers, lt-panels · Automatic changeover → lt-ats-changeover, lt-panels · Busbars and supports → busbars-copper-supports, parts |
| `industries` / Industries | Motors, heat and dust: equipment that has to survive the shop floor. | Power transformer → transformer-power-onaf, transformers · MCC with draw-out feeders → lt-mcc-drawout-feeders, lt-panels · PLC automation panel → lt-plc-panel-hmi, lt-panels · APFC panel → (no image), lt-panels · IP-rated enclosures → enclosure-multi-section-lineup, enclosures-junction-boxes |

Watch lines, three per type:

- **apartments**
  - Metering approved by your utility, for every flat
  - Small electrical rooms: compact gear that fits
  - Safe, low-noise equipment close to homes
- **commercial**
  - Power-factor penalties on the electricity bill
  - Spare capacity for future tenants
  - Maintenance without shutting floors down
- **it-parks**
  - Redundancy at every level, with no single point of failure
  - Harmonics from UPS and IT loads
  - Separate metering for every tenant
- **industries**
  - Motor starting currents and drive loads
  - Dust, heat and moisture: the right IP rating
  - Spares and serviceability to keep lines running

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/data/projects.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/data/projects.ts src/data/projects.test.ts public/images/projects assets/credits.json
git commit -m "feat(about): project types data and CC0 project photos"
```

---

### Task 2: The About page and the project-type tabs

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/components/about/ProjectTypes.tsx`
- Modify: `src/app/globals.css`. Append an `/* ---------- About ---------- */` section with classes prefixed `ap-`, because `.about` already exists on the home page.
- Test: `e2e/about.spec.ts`

**Interfaces:**
- Consumes: `projectTypes`, `ProjectType` (Task 1); `TransformerSymbol` from `@/components/Motif`; `pageMeta` from `@/lib/meta`; `whatsappHref` and `site` from `@/data/site`; `JsonLd` and `breadcrumbLd`.
- Produces:
  - `<ProjectTypes />`, which takes no props.
  - DOM hooks the tests rely on:
    - the section `data-testid="project-types"`;
    - each panel `<article data-project="<id>">`, carrying `data-active` when selected;
    - tabs with `role="tab"` and an accessible name equal to the project name.

- [ ] **Step 1: Write the failing browser tests** `e2e/about.spec.ts`

```ts
import { expect, test } from "@playwright/test";

const panels = (page) => page.locator("[data-project]");
const active = (page) => page.locator("[data-project][data-active]");

test("the About page has its six sections", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("25 years");
  for (const h of ["Utility work is the hardest school there is", "Every project needs different power.",
    "Everything your installation needs, from one partner", "Tailored, not off the shelf", "Tell us about your project"])
    await expect(page.getByRole("heading", { name: h })).toBeVisible();
});

test("choosing a project type shows its panel only", async ({ page }) => {
  await page.goto("/about");
  await expect(active(page)).toHaveAttribute("data-project", "apartments");
  for (const [name, id] of [["IT parks", "it-parks"], ["Industries", "industries"], ["Commercial buildings", "commercial"]]) {
    await page.getByRole("tab", { name }).click();
    await expect(active(page)).toHaveAttribute("data-project", id);
    await expect(active(page).locator("img").first()).toBeVisible();
  }
  await expect(page.locator("[data-project]:not([data-active])[inert]")).toHaveCount(3);
});

test("rapid clicks end on the last choice", async ({ page }) => {
  await page.goto("/about");
  for (const name of ["Industries", "IT parks", "Commercial buildings", "Industries"]) await page.getByRole("tab", { name }).click();
  await expect(active(page)).toHaveAttribute("data-project", "industries");
  await expect(active(page)).toHaveCount(1);
});

test("arrow keys move between project types", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("tab", { name: "Residential apartments" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Commercial buildings" })).toBeFocused();
  await expect(active(page)).toHaveAttribute("data-project", "commercial");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(active(page)).toHaveAttribute("data-project", "industries");
});

test("the page fits a phone without sideways scrolling", async ({ page }) => {
  await page.goto("/about");
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("all four project types show in full", async ({ page }) => {
    await page.goto("/about");
    await expect(panels(page)).toHaveCount(4);
    for (const p of await panels(page).all()) {
      await expect(p).toBeVisible();
      await expect(p.locator("img").first()).toBeVisible();
    }
    await expect(page.getByRole("tab")).toHaveCount(0);
  });
});
```

Without JS, the tabs have to be invisible to `getByRole`. They are hidden with `display: none` under `@media (scripting: none)`, which removes them from the accessibility tree.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx playwright test e2e/about.spec.ts`
Expected: FAIL on every test, because `/about` returns 404.

- [ ] **Step 3: Write `src/components/about/ProjectTypes.tsx`** (`"use client"`)

Behaviour is fixed by the tests and the mockup:
- The state is `active: number`, defaulting to 0. The server renders `data-active` on panel 0.
- **Tablist.** A `<div role="tablist" aria-label="Project types">` holds one button per type. Each button has:
  - `role="tab"`, `id="tab-<id>"`, `aria-controls="panel-<id>"` and `aria-selected`;
  - `tabIndex` set to 0 for the active tab and -1 for the others;
  - content: a `0N` number, the name, and an `→` arrow with `aria-hidden`.
- **Arrow keys.** ArrowRight and ArrowDown go to the next tab, ArrowLeft and ArrowUp to the previous one, wrapping round. Each move selects that type and focuses its tab. `preventDefault` is called on these keys.
- **Highlight.** The clip-path highlight is a duplicate of the list in active colours with `aria-hidden` and `inert`, clipped to the active row as in the mockup. Its `--t`, `--rh` and `--h` are measured from the active tab's `offsetTop` / `offsetHeight` in a layout effect after `active` changes.
- **Panels.** Each panel is `<article id="panel-<id>" role="tabpanel" aria-labelledby="tab-<id>" data-project={id}>`. Non-active panels get `data-active` removed and `inert`. Without JS no panel is inert, because `inert` is set only after hydration. Use a `hydrated` state flag that flips in `useEffect`.
- **Inside each panel:**
  - the photo: `next/image` with `fill`, `sizes="(max-width: 860px) 100vw, 840px"` and empty `alt`; `priority` only for the first;
  - a caption with `<h3>` name and `<p>` summary;
  - "What it typically needs": `<ul>` of cards. Each card shows a `next/image` product photo, or `TransformerSymbol` in the thumb when there's no image, plus the name. The whole card is a `<Link>` when `href` is set;
  - "What we watch for": a `<ul>` of the watch lines;
  - a `<Link href="/quote" className="btn">`: "Get a quote for this project".
- **Stagger.** Card and watch-line stagger uses `style={{ "--i": k }}`. It plays when a panel gains `data-active`, via CSS on `[data-active] li`, so no extra JS is needed.

- [ ] **Step 4: Write `src/app/about/page.tsx`**

Metadata:
```ts
export const metadata = pageMeta({
  title: "About us",
  description: "GoodBiz Power Systems: 25+ years as a licensed EPC contractor for BESCOM, public discoms and KPTCL. One-stop supply, RMU to enclosure, for projects worldwide.",
  path: "/about",
});
```

Sections, using `data-reveal` / `data-stagger` like the home page. This is the exact copy:

1. **Opening (`<h1>`).**
   - Eyebrow: "About GoodBiz Power Systems".
   - Headline: "25 years building India's power network. Now we supply yours."
   - Paragraph 1: "For more than 25 years, GoodBiz Power Systems and its group companies have worked as licensed EPC contractors for BESCOM and other public distribution companies, and on projects for KPTCL, Karnataka's transmission utility. That work taught us which panel, which switchgear and which brand holds up on a real site, inspected to a utility's standard."
   - Paragraph 2: "We bring that judgment to buyers worldwide: one partner for everything from the RMU to the last enclosure."
   - Facts `<dl>`:
     - 25+ / years in power distribution
     - Licensed EPC / for BESCOM and public discoms
     - KPTCL / transmission projects
     - One stop / RMU to enclosure, one order
2. **Our story (`<h2>` "Utility work is the hardest school there is").**
   - Paragraph 1: "A distribution company doesn't accept close enough. Every RMU, transformer and panel we installed for BESCOM and the other discoms had to meet their specification, pass their inspection and keep running for decades. Across apartment complexes, commercial buildings, IT parks and industrial plants, we learned what fails in the field, which brands hold their ratings, and how to put a whole installation together so it works on day one."
   - Paragraph 2: "Buyers abroad now get the same judgment. We tell you what to buy and why, then supply all of it."
3. **`<ProjectTypes />`.** Its section head: eyebrow "Right product for your project", `<h2>` "Every project needs different power.", and the lead "An apartment block, an IT park and a steel plant don't need the same panels, the same transformer or the same brand. After 25 years on BESCOM and KPTCL sites, we know what each one needs, and we'll put it together for yours."
4. **One stop (`<h2>` "Everything your installation needs, from one partner").**
   - A range list. Each item links to its product family where one exists:
     - RMUs and MV switchgear → mv-switchgear-rmu
     - Transformers → transformers
     - LT panels (PCC, MCC) → lt-panels
     - Automation and PLC panels → lt-panels
     - APFC and ATS panels → lt-panels
     - Breakers and contactors → breakers-contactors
     - Enclosures and junction boxes → enclosures-junction-boxes
     - Busbars and parts → parts
   - Then the paragraph: "We don't manufacture, and that's deliberate. We aren't tied to one factory, so we recommend the brand and build that suit your project, from manufacturers whose products we've installed on utility and private projects."
5. **How we work (`<h2>` "Tailored, not off the shelf").** An `<ol>` with these six steps:
   1. Understand: your site, load, standards and budget.
   2. Recommend: the right products and brands, and why.
   3. Source: from partner manufacturers, built to your specification.
   4. Inspect and test: every order is tested before it ships.
   5. Document: drawings, test reports and export paperwork.
   6. Ship: one consolidated shipment to your port or site.
6. **Ending (`<h2>` "Tell us about your project").**
   - Text: "We'll recommend the right products and send you a quote."
   - Buttons: `<Link href="/quote" className="btn">Get a quote</Link>` and `<a href={whatsappHref()} className="btn btn--quiet">WhatsApp us</a>`.

Also add `<JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About us", path: "/about" }])} />`. Task 3 adds the AboutPage node.

- [ ] **Step 5: Add the CSS**

Port the mockup's `.proj` / `.stage` / `.tabs` / `.tab-fill` / `.photo` / `.detail` / `.needs` / `.watch` rules into `ap-` classes. Keep these values:
- clip-path wipe: 320ms `--ease-in-out`;
- photo: opacity 420ms, transform 900ms, filter 420ms, all `--ease-out`, going from `scale(1.04)` with `blur(4px)` to `scale(1)` with `blur(0)`;
- stagger: 300ms per item, delay `--i * 45ms`;
- press: `scale(.98)` on tabs, `scale(.97)` on buttons.

Panel stacking: inside `@media (scripting: enabled)`, `.ap-panels` is `display: grid` and every panel takes `grid-area: 1 / 1`. Non-active panels get `opacity: 0; pointer-events: none`. Inside `@media (scripting: none)`, `.ap-tabs` is `display: none`, and the panels stack vertically with a gap.

At ≤860px:
- the tabs become an `overflow-x: auto` row with negative side margins equal to `--margin`;
- the highlight duplicate is hidden, and the selected tab is filled `--action`;
- the photo goes to `aspect-ratio: 4/3`;
- the detail block becomes one column.

The other sections reuse existing patterns where they exist: `.btn`, `.btn--quiet`, `.link`, `--step-*`.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx playwright test e2e/about.spec.ts`
Expected: PASS, 6 tests × 2 projects = 12.

Then run `npx vitest run src/lib/copy.test.ts`.
Expected: PASS, so the new copy obeys the naming test and the manufacturing ban.

- [ ] **Step 7: Commit**

```bash
git add src/app/about src/components/about src/app/globals.css e2e/about.spec.ts
git commit -m "feat(about): About page with project-type tabs"
```

---

### Task 3: Search and AI discovery

**Files:**
- Modify: `src/lib/sitemap.ts` (add `page("/about", 0.8)` after `/quote`)
- Modify: `src/lib/llms.ts`
- Modify: `src/lib/jsonld.ts` (new `aboutPageLd()`; extend `knowsAbout`)
- Modify: `src/app/about/page.tsx` (render `aboutPageLd()`)
- Test: `src/lib/discovery.test.ts`, `src/lib/jsonld.test.ts`

**Interfaces:**
- Consumes: `projectTypes` (Task 1).
- Produces: `aboutPageLd(): Node`, which returns `{ "@type": "AboutPage", "@id": absoluteUrl("/about") + "#page", url: absoluteUrl("/about"), name: "About us", isPartOf: { "@id": SITE_ID }, mainEntity: orgRef }`.

- [ ] **Step 1: Write the failing tests**

In `discovery.test.ts`, add `"/about"` to the list in "sitemap covers products, countries and core pages", and add:

```ts
test("llms.txt points to the About page with the track record", () => {
  const txt = buildLlmsTxt([]);
  expect(txt).toContain(`[About GoodBiz Power Systems](${site.url}/about)`);
  expect(txt).toMatch(/25\+ years.*BESCOM.*KPTCL/);
});
```

In `jsonld.test.ts`, add:

```ts
test("About page is about the organization", () => {
  expect(aboutPageLd()).toMatchObject({ "@type": "AboutPage", url: `${site.url}/about`, mainEntity: { "@id": `${site.url}/#organization` } });
});

test("organization knows the four project types", () => {
  const knows = (organizationLd() as { knowsAbout: string[] }).knowsAbout;
  for (const p of projectTypes) expect(knows).toContain(`Electrical supply for ${p.name.toLowerCase()}`);
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/lib/discovery.test.ts src/lib/jsonld.test.ts`
Expected: FAIL. `/about` is missing from the sitemap, the llms line is absent, and `aboutPageLd` is not exported.

- [ ] **Step 3: Implement**

- **Sitemap:** add the entry.
- **llms.txt:** add an `## About` section before `## Products` with one line:
  ``- [About GoodBiz Power Systems](${absoluteUrl("/about")}): 25+ years as a licensed EPC contractor for BESCOM and other public discoms, and on KPTCL projects; recommends the right products for apartments, commercial buildings, IT parks and industries, and supplies all of it in one order``
- **JSON-LD:** append `...projectTypes.map((p) => \`Electrical supply for ${p.name.toLowerCase()}\`)` to `knowsAbout`, and add `aboutPageLd()`.
- **Page:** render `<JsonLd data={aboutPageLd()} />` on `/about`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/discovery.test.ts src/lib/jsonld.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sitemap.ts src/lib/llms.ts src/lib/jsonld.ts src/lib/*.test.ts src/app/about/page.tsx
git commit -m "feat(about): sitemap, llms.txt and AboutPage schema"
```

---

### Task 4: Links in, and the manufacturing guard

**Files:**
- Modify: `src/components/SiteHeader.tsx`. Add `<Link href="/about" className="link nav-hide">About</Link>` after Blog.
- Modify: `src/components/SiteFooter.tsx`. Add an "About us" link first in the "For buyers" nav.
- Modify: `src/app/page.tsx`, in the "Who we are" section:
  - add a sentence after `about-body`: "Behind it are 25+ years as a licensed EPC contractor for BESCOM, other public discoms and KPTCL.";
  - add `<Link href="/about" className="link">More about us</Link>`.
- Modify: `src/lib/copy.test.ts`. Add `/\bwe manufacture\b/i` and `/manufactured by goodbiz/i` to `BANNED`, plus a test proving the allowed phrases pass.
- Test: `e2e/about.spec.ts`. Add one test for the links.

**Interfaces:** Consumes the `/about` route from Task 2.

The header link is `nav-hide`, so it shows on desktop only. This is a ruling: the 375px header is already at its limit (see the ≤400px fix), and phone users reach `/about` from the footer and the home page.

- [ ] **Step 1: Write the failing tests**

In `copy.test.ts`:
```ts
test("the ban list allows honest sourcing language", () => {
  for (const ok of ["We don't manufacture, and that's deliberate.", "sourcing from India's manufacturers"])
    expect(BANNED.some((re) => re.test(ok))).toBe(false);
  for (const bad of ["We manufacture panels", "Manufactured by GoodBiz Power Systems"])
    expect(BANNED.some((re) => re.test(bad))).toBe(true);
});
```

In `e2e/about.spec.ts`:
```ts
test("home and footer link to About", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "More about us" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("footer").getByRole("link", { name: "About us" })).toHaveAttribute("href", "/about");
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/lib/copy.test.ts && npx playwright test e2e/about.spec.ts -g "link to About"`
Expected: the copy test FAILs on the "bad" phrases not being banned, and the e2e test FAILs because there's no "More about us" link.

- [ ] **Step 3: Implement the links and the two patterns**

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/copy.test.ts && npx playwright test e2e/about.spec.ts`
Expected: PASS. All About e2e tests pass on both projects: 7 × 2 = 14.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteHeader.tsx src/components/SiteFooter.tsx src/app/page.tsx src/lib/copy.test.ts e2e/about.spec.ts
git commit -m "feat(about): link the About page from header, footer and home"
```

---

### Task 5: Whole-site check

- [ ] **Step 1: Run everything**

```bash
npm test && npm run lint && npm run build && npm run check:meta && npm run test:e2e
```

Expected:
- every Vitest file passes, lint is clean, and the build succeeds;
- `check:meta` reports no problems;
- Playwright: 28 quote tests plus 14 About tests pass.

- [ ] **Step 2: Look at it**

Open `/about` in the browser pane at desktop width and at 375px. Click through all four types and screenshot each width once. Check against `projects-v2.html` that the wipe, the photo settle and the stagger match.
