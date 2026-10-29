import { expect, test } from "@playwright/test";

// What is on screen at load must never be hidden by the scroll reveal.
test("first-screen content stays visible once JavaScript starts", async ({ page }) => {
  await page.goto("/export/saudi-arabia");
  await page.waitForFunction(() => document.documentElement.classList.contains("js"));
  const opacity = await page.locator(".country-head h1").evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
  await expect(page.locator(".country-head h1")).toHaveAttribute("data-in", "true");
});

// WCAG 2.5.8 and Lighthouse: standalone links and tabs need room for a thumb.
test("header links, footer links and About tabs are at least 44px tall", async ({ page }) => {
  await page.goto("/about");
  const heights = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".nav .link, .footer-cols .link, .ap-tab[role=tab]")]
      .filter((el) => el.offsetParent !== null)
      .map((el) => [el.textContent?.trim(), Math.round(el.getBoundingClientRect().height)] as const),
  );
  expect(heights.length).toBeGreaterThan(5);
  for (const [name, h] of heights) expect(h, String(name)).toBeGreaterThanOrEqual(44);
});

test.describe("the smallest phones (320px)", () => {
  test.use({ viewport: { width: 320, height: 640 } });
  for (const path of ["/", "/about", "/export/saudi-arabia", "/quote"]) {
    test(`${path} does not scroll sideways`, async ({ page }) => {
      await page.goto(path);
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width).toBeLessThanOrEqual(320);
    });
  }
});
