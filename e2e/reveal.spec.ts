import { expect, test } from "@playwright/test";

// What is on screen at load must never be hidden by the scroll reveal.
test("first-screen content stays visible once JavaScript starts", async ({ page }) => {
  await page.goto("/export/saudi-arabia");
  await page.waitForFunction(() => document.documentElement.classList.contains("js"));
  const opacity = await page.locator(".country-head h1").evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
  await expect(page.locator(".country-head h1")).toHaveAttribute("data-in", "true");
});
