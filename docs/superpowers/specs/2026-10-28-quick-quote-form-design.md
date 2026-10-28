# Quick quote form: design

Date: 2026-10-28 · Site: GoodBiz Power Systems (`goodbiz/`, Next.js 15 App Router)

## Why

Buyers give up when they see a wall of fields. The quick quote form asks one small
thing at a time, mostly by tapping, so showing interest never feels like work.
Above all, **a visitor's contact details are never lost**, even if they stop
halfway: contact comes first and is saved the moment they tap Next.

The existing configurator (`/configurator`) stays. It is the detailed path for
buyers who know their ratings. The quick form is for anyone showing interest.
Both feed the same lead sheet.

## Goals

- A seven-step form at a new page, `/quote`, that captures the lead on step 1.
- One row per visitor in the "Power" Google Sheet, updated as they move forward.
- An email alert to **power@goodbizglobal.com** when a lead first arrives and
  when the request is finished.
- Works without JavaScript, works when the backend is down or not configured
  yet, and feels quick and calm on a phone.

## Non-goals

- No CRM, no login, no file uploads, no price shown.
- No new product lines or HSN codes. The choices come from `src/data/products.ts`.
- No translations yet: the site is English only. Strings must still be gathered
  so a language can be added without touching the component, and the layout must
  work right-to-left.

## Anti-goals (a failure even if it "works")

- Losing a contact because a later step failed or the visitor left.
- Dropping a real, fast submit as spam.
- Sending the same final request twice (double-click).
- A form that jumps ahead when someone is only using arrow keys.
- Anything that claims GoodBiz manufactures (existing copy rule and test).

## Entry points (my call, approved in the playback)

- Header "Get a quote" button → `/quote` (was `/configurator`). The footer's
  "Get a quote" button follows it; the footer's "Configurator" text link stays.
- Both "Request {family}" buttons on a product page (the hero link and the
  bottom `QuoteCta`) → `/quote?product=<slug>`. The `QuoteCta` there keeps a
  quieter "Configure in detail" link to `/configurator?family=<slug>` (my call).
- Landing and country `QuoteCta` keep their configurator button and gain nothing
  new; the header covers the quick path.
- The configurator's final step also posts to the same endpoint (stage
  `"submitted"`, `source: "configurator"`) instead of only opening `mailto:`.
  If the post fails or there is no endpoint, it falls back to the same
  WhatsApp / email buttons.
- `/quote` goes in the sitemap and gets its own `pageMeta` (120–160 characters).

## The steps (one per screen)

The label reads "Step N of M", where M counts only the steps this visitor will
see (pre-filled and skipped steps drop out).

1. **How can we reach you?** Name (required), company (optional), email,
   WhatsApp / phone. Valid when there is a name **and** either a valid email or
   a phone with 7+ digits. Hint: "Email or WhatsApp is enough." Tapping Next
   sends stage `"contact"`. That is the lead. Under the fields, one small line
   (owner's decision): "We use these details only to reply to your request."
   No consent checkbox. A full privacy page is a later, separate piece.
2. **What do you need?** Photo cards for the six families (their `image` from
   products data), short labels, plus a full-width "Something else" card that
   opens a text box ("Which product? e.g. cable trays, earthing kits").
   Choosing "Something else" skips step 3.
3. **Which {family}?** Pills from that family's `variants[].name`, plus
   "Any / not sure".
4. **How many?** Pills: "Single unit / sample", "2–5 units", "6–20 units",
   "Project or tender quantity", plus "Another amount" which opens a text box.
5. **Where should it ship?** Country text field with type-ahead. Names come
   from `Intl.DisplayNames` for the page language over the ISO 3166 region
   list; the 18 countries in `src/data/countries.ts` are listed first. Optional
   "Port or city" field. A typed name that matches no country is still
   accepted as free text.
6. **Delivery terms?** Cards with one plain line each:
   - FOB Indian port: we load it on the ship; you arrange freight.
   - CIF your port: we pay freight and insurance to your port.
   - DAP your site: we deliver to your site; you clear customs.
   - Not sure: we'll suggest the best option.
   EXW is left out (my call: the configurator still offers it).
7. **Anything else?** Optional notes, then **Send**.

## Behaviour

- **Auto-advance:** tapping a card or pill selects it and moves on after 260 ms.
  Arrow keys move the selection within the group and never advance. Choosing an
  "other" option (Something else, Another amount) opens its text box and stays.
- Back on every step except the first. Enter = Next (except inside the notes
  textarea, where Enter makes a new line).
- **Sending:** one `leadId` from `crypto.randomUUID()` per visit (kept in
  `sessionStorage` so a refresh keeps the same row; falls back to a random
  string where `randomUUID` is missing). Each Next sends the answers so far
  with `stage` set to the step name (`contact`, `product`, `variety`,
  `quantity`, `destination`, `terms`). In-between sends use `fetch` with
  `keepalive: true`, fire and forget. The final send has stage `"submitted"`
  and is awaited.
- **Unsent contact (my call):** the latest payload is kept in `sessionStorage`
  until a send to the endpoint gets `{ok:true}` back. If the step-1 send fails,
  the visitor is not held up; the next step's send carries everything, and if
  they reload or come back in the same tab the stored payload is sent again on
  load. `fetch` with `keepalive` still answers, so in-between sends read the
  response when they can and clear the store on success.
- **Pre-fill:** `?product=<slug>&variety=<variant name or slug>` pre-fill and
  skip those steps instead of showing them filled. Each value is matched only
  against its own option group (product against family slugs, variety against
  that family's variants). Unknown, empty, over-long or hostile values are
  ignored and the step shows as normal. A variety without a valid product is
  ignored. Pre-filled steps are still sent in the payload.
- **Validation:** current step only. The error appears inline under the field,
  focus moves to the field, and it is announced (`aria-live` / `aria-describedby`).
- **Spam:** a hidden honeypot checkbox; if ticked, show success and send nothing.
  A 3-second minimum from page load to the final send: a fast valid submit is
  delayed until 3 s have passed, never dropped.
- **Double submit:** Send disables itself while the final post is in flight and
  a second click does nothing.
- **Failure fallback:** if the final post fails, returns something other than
  `{ok:true}`, takes longer than 15 s, or no endpoint is configured, show
  "Send on WhatsApp" and "Send by email" buttons with the whole request written
  into the message (via the existing `whatsappHref` / `mailtoHref` helpers,
  extended to take a body). Answers stay on screen.
- **Success:** the steps hide, a check mark draws itself once, focus moves to
  the heading ("Thanks, we've got your request"), with a line saying a reply
  comes within one working day (my call on wording) and a link back to products.
- **No JavaScript:** every step shows at once as a normal form with radio
  buttons and text fields, and posts form-encoded to the same endpoint. Apps
  Script then shows a plain thank-you page with a link back to the site.

## Design (Emil Kowalski principles, existing tokens)

Uses the site's colours, General Sans, radius and easing tokens in `globals.css`
(`--ease-out`, `--ease-in-out`, `--action`, `--accent`, `--field-1`, `--line`).

- Step change: the new step slides 16 px from the direction of travel and fades
  in over 240 ms, `cubic-bezier(0.23,1,0.32,1)`. Back enters from the other
  side; both mirror under `dir="rtl"`. Reduced motion: opacity only, 150 ms.
- Progress bar: `transform: scaleX()` from the inline-start edge, 320 ms,
  `cubic-bezier(0.77,0,0.175,1)`. Never animate width.
- Press: cards, pills and buttons `scale(0.97)` over 160 ms. Hover effects only
  inside `@media (hover:hover) and (pointer:fine)`.
- Selected: cards get a `--action` border plus `--accent` ring; pills fill with
  `--action` and `--action-ink` text. Focus ring via `:has(:focus-visible)` on
  the card or pill wrapping the real radio input.
- Touch targets 44–52 px. Photo cards 3 across on phones so all seven fit about
  one screen; "Something else" spans the row.
- Inputs 16 px font (no iOS zoom). Empty error slots take no space.
- On step change, if the form top is above the viewport or hidden by the fixed
  header, scroll it into view with the header height as offset.
- The page itself: short heading and one line of copy above the form, no hero.

## Backend: Google Sheets via Apps Script

**Where the URL lives:** `src/data/site.ts` gets `leadEndpoint`, read from
`NEXT_PUBLIC_LEAD_ENDPOINT`, empty by default. Empty means "not configured":
the JS form goes straight to the fallback buttons, and the no-JS form posts to
nothing useful, so the no-JS `action` falls back to `mailto:` (my call).

**Sending:** `POST` with `Content-Type: text/plain;charset=utf-8` and a JSON
body, so the browser sends no CORS preflight. The response is read when the
browser allows it; on an opaque or unreadable response to the final send the
form treats it as failed and shows the fallback (safe side).

**Payload fields:** `leadId`, `stage`, `source` (`quick` | `configurator`),
`name`, `company`, `email`, `phone`, `product`, `productOther`, `variety`,
`quantity`, `quantityOther`, `country`, `port`, `terms`, `notes`, `page`
(path the form was opened from), `prefilled` (yes/no), `userAgent`, `lang`.
The configurator adds its own fields as one `details` text block.

**Apps Script `doPost`:**

- Takes a script lock (`LockService`, wait up to 10 s).
- Parses JSON from `e.postData.contents`, or reads `e.parameter` for the no-JS
  form-encoded post.
- Sheet tab **"Leads"** in the "Power" spreadsheet; header row created on
  first run. Columns: `leadId, firstSeen, updated, stage, source, name,
  company, email, phone, product, productOther, variety, quantity,
  quantityOther, country, port, terms, notes, details, page, prefilled, lang,
  userAgent`.
- Finds the row by `leadId` and updates it, or appends a new one. Keeps
  `firstSeen`, sets `updated`. Never overwrites a filled cell with an empty
  value. Stage only moves forward (a late in-between send cannot turn
  `submitted` back into `quantity`).
- Any value starting with `=`, `+`, `-`, `@`, tab or carriage return gets a
  leading `'`. Values are trimmed and capped (2,000 characters).
- Ignores posts with no `leadId` or with the honeypot filled.
- Emails power@goodbizglobal.com (`MailApp`) on stage `"contact"` (new lead)
  and `"submitted"` (full request), with the visitor's email as reply-to when
  present. One alert per stage per lead.
- Returns `{ok:true}` as JSON, or a small HTML thank-you page for the no-JS post.

**Owner's decision:** the browser posts straight to the Apps Script web app,
owned and run by the account that owns the "Power" sheet in the
goodbizglobal.com Workspace (mail is sent from that account to the
power@ alias). Whether the Workspace allows "Anyone" access is checked during
setup; if it is blocked, the setup doc says how to allow it in the Admin
console, and proxying through a Next.js route is a later change, not part of
this build.

**Setup doc:** `docs/lead-sheet-setup.md`, written for the owner: create the
"Power" sheet while signed in to the goodbizglobal.com Workspace → Extensions →
Apps Script → paste `apps-script/Code.gs` → Deploy as Web app (Execute as me,
Who has access: Anyone) → authorise → copy the `/exec` URL → set
`NEXT_PUBLIC_LEAD_ENDPOINT` in Vercel and redeploy → send a test. Also covers
redeploying after edits (new version, same URL) and checking the alias receives
mail.

## Strings and RTL

All visible text for the form lives in one strings module keyed by language,
with English filled in. The component reads strings only from it. Layout uses
logical properties (`margin-inline`, `inset-inline-start`), so it works under
`dir="rtl"`.

## Tests

- **Unit (Vitest):** step validation (contact rules, other-option text required),
  which steps are visible after pre-fill and after "Something else", query-param
  sanitising (unknown, hostile, wrong-group values), payload shape, the
  fallback message text, formula-injection escaping and the "never overwrite
  with empty" merge (the Apps Script helpers are written as plain functions so
  they can be tested in Node).
- **Browser (Playwright, against the preview server, endpoint mocked by route
  interception):** contact-first send, auto-advance and Back, pre-fill skipping,
  the "Something else" path, the full flow with one `leadId` across every
  request, double-click sends once, and the failure fallback. Run at phone width
  (375 px) as well as desktop.

## Left to the builder

- Component split and file names, as long as data, strings and send logic are
  testable without rendering.
- Exact copy for hints and errors, in the site's plain voice.
- Photo choice per family card (first gallery image or `image`).
- How the type-ahead list is built and filtered.

## Open items outside this design

- Real contact details in `site.ts` (the owner will send them).
- Setting `NEXT_PUBLIC_LEAD_ENDPOINT` once the Apps Script is deployed.
- Playwright is not installed yet; the build adds it as a dev dependency.
- Most families have no `image`, so their card uses the first gallery photo.
