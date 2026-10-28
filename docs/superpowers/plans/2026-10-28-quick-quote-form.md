# Quick Quote Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A seven-step `/quote` form that saves the lead on step 1 into the "Power" Google Sheet via Apps Script, alerts power@goodbizglobal.com, and falls back to WhatsApp/email when sending fails.

**Architecture:** All rules live in small pure modules under `src/lib/quote/` (options, strings, pre-fill, steps, payload, send, country names), unit-tested with Vitest. One client component `src/components/quote/QuoteForm.tsx` drives them; a server page `src/app/quote/page.tsx` hosts it. The backend is `apps-script/` (pure helpers in `Sheet.js` tested from Node, `Code.gs` as the entry point). Browser behaviour is pinned by Playwright against a production build with the endpoint mocked.

**Tech Stack:** Next.js 15.5 App Router, React 19, TypeScript, Vitest 3, Playwright (new dev dependency), Google Apps Script (V8).

**Spec:** `docs/superpowers/specs/2026-10-28-quick-quote-form-design.md`

## Global Constraints

- Auto-advance delay 260 ms. Step transition 16 px + fade, 240 ms, `cubic-bezier(0.23,1,0.32,1)`; reduced motion: opacity only, 150 ms. Progress bar `scaleX`, 320 ms, `cubic-bezier(0.77,0,0.175,1)`. Press `scale(0.97)`, 160 ms. Hover only in `@media (hover:hover) and (pointer:fine)`.
- Contact valid = name AND (valid email OR phone with 7+ digits).
- Spam: honeypot ticked → show success, send nothing. Final send no earlier than 3 s after mount (delayed, never dropped). Final send timeout 15 s.
- POST body JSON with `Content-Type: text/plain;charset=utf-8`. In-between sends use `keepalive: true`.
- Endpoint from `NEXT_PUBLIC_LEAD_ENDPOINT`, empty by default; empty = not configured.
- Alerts to `power@goodbizglobal.com` on stages `contact` and `submitted`, once each per lead.
- Formula escaping: values starting with `=`, `+`, `-`, `@`, `\t`, `\r` get a leading `'`. Values trimmed, capped at 2,000 characters.
- Touch targets 44–52 px; inputs 16 px font; photo cards 3 across on phones; empty error slots take no space (`:empty { display: none }`).
- Selected card: `--action` border plus `--accent` ring; selected pill filled `--action` with `--action-ink` text; focus ring via `:has(:focus-visible)`.
- Logical CSS properties only for anything directional (RTL-ready). All form copy from the strings module.
- Copy rule (existing test): never claim GoodBiz manufactures.
- Every new page uses `pageMeta` (description 120–160 characters).

## Review Focus

1. Visitor pastes an email with surrounding spaces or capitals, or a phone like `+971 (50) 123-4567` → still valid; digits counted ignoring punctuation. Pinned in Task 2.
2. Visitor goes Back from step 3 to step 2 and switches to "Something else" → the old variety is cleared and not sent. Pinned in Task 2 (`clearDependents`).
3. An in-between send arrives at the sheet after the final one (keepalive reordering) → stage stays `submitted`, filled cells kept. Pinned in Task 4.
4. `?product=lt-panels&variety=<script>` or `?variety=MCC` alone → hostile variety ignored, product still pre-filled; variety without product ignored. Pinned in Task 2.
5. Visitor refreshes mid-form → same `leadId`, no second row. Pinned in Task 3 (`getLeadId`) and Task 7 (browser).

---

### Task 1: Options and strings

**Files:**
- Create: `src/lib/quote/options.ts`, `src/lib/quote/strings.ts`
- Test: `src/lib/quote/options.test.ts`

**Interfaces:**
- Produces:
  - `type Choice = { id: string; label: string; hint?: string; image?: string }`
  - `OTHER = "other"`, `ANY = "any"` (ids for "Something else"/"Another amount" and "Any / not sure")
  - `productChoices(): Choice[]`: the six families (`id` = slug, `label` = short card label, `image` = `fam.image?.src ?? fam.gallery?.[0]?.src`), then `{ id: OTHER }`
  - `varietyChoices(product: string): Choice[]`: that family's variants (`id` = `slugify(variant.name)`, `label` = variant name), then `{ id: ANY }`; `[]` for unknown product
  - `QUANTITY_CHOICES: Choice[]`: ids `sample`, `2-5`, `6-20`, `project`, `other`
  - `TERMS_CHOICES: Choice[]`: ids `fob`, `cif`, `dap`, `unsure`, each with a `hint` line
  - `slugify(s: string): string` (lowercase, non-alphanumerics → `-`, trimmed)
  - `type QuoteStrings` and `getStrings(lang: string): QuoteStrings`, falling back to `en`. Holds every visible string: step titles (title for variety step takes `{family}`), field labels, hint "Email or WhatsApp is enough.", privacy line "We use these details only to reply to your request.", "Something else" placeholder "Which product? e.g. cable trays, earthing kits", choice labels/hints, errors, "Step {n} of {m}", Back, Next, Send, success heading "Thanks, we've got your request", fallback copy, "Send on WhatsApp", "Send by email".

- [ ] **Step 1: Write the failing tests** in `options.test.ts`:
  - `productChoices()` has 7 entries, last id `"other"`, every family entry has an `image` starting `/images/`.
  - `varietyChoices("lt-panels")` ids include `"motor-control-centre-mcc"` and end with `"any"`; `varietyChoices("nope")` equals `[]`.
  - `QUANTITY_CHOICES.map(c => c.id)` equals `["sample","2-5","6-20","project","other"]`.
  - `TERMS_CHOICES` ids equal `["fob","cif","dap","unsure"]` and each has a non-empty `hint`.
  - `getStrings("ar")` equals `getStrings("en")`.
  - No string in `getStrings("en")` (walked recursively) matches `/we manufacture|our factory|we build/i`.
- [ ] **Step 2: Run** `npx vitest run src/lib/quote/options.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** both modules. Labels and hints exactly as in the spec's step list (step 4 pills, step 6 lines).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(quote): options and strings`.

### Task 2: Pre-fill, visible steps and validation

**Files:**
- Create: `src/lib/quote/steps.ts`, `src/lib/quote/prefill.ts`
- Test: `src/lib/quote/steps.test.ts`

**Interfaces:**
- Consumes: Task 1 choices, `OTHER`, `ANY`, `QuoteStrings`.
- Produces:
  - `type StepId = "contact" | "product" | "variety" | "quantity" | "destination" | "terms" | "notes"`
  - `type Answers = { name; company; email; phone; product; productOther; variety; quantity; quantityOther; country; port; terms; notes: string; website: boolean }` (`website` is the honeypot)
  - `emptyAnswers(): Answers`
  - `type Prefill = { product?: string; variety?: string }`
  - `parsePrefill(params: URLSearchParams): Prefill`: `product` kept only if it is a family slug; `variety` only if `product` was kept and `slugify(value)` matches a `varietyChoices(product)` id (excluding `any`). Values longer than 80 chars ignored.
  - `visibleSteps(a: Answers, prefill: Prefill): StepId[]`: all seven, minus `product` if `prefill.product`, minus `variety` if `prefill.variety` or `a.product === OTHER`.
  - `isValidEmail(s: string): boolean` (trimmed, `x@y.z` shape), `phoneDigits(s: string): number`
  - `validateStep(step: StepId, a: Answers, t: QuoteStrings): { field: keyof Answers; message: string } | null`: contact rules; `product` required, and `productOther` required when `OTHER`; `quantityOther` required when `quantity === "other"`; `country` required; `variety`, `terms` required; `notes` never fails.
  - `clearDependents(a: Answers, changed: keyof Answers): Answers`: changing `product` clears `variety` and (unless now `OTHER`) `productOther`; changing `quantity` away from `other` clears `quantityOther`.

- [ ] **Step 1: Write the failing tests:**
  - `validateStep("contact", {name:"Ali", email:" Ali@X.com "})` → `null`; `{name:"Ali", phone:"+971 (50) 123-4567"}` → `null`; `{name:"Ali", phone:"12345"}` → `{field:"email"}`; `{email:"a@b.co"}` (no name) → `{field:"name"}`.
  - `validateStep("product", {product:"other", productOther:""})` → `{field:"productOther"}`.
  - `validateStep("quantity", {quantity:"other"})` → `{field:"quantityOther"}`; `validateStep("notes", empty)` → `null`.
  - `parsePrefill(new URLSearchParams("product=lt-panels&variety=MCC"))` → `{product:"lt-panels"}` (MCC is not a whole variant slug); `"product=lt-panels&variety=motor-control-centre-mcc"` → both kept; `"product=lt-panels&variety=<script>"` → `{product:"lt-panels"}`; `"variety=motor-control-centre-mcc"` → `{}`; `"product=transformers&variety=motor-control-centre-mcc"` → `{product:"transformers"}`; `"product=" + "a".repeat(200)` → `{}`.
  - `visibleSteps(empty, {})` has length 7; with `{product:"lt-panels"}` it has 6 and no `"product"`; with both it has 5; `visibleSteps({...empty, product:"other"}, {})` has no `"variety"`.
  - `clearDependents({...a, product:"other", variety:"x"}, "product").variety === ""`.
- [ ] **Step 2: Run** `npx vitest run src/lib/quote/steps.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `steps.ts` and `prefill.ts`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(quote): steps, pre-fill and validation`.

### Task 3: Payload, sending and fallback

**Files:**
- Modify: `src/data/site.ts` (add `leadEndpoint`; `whatsappHref(text?: string)` adds `?text=` when given; existing callers unchanged)
- Create: `src/lib/quote/payload.ts`, `src/lib/quote/send.ts`
- Test: `src/lib/quote/send.test.ts`, extend `src/lib/site.test.ts`

**Interfaces:**
- Consumes: `Answers`, `StepId`, `Prefill`, choice lists.
- Produces:
  - `site.leadEndpoint: string` from `process.env.NEXT_PUBLIC_LEAD_ENDPOINT?.trim() ?? ""`
  - `type Stage = StepId | "submitted"` (stage for a step is the step id; `notes` is never sent as an in-between stage)
  - `type LeadPayload = { leadId; stage; source: "quick" | "configurator"; name; company; email; phone; product; productOther; variety; quantity; quantityOther; country; port; terms; notes; details; page; prefilled: "yes" | "no"; lang; userAgent: string }`. Product, variety, quantity and terms are sent as their **labels**, not ids.
  - `buildPayload(a: Answers, ctx: { leadId: string; stage: Stage; prefill: Prefill; page: string; lang: string; userAgent: string }): LeadPayload`
  - `requestSummary(p: LeadPayload): string`: plain multi-line text, one "Label: value" line per filled field, used for WhatsApp and email bodies.
  - `fallbackLinks(p: LeadPayload): { whatsapp: string; email: string }` via `whatsappHref(text)` and `mailtoHref(subject, body)`; subject `Quote request: {product} for {country}`.
  - `getLeadId(storage: Storage | null): string`: reads/writes `goodbiz-lead-id`; uses `crypto.randomUUID` when present, else a random base-36 string.
  - `sendLead(p: LeadPayload, opts: { endpoint: string; final: boolean; timeoutMs?: number; fetchImpl?: typeof fetch; storage?: Storage | null }): Promise<boolean>`: returns `false` immediately when `endpoint` is empty. Stores `p` under `goodbiz-lead-pending` before sending; posts with `method:"POST"`, the text/plain header, `keepalive: !opts.final`, and an `AbortController` timeout (default 15,000 ms). `true` only when the response JSON has `ok === true`; then clears the pending entry. Any throw, non-JSON or `ok !== true` → `false`.
  - `resendPending(opts: { endpoint: string; fetchImpl?: typeof fetch; storage?: Storage | null }): Promise<void>`: sends a stored pending payload once, if any.

- [ ] **Step 1: Write the failing tests** (`fetchImpl` is a `vi.fn`, storage an in-memory `Storage` stub):
  - `sendLead(p, {endpoint:"", final:true})` resolves `false` and fetch is not called.
  - Request has `method "POST"`, header `Content-Type: text/plain;charset=utf-8`, `JSON.parse(body).leadId === p.leadId`, `keepalive` true when `final:false` and false when `final:true`.
  - Response `{ok:true}` → `true` and pending cleared; HTTP 500 → `false` and pending kept; fetch rejects → `false`; fetch never resolves with `timeoutMs: 20` (fake timers) → `false`.
  - `resendPending` posts the stored payload and clears it on `{ok:true}`.
  - `getLeadId(store)` returns the same value twice; works with `null` storage.
  - `buildPayload` sends labels: product `"lt-panels"` → `"LT panels"` (the family's `name`), terms `"cif"` → `"CIF your port"`; `prefilled` is `"yes"` when prefill has a product.
  - `requestSummary` contains `"Country: Kenya"` and no line for an empty company.
  - `whatsappHref("a b")` ends with `?text=a%20b`; `whatsappHref()` unchanged.
- [ ] **Step 2: Run** `npx vitest run src/lib/quote src/lib/site.test.ts`. Expected: new tests FAIL.
- [ ] **Step 3: Implement** the site change, `payload.ts` and `send.ts`.
- [ ] **Step 4: Run** `npm test`. Expected: all PASS (existing 97 plus new).
- [ ] **Step 5: Commit** `feat(quote): payload, sending and fallback links`.

### Task 4: Apps Script backend and setup doc

**Files:**
- Create: `apps-script/Sheet.js` (pure helpers, plain ES2019 script with no imports; ends with `if (typeof module !== "undefined") module.exports = { … }` so Node can load it), `apps-script/Code.gs`, `apps-script/README.md` (one line: "Paste both files into the Power sheet's Apps Script; see docs/lead-sheet-setup.md"), `docs/lead-sheet-setup.md`
- Test: `src/lib/quote/apps-script.test.ts` (loads the helpers with `createRequire(import.meta.url)("../../../apps-script/Sheet.js")`)

**Interfaces:**
- Produces (in `Sheet.js`):
  - `COLUMNS`: `["leadId","firstSeen","updated","stage","source","name","company","email","phone","product","productOther","variety","quantity","quantityOther","country","port","terms","notes","details","page","prefilled","lang","userAgent","alerted"]`
  - `STAGES`: `["contact","product","variety","quantity","destination","terms","submitted"]`
  - `escapeCell(v: unknown): string`: trim, cap at 2,000, prefix `'` for leading `= + - @ \t \r`
  - `mergeRow(existing: string[] | null, incoming: object, now: string): string[]`: new row sets `firstSeen` and `updated` to `now`; existing keeps `firstSeen`, sets `updated`; empty incoming never replaces a filled cell; `stage` takes the later of the two by `STAGES` index; `alerted` is never taken from incoming.
  - `alertsDue(row: string[]): string[]`: which of `contact`/`submitted` are reached by the row's stage and not yet in its comma-separated `alerted` cell (a lead arriving straight at `submitted` gets both — send one email for the submitted request in that case: return `["submitted"]` and record both).
  - `parseRequest(e): { data: object, form: boolean }`: JSON from `e.postData.contents` when it parses, else `e.parameter` with `form: true`.
- `Code.gs`: `ALERT_TO = "power@goodbizglobal.com"`, `SHEET_NAME = "Leads"`. `doPost(e)`: `LockService.getScriptLock().waitLock(10000)`; parse; ignore when no `leadId` or `website` is truthy (still answer ok); get/create the `Leads` tab with the header row; find the row by `leadId` in column A (`TextFinder`, whole cell); `mergeRow`; write; `alertsDue` → `MailApp.sendEmail({ to: ALERT_TO, replyTo: email if present, subject: "New lead: {name}" | "Quote request: {product} for {country}", body: one "Column: value" line per filled cell })`, then record in `alerted`; release lock. Return `ContentService` JSON `{ok:true}`, or for `form: true` an `HtmlService` page "Thanks, we've got your request" with a link to `https://www.goodbizpower.com`. No-JS posts have no `leadId`, so the script assigns `Utilities.getUuid()` and stage `submitted` when `form` is true.
- `docs/lead-sheet-setup.md`: steps from the spec's "Setup doc" paragraph, plus: paste `Sheet.js` as a script file named `Sheet` and `Code.gs` as `Code`; checking that "Anyone" appears under Who has access, and if not, Admin console → Apps → Google Workspace → Drive and Docs → sharing outside the domain must allow it; a curl test command posting `{"leadId":"test-1","stage":"contact","name":"Test","email":"test@example.com"}` as text/plain; redeploying edits via Manage deployments → Edit → New version (same URL).

- [ ] **Step 1: Write the failing tests:**
  - `escapeCell("=SUM(A1)")` → `"'=SUM(A1)"`; also for `"+1"`, `"-x"`, `"@x"`, `"\tx"`, `"\rx"`; `"  ok "` → `"ok"`; `"a".repeat(2500).length` → 2000.
  - `mergeRow(null, {leadId:"L", stage:"contact", name:"Ali"}, "T1")` has `firstSeen` and `updated` `"T1"`.
  - Merging `{stage:"product", name:"", product:"LT panels"}` into that row at `"T2"` keeps name `"Ali"`, `firstSeen` `"T1"`, sets `updated` `"T2"`.
  - Merging `{stage:"quantity"}` into a `submitted` row keeps `stage` `"submitted"`.
  - `alertsDue` for a `contact` row with empty `alerted` → `["contact"]`; with `alerted:"contact"` at stage `terms` → `[]`; at `submitted` → `["submitted"]`.
  - `parseRequest({postData:{contents:'{"leadId":"L"}'}})` → `{data:{leadId:"L"}, form:false}`; `parseRequest({parameter:{name:"A"}, postData:{contents:"name=A"}})` → `form:true`.
- [ ] **Step 2: Run** `npx vitest run src/lib/quote/apps-script.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `Sheet.js`, then `Code.gs` and the two docs.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(quote): Apps Script backend and setup guide`.

### Task 5: Country type-ahead data

**Files:**
- Create: `src/lib/quote/countries.ts`
- Test: `src/lib/quote/countries.test.ts`

**Interfaces:**
- Produces:
  - `countryNames(lang: string): string[]`: names from `new Intl.DisplayNames([lang, "en"], { type: "region" })` over a hard-coded list of ISO 3166-1 alpha-2 codes (all 249; skip codes whose name equals the code). The 18 codes from `src/data/countries.ts` come first in that file's order, then the rest sorted with `localeCompare(…, lang)`. No duplicates.
  - `suggestCountries(query: string, names: string[], limit = 6): string[]`: case- and accent-insensitive (`normalize("NFD")`, strip marks); names starting with the query first, then names containing it.

- [ ] **Step 1: Write the failing tests:** `countryNames("en")[0] === "Saudi Arabia"`; it includes `"Germany"` and has more than 200 entries and no duplicates; `suggestCountries("sau", names)[0] === "Saudi Arabia"`; `suggestCountries("africa", names)` includes `"South Africa"`; `suggestCountries("", names)` is `[]`; `suggestCountries("cote", names)` includes the Côte d'Ivoire name.
- [ ] **Step 2: Run** `npx vitest run src/lib/quote/countries.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(quote): country names and suggestions`.

### Task 6: The form, the page and the entry points

**Files:**
- Create: `src/components/quote/QuoteForm.tsx` (client), `src/components/quote/ChoiceGroup.tsx`, `src/app/quote/page.tsx`
- Modify: `src/app/globals.css` (new `.qf-*` section), `src/lib/sitemap.ts` (add `page("/quote", 0.9)`), `src/lib/discovery.test.ts` (add `"/quote"` to the covered paths), `src/components/SiteHeader.tsx:78` and `src/components/SiteFooter.tsx:102` (Get a quote → `/quote`; footer "Configure a requirement" link stays), `src/app/products/[slug]/page.tsx:45` and `:173-177` (both "Request {fam.name}" → `/quote?product=${fam.slug}`), `src/components/QuoteCta.tsx` (optional `secondary?: { href: string; label: string }` rendered as a `btn--quiet` link before WhatsApp; product pages pass `{ href: "/configurator?family=<slug>", label: "Configure in detail" }`)

**Interfaces:**
- Consumes: everything from Tasks 1–3 and 5.
- Produces: `<QuoteForm />` (no props; reads `useSearchParams`, so the page wraps it in `<Suspense>` like the configurator). DOM hooks the browser tests rely on: form `data-testid="quote-form"`; each step `section[data-step="<StepId>"]` with `data-active` on the current one; progress text in `[data-testid="quote-progress"]`; success heading `h2[data-testid="quote-success"]`; fallback links `a[data-testid="fallback-whatsapp"]` and `a[data-testid="fallback-email"]`; honeypot `input[name="website"]`.

Decisions the implementer cannot make alone:
- **Markup is the no-JS form.** `<form method="post" action={site.leadEndpoint || mailtoHref("Quote request")}>` (plus `encType="text/plain"` when it is a mailto). Every step is a `<section>` inside it, using real `<input type="radio">` groups (`name` = answer key, `value` = choice id) and text fields with `name` attributes, so the browser posts form-encoded without JS. The no-JS final submit is a plain `<button type="submit">` in the notes step.
- **Hiding steps before hydration:** inside `@media (scripting: enabled)`, `.qf:not([data-ready]) .qf-step:not([data-step="contact"])` is hidden; after mount the form sets `data-ready` and only `[data-active]` shows. Without scripting every step shows and Next/Back buttons are hidden.
- **Moving forward:** `next()` validates the active step (`validateStep`; on error set the message in that field's error slot, `aria-invalid`, focus the field), sends `buildPayload(… stage: step)` with `sendLead(final:false)` except on `notes`, then moves to the next id in `visibleSteps`. Contact's send happens here too. On mount call `resendPending`.
- **Auto-advance:** a pointer click or tap on a radio choice (not `onChange` from arrow keys; track `pointerdown` on the label) sets the answer and calls `next()` after 260 ms, unless the choice is `OTHER`, which focuses its text box instead. Enter in any input (not the notes textarea) calls `next()`.
- **Final send:** `send()` returns early if a send is in flight (a ref, not state, so a double-click in one frame sends once). Honeypot ticked → show success, no request. Waits until 3,000 ms since mount, then `sendLead(final:true)`; `true` → success view (check mark SVG path with `stroke-dasharray` drawn once, 600 ms `--ease-out`; focus the heading); `false` → keep answers, show fallback panel with `fallbackLinks`.
- **Direction:** `data-dir="forward" | "back"` on the form; CSS keyframes use `translate: 16px 0` / `-16px 0`, and `:dir(rtl)` flips the sign.
- **Scroll:** after a step change, if the form's top is above `headerHeight` (read `.site-header` height) or below the viewport, `window.scrollTo({ top: formTop - headerHeight - 16, behavior: reduced ? "auto" : "smooth" })`.
- **Progress:** label `Step {index+1} of {visibleSteps.length}`; bar `transform: scaleX((index+1)/length)` with `transform-origin: inline-start` (use `left` under ltr and `right` under `:dir(rtl)` since `transform-origin` has no logical keyword).
- **Photo cards:** `next/image` with `sizes="(max-width: 640px) 30vw, 180px"`, 4:3 crop; grid `repeat(3, 1fr)` on phones, "Something else" `grid-column: 1 / -1`.
- **Page:** `pageMeta({ title: "Get a quote", description: <120–160 chars, written by implementer, sourcing language not manufacturing>, path: "/quote" })`, a short `h1` and one line of copy, then the form, plus `breadcrumbLd`.
- **Configurator:** in `Configurator.tsx` `submit()`, build a `LeadPayload` with `source: "configurator"`, `stage: "submitted"`, name/company/email/phone/country/terms/notes mapped from its form and `details` = the existing `lines.join("\n")`; `await sendLead(final:true)`. `true` → the existing sent view with the heading changed to "Thanks, we've got your request"; `false` → keep the current `mailto:` behaviour and also show a "Send on WhatsApp" link. Same in-flight guard.

- [ ] **Step 1: Write the failing test:** extend `src/lib/discovery.test.ts` with `"/quote"` in the covered paths. Run `npx vitest run src/lib/discovery.test.ts`. Expected: FAIL.
- [ ] **Step 2: Implement** the sitemap entry, page, components, CSS and entry-point changes.
- [ ] **Step 3: Run** `npm test && npm run lint && npm run build && npm run check:meta`. Expected: all pass, `/quote` listed as static in the build output.
- [ ] **Step 4: Look at it:** `preview_start` "goodbiz" (rebuild first), open `/quote` at 375 px and desktop, tap through every step, check `/quote?product=lt-panels`, the header button and a product page's two buttons. Fix anything off.
- [ ] **Step 5: Commit** `feat(quote): quick quote form, /quote page and entry points`.

### Task 7: Browser tests

**Files:**
- Modify: `package.json` (dev dep `@playwright/test`; script `"test:e2e": "playwright test"`), `.gitignore` (`/test-results`, `/playwright-report`)
- Create: `playwright.config.ts`, `e2e/quote.spec.ts`

**Interfaces:**
- Consumes: the DOM hooks from Task 6.
- Config: `testDir: "e2e"`; `webServer: { command: "npm run build && npx next start -p 3020", port: 3020, env: { NEXT_PUBLIC_LEAD_ENDPOINT: "https://lead.test/exec" }, reuseExistingServer: false, timeout: 180000 }`; projects `phone` (`devices["iPhone 13"]` on chromium) and `desktop` (`Desktop Chrome`). Each test routes `https://lead.test/**`, records request bodies, and answers `{ok:true}` unless the test says otherwise.

- [ ] **Step 1: Install** `npm i -D @playwright/test && npx playwright install chromium`.
- [ ] **Step 2: Write the tests** in `e2e/quote.spec.ts`:
  - `contact is sent on the first Next`: fill name and email, click Next → exactly one request with `stage "contact"` and that email.
  - `invalid contact shows an inline error and focuses the field`: Next with a name only → error visible, focus on email, no request.
  - `tapping a card advances; arrow keys do not`: on product, ArrowRight moves the checked radio and the step stays; clicking "Transformers" moves to `variety` within 1 s; Back returns to `product` with Transformers checked.
  - `pre-fill skips steps`: `/quote?product=lt-panels&variety=motor-control-centre-mcc` → after contact, the active step is `quantity` and the progress reads "Step 2 of 5".
  - `something else skips the variety step`: choose Something else, type "cable trays", Next → active step `quantity`.
  - `full flow keeps one leadId`: complete every step and Send → success heading focused; every request shares one `leadId`; the last has `stage "submitted"`.
  - `refresh keeps the lead id`: after contact, reload, fill contact again → both contact requests share a `leadId`.
  - `double-click sends once`: double-click Send → exactly one `submitted` request.
  - `failure shows the fallback`: route answers 500 for `submitted` → fallback WhatsApp link `href` contains `wa.me` and `text=`; email link starts with `mailto:`; answers still on screen.
  - `honeypot shows success without sending`: tick `input[name=website]` via `force`, finish → success, no `submitted` request.
- [ ] **Step 3: Run** `npm run test:e2e`. Expected: all tests pass in both projects. Fix the form (not the tests) where one fails.
- [ ] **Step 4: Commit** `test(quote): browser tests for the quick quote form`.

### Task 8: Final check

- [ ] **Step 1:** `npm test && npm run lint && npm run build && npm run check:meta && npm run test:e2e`. Expected: all green.
- [ ] **Step 2:** With JS disabled in the preview tab (or `javaScriptEnabled: false` in a one-off Playwright run), `/quote` shows every step and a submit button.
- [ ] **Step 3:** Screenshots of steps 1, 2, 6 and success at 375 px for the hand-over.
- [ ] **Step 4:** Commit any fixes; do not push until the owner says so.
