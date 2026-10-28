import { absoluteUrl, mailtoHref, resolveSiteUrl, site, whatsappHref } from "@/data/site";

test("url has no trailing slash", () => {
  expect(site.url.endsWith("/")).toBe(false);
});

test("absoluteUrl joins once", () => {
  expect(absoluteUrl("/blog")).toBe(`${site.url}/blog`);
  expect(absoluteUrl("blog")).toBe(`${site.url}/blog`);
  expect(absoluteUrl("/")).toBe(`${site.url}/`);
});

test("mailto encodes subject and body", () => {
  expect(mailtoHref("A & B", "x\ny")).toBe(`mailto:${site.email}?subject=A%20%26%20B&body=x%0Ay`);
});

test("whatsapp link", () => {
  expect(whatsappHref()).toBe(`https://wa.me/${site.whatsapp}`);
});

test("an explicit NEXT_PUBLIC_SITE_URL wins and loses its trailing slash", () => {
  expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://www.goodbizpower.com/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" })).toBe(
    "https://www.goodbizpower.com",
  );
});

test("on Vercel without an override, the production host is used", () => {
  expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "goodbizelec-navy.vercel.app" })).toBe(
    "https://goodbizelec-navy.vercel.app",
  );
});

test("locally, the future domain is the fallback", () => {
  expect(resolveSiteUrl({})).toBe("https://www.goodbizpower.com");
});

test("the placeholder domain is gone", () => {
  expect(site.url).not.toContain("goodbiz.example");
});

test("whatsapp link can carry a pre-written message", () => {
  expect(whatsappHref("a b")).toBe(`https://wa.me/${site.whatsapp}?text=a%20b`);
});

test("lead endpoint is empty unless configured", () => {
  expect(typeof site.leadEndpoint).toBe("string");
});
