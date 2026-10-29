import { expect, test } from "@playwright/test";

test("home answers buyer questions on the page and in FAQ markup", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Does GoodBiz Power Systems manufacture the equipment?")).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join()).toContain('"FAQPage"');
});

test("every page links its RSS feed and shows when it was updated", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute("href", /\/feed\.xml$/);
  await expect(page.locator("footer time")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
});

test("AI discovery files are served", async ({ request }) => {
  const ai = await request.get("/.well-known/ai.txt");
  expect(ai.ok()).toBe(true);
  expect(await ai.text()).toContain("User-agent: *");
  for (const p of ["/ai/summary.json", "/ai/faq.json", "/ai/service.json"]) {
    const r = await request.get(p);
    expect(r.ok(), p).toBe(true);
    expect(r.headers()["content-type"]).toContain("application/json");
  }
  const summary = await (await request.get("/ai/summary.json")).json();
  expect(summary.name).toBe("GoodBiz Power Systems");
});

test("the HSN finder opens on the search in the address", async ({ page }) => {
  await page.goto("/hsn-code-finder?q=85042100");
  await expect(page.getByLabel("Search products or HSN codes")).toHaveValue("85042100");
  await expect(page.locator(".results").getByText("85042100").first()).toBeVisible();
});

test("an agent asking for Markdown gets Markdown; browsers still get HTML", async ({ request }) => {
  const md = await request.get("/", { headers: { Accept: "text/markdown" } });
  expect(md.ok()).toBe(true);
  expect(md.headers()["content-type"]).toContain("text/markdown");
  expect(await md.text()).toMatch(/^# GoodBiz Power Systems/);
  const kenya = await request.get("/export/kenya", { headers: { Accept: "text/markdown, text/html;q=0.5" } });
  expect(await kenya.text()).toContain("Port of Mombasa");
  const html = await request.get("/export/kenya", { headers: { Accept: "text/html" } });
  expect(html.headers()["content-type"]).toContain("text/html");
});
