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

test("home and footer link to About", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "More about us" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("footer").getByRole("link", { name: "About us" })).toHaveAttribute("href", "/about");
});

test("the highlight sits exactly on the chosen row", async ({ page }, info) => {
  test.skip(info.project.name === "phone", "the phone layout fills the chosen button instead");
  await page.goto("/about");
  await page.evaluate(() => document.fonts.ready);
  for (const name of ["Residential apartments", "IT parks"]) {
    const tab = page.getByRole("tab", { name });
    await tab.click();
    await expect
      .poll(() =>
        tab.evaluate((t) => {
          const fill = t.parentElement!.querySelector<HTMLElement>(".ap-tab-fill")!;
          return [fill.style.getPropertyValue("--t"), fill.style.getPropertyValue("--rh")].join();
        }),
      )
      .toBe(await tab.evaluate((t) => [`${t.offsetTop}px`, `${t.offsetHeight}px`].join()));
  }
});

test("every project photo actually loads when chosen", async ({ page }) => {
  await page.goto("/about");
  for (const name of ["Commercial buildings", "IT parks", "Industries"]) {
    await page.getByRole("tab", { name }).click();
    await expect
      .poll(() => active(page).locator(".ap-photo img").evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth))
      .toBeGreaterThan(0);
  }
});
