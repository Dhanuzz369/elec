# Getting goodbizpower.com indexed

The site is built to be found: every page has a canonical URL on
`https://www.goodbizpower.com`, the sitemap and robots.txt list every page,
structured data describes the business, products and FAQs, and `llms.txt`
gives AI answer engines a plain summary. Search engines still have to be told
the domain exists and is yours. Do these once.

## 1. Google Search Console (Google Search, AI Overviews, Gemini)

1. Open [search.google.com/search-console](https://search.google.com/search-console)
   signed in with the goodbizglobal.com Workspace account.
2. **Add property → Domain** → `goodbizpower.com`. Google shows a TXT record.
   Add it at your domain registrar's DNS settings and click **Verify**.
   (A Domain property covers www, the bare domain and http in one go.)
   - Can't edit DNS? Choose **URL prefix** → `https://www.goodbizpower.com/`
     → **HTML tag**, copy only the `content="…"` value, set it in Vercel as
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, then click **Verify**.
3. **Sitemaps** → submit `https://www.goodbizpower.com/sitemap.xml`.
4. **URL inspection** → paste `https://www.goodbizpower.com/` → **Request indexing**.
   Repeat for `/products`, `/quote` and each product page you care most about.
5. If the old address was ever verified: in the old property use
   **Settings → Change of address** pointing to goodbizpower.com.

## 2. Bing Webmaster Tools (Bing, ChatGPT search, Copilot, DuckDuckGo)

ChatGPT search and Copilot rely heavily on Bing's index, so this matters for
AI answers as much as for Bing itself.

1. Open [bing.com/webmasters](https://www.bing.com/webmasters).
2. **Import from Google Search Console** (fastest; it copies the verified site
   and sitemap). Or add the site and verify with the meta tag: set the value in
   Vercel as `NEXT_PUBLIC_BING_SITE_VERIFICATION` and redeploy.
3. Submit the sitemap if it was not imported.

## 3. Things only you can add, and why they matter

Ranking and AI citations depend on trust signals the code cannot invent:

- **Real contact details** in `src/data/site.ts` (email, phone, WhatsApp,
  address, legal name). Until then they are left out of structured data on
  purpose, because fake details hurt more than missing ones.
- **Google Business Profile** for the office, with the same name, address and
  phone as the site.
- **Profiles that point back to the site**: LinkedIn company page, IndiaMART,
  TradeIndia, Alibaba, Export Promotion Council listings. Add each URL to
  `sameAs` in `src/data/site.ts`; it tells Google and AI models these are the
  same business.
- **Proof**: certificates, shipment photos, a few named projects or countries
  shipped to. These become case-study pages and answer "can I trust them?".
- **Fresh guides** on the blog, weekly as planned. Answer engines quote pages
  that answer one question clearly.

Expect Google to show the new domain within days and to settle rankings over
weeks to a few months. Nobody can promise first place; these steps remove
everything that would hold the site back.
