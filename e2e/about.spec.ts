import { expect, test, type Page } from "@playwright/test";

const panels = (page: Page) => page.locator("[data-project]");
const active = (page: Page) => page.locator("[data-project][data-active]");

test("the About page has its six sections", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("25 years");
  for (const h of [
    "Utility work is the hardest school there is",
    "Every project needs different power.",
    "Everything your installation needs, from one partner",
    "Tailored, not off the shelf",
    "Tell us about your project",
  ])
    await expect(page.getByRole("heading", { name: h })).toBeVisible();
});

test("choosing a project type shows its panel only", async ({ page }) => {
  await page.goto("/about");
  await expect(active(page)).toHaveAttribute("data-project", "apartments");
  for (const [name, id] of [
    ["IT parks", "it-parks"],
    ["Industries", "industries"],
    ["Commercial buildings", "commercial"],
  ]) {
    await page.getByRole("tab", { name }).click();
    await expect(active(page)).toHaveAttribute("data-project", id);
    await expect(active(page).locator("img").first()).toBeVisible();
  }
  await expect(page.locator("[data-project]:not([data-active])[inert]")).toHaveCount(3);
});

test("rapid clicks end on the last choice", async ({ page }) => {
  await page.goto("/about");
  for (const name of ["Industries", "IT parks", "Commercial buildings", "Industries"])
    await page.getByRole("tab", { name }).click();
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
