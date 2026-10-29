import { expect, test } from "@playwright/test";

test("home H1 says what is sold, and the brand logos carry a non-affiliation note", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Panels and transformers");
  await expect(page.getByText(/not an authorised distributor/)).toBeVisible();
});

test("country H1 names the products and the country", async ({ page }) => {
  await page.goto("/export/saudi-arabia");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Electrical panels and transformers for Saudi Arabia");
});

test("product pages link to every country page", async ({ page }) => {
  await page.goto("/products/transformers");
  const links = page.locator('a[href^="/export/"]');
  await expect(links).toHaveCount(18);
  await expect(page.getByRole("link", { name: "Saudi Arabia" })).toHaveAttribute("href", "/export/saudi-arabia");
});

test("About answers who GoodBiz Power Systems is, on the page", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Who is GoodBiz Power Systems?")).toBeVisible();
});

test("each country page has its own network, port and certificate notes", async ({ page }) => {
  await page.goto("/export/kenya");
  await expect(page.getByRole("heading", { name: "Supplying Kenya" })).toBeVisible();
  await expect(page.getByText(/Port of Mombasa/)).toBeVisible();
  await page.goto("/export/indonesia");
  await expect(page.getByText(/Tanjung Priok/)).toBeVisible();
  await expect(page.getByText(/Last updated 19 October 2026/)).toHaveCount(0);
});
