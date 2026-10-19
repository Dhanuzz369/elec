import { absoluteUrl, mailtoHref, site, whatsappHref } from "@/data/site";

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
