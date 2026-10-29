# About page — design

## Intent

A buyer has looked at the products and clicks "About" to decide whether to trust GoodBiz Power Systems with a whole project. The page must leave them believing:

> These people have done this for 25 years on India's own utility grid. They know which product and which brand suits my kind of project, and they will take responsibility for all of it, from the RMU to the last enclosure.

The owner's words: buyers "can fully trust us for the products which they need to install for their requirements, be it from RMU to enclosure to automation panels and transformers", and "we can guide them with the best quality and best material in a one stop solution".

How the page wins trust: proof instead of praise, judgment shown rather than claimed, independence from any single factory, one point of responsibility, and a clear way of working.

## Facts the page rests on (from the owner)

- GoodBiz Power Systems, **with its group companies**, has worked in power distribution for **25+ years**.
- GoodBiz Power Systems **holds the EPC licence itself**, and its group companies hold licences too. It is a **licensed EPC** contractor for **BESCOM and other public discoms**, and has served **KPTCL**.
- **Products are inspected and tested before shipping**, and buyers receive the documents (drawings, test reports, export paperwork). "One consolidated shipment" and "one point of contact" are already promised elsewhere on the site.
- **The site is for buyers worldwide.** The Indian utility work is the proof ("proven on India's own grid"), not the market. The project types describe the kinds of projects buyers abroad have too, so the "What we watch for" lines must read as general engineering, not India-only rules. Change "Utility-approved metering for every flat" to "Metering approved by your utility, for every flat".
- It takes on projects for **residential apartments, commercial buildings, IT parks and industries**.
- From that work, it knows which product and which brand suits each kind of project, and guides buyers to a tailored solution.
- It does not manufacture. It sources from partner manufacturers. This stays true across the site, and the page presents it as a strength.

## Goals

- A new page at `/about` with the sections below, in this order.
- The "Right product for your project" section is the centrepiece, built like the approved mockup `projects-v2.html` (in `.superpowers/brainstorm/82769-1793256722/content/`).
- The page is linked from the header, the footer and the home page's "Who we are" section.
- Search engines and AI answer engines can read and quote all of it: every word is in the server-rendered HTML.

## Non-goals

- No changes to the quote form. "Get a quote" buttons link to `/quote` as they are.
- No team or founder profiles, office photos or timeline. We have no material for them yet.
- No new product pages and no new product data.

## Anti-goals (what would make this a failure even if it works)

- **Invented proof.** No made-up project names, project counts, capacities, client logos, certifications or promises such as "quote within a working day". Every claim must come from "Facts the page rests on". Inventing proof would destroy the trust the page exists to build.
- **Claiming to manufacture.** Never say or imply it.
- **Generic praise.** No "world-class", "trusted", "high quality" filler where a fact can stand instead.
- **Looking like a template.** It must match the site's existing look and motion, not a stock "About us" layout.
- **Hiding content behind JavaScript.** Without JS, all four project types must still be fully visible.

## The page, top to bottom

Draft copy is in the mockups. The builder may tighten wording but must keep every claim within the facts above. Corrections to the mockup copy:

- In the story, remove "So we started GoodBiz Power Systems to do exactly that". It makes the company sound new. Say instead that buyers abroad now get the same judgment through GoodBiz's export work.
- Remove "many projects". Use "across apartment complexes, commercial buildings, IT parks and industrial plants" with no count.
- Change "from manufacturers whose work we've installed ourselves" to "from manufacturers whose products we've installed on utility and private projects". This follows from the EPC work.
- Keep the How-we-work steps as drafted. Testing, documents and the single shipment are all confirmed.

1. **Opening.** Eyebrow "About GoodBiz Power Systems". Headline: "25 years building India's power network. Now we supply yours." A short paragraph naming licensed EPC work for BESCOM and the other public discoms, and KPTCL, followed by four short facts: 25+ years in power distribution / Licensed EPC for BESCOM & public discoms / KPTCL projects / One stop, RMU to enclosure, one order.
2. **Our story.** "Utility work is the hardest school there is." This explains why utility work proves quality: a discom doesn't accept "close enough", and the specs, inspections and decades of service taught them which products and brands hold up. It says GoodBiz Power Systems and its group companies did this work, and that buyers abroad wanted someone to tell them what to buy, not just sell it.
3. **Right product for your project (centrepiece).** The heading is "Every project needs different power." A short lead paragraph follows, then a list of four project types alongside a large photo panel. Each type has a photo, a one-line summary, "What it typically needs" as product cards with photos, "What we watch for" as three lines, and a "Get a quote for this project" button. The content per type is exactly as in `projects-v2.html` (the `P` array), including which product photo goes with each card. Cards with no product photo (RMU, APFC) show the site's two-circle motif symbol.
4. **One stop.** The full range as a list: RMUs & MV switchgear, transformers, LT panels (PCC, MCC), automation & PLC panels, APFC & ATS, breakers & contactors, enclosures & junction boxes, busbars & parts. Then a plain paragraph: "We don't manufacture, and that's deliberate." Not being tied to one factory means they recommend what suits the project. Product names link to their product pages where one exists.
5. **How we work.** Six steps: Understand → Recommend → Source → Inspect & test → Document → Ship, each with one line.
6. **Ending.** "Tell us about your project." Buttons for "Get a quote" (`/quote`) and WhatsApp (the existing `whatsappHref`).

## How the centrepiece behaves

Mirror `projects-v2.html`:

- **Desktop.**
  - A numbered list of the four types on the left, with a large 16:9 photo on the right showing the type's name and summary over a dark gradient. Underneath are a product card grid and the "What we watch for" list.
  - Clicking a type changes the panel. The green highlight moves between rows as a single clip-path wipe (about 320 ms, `--ease-in-out`).
  - The new photo fades in from a slight blur and settles from scale 1.04 to 1. The cards and lines then appear one after another, about 45 ms apart, 300 ms each, `--ease-out`.
- **Phone (≤ 860px).** The list becomes a row of buttons that scroll sideways. The photo goes to 4:3 and the content stacks.
- **Keyboard.** A proper ARIA tablist: arrow keys move between types, and only the selected tab is in the tab order.
- **Feedback and motion rules.**
  - Buttons and tabs press in slightly (scale 0.97–0.98).
  - Hover effects only apply on devices that really hover.
  - With reduced motion, keep only the opacity fades.
- **Without JS.** All four types render one after another as full sections, each with its photo, cards and list. JS turns them into tabs.
- **Rest of the page.** Uses the site's existing `data-reveal` / `RevealObserver` scroll reveals, so nothing new is needed.

## Look

Use the site's existing tokens in `src/app/globals.css`: pastel green background, forest-ink text, General Sans, `--ease-out` / `--ease-in-out`, and **square corners**. The first mockup's rounded corners were a sketch, not the design.

## Images

- **Project photos.**
  - These are four free-to-use CC0 photos from Wikimedia Commons (originally from Unsplash). No credit is needed, which matches the owner's decision to remove picture credits from the footer.
  - | Project type | Photo |
    |---|---|
    | Apartments | "Modern apartment building (Unsplash).jpg" |
    | Commercial | "Office buildings under clouds (Unsplash).jpg" |
    | IT parks | "Office bridge (Unsplash).jpg" |
    | Industries | "Heavy industry (Unsplash).jpg" |
  - Save them as WebP under `public/images/projects/` and record each source URL and licence in `docs/image-sources.md`, or the equivalent if one exists.
  - They are generic buildings and must never be captioned as GoodBiz projects.
- **Product photos.** Reuse the site's own images in `public/images/products/`.
- **Owner's own photos.** The owner may later supply photos from their own sites. Swapping them in should only mean replacing files.

## Search and AI visibility

- `pageMeta` title "About us", with a description that leads with 25+ years, licensed EPC for BESCOM and public discoms, KPTCL, and one-stop supply.
- Add `/about` to the sitemap at priority 0.8 and to `llms.txt` / `llms-full.txt` with a short summary.
- JSON-LD:
  - an `AboutPage` whose `mainEntity` is the existing Organization (`@id`);
  - add `knowsAbout` for the four project types and the product range.
  - Don't add `foundingDate` unless a real year is known.
- The project-type section is plain question-and-answer material: "What does an IT park need?" The headings and text should stay in the HTML as written.

## Links into the page

- Header: an "About" link next to the existing links. It must fit the ≤ 400px header fix already in place.
- Footer: an "About us" link with the others.
- Home page "Who we are": add a "More about us" link to `/about`, and one sentence there mentioning the 25 years with BESCOM, discoms and KPTCL.

## Testing

- Follow the project's existing patterns: Vitest for data and helpers, Playwright `e2e/` for the page on the `phone` and `desktop` projects.
- The tests prove that:
  - `/about` renders all six sections;
  - choosing each type shows its photo and cards;
  - arrow keys work;
  - with JS disabled, all four project types are visible;
  - there is no sideways scroll at 375px;
  - `/about` is in the sitemap;
  - the page never claims GoodBiz manufactures. Extend the existing ban list in `src/lib/copy.test.ts` with patterns such as "we manufacture", "our factory" and "manufactured by GoodBiz", and run it over the About copy. "We don't manufacture" and "India's manufacturers" stay allowed.

## Left to the builder

- Component structure, file names and data location. The obvious choice is a `src/data/projects.ts` alongside `products.ts`.
- Exact wording polish within the claims above.
- How to render the no-JS fallback alongside the tabbed version.

## Calls I made (not decided by the owner)

- Product suggestions and "what we watch for" lines per project type are standard industry practice, written by me and shown to the owner in the mockup. The owner hasn't corrected them.
- I dropped "quote within a working day" because nobody confirmed it.
- "Get a quote for this project" links to plain `/quote`, without pre-filling anything. The mockup's `?project=` is dropped.
- The copy corrections listed under "The page, top to bottom".
- The image-source record goes in the existing `assets/credits.json` if it fits, otherwise in `docs/image-sources.md`. It is kept for the record only and never shown on the site.
- The "manufacture" check extends `src/lib/copy.test.ts`.
- Header placement of "About".
- The one-sentence addition to the home page.
