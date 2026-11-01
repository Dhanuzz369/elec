import { expect, test, type Page } from "@playwright/test";

type Ev = [string, string, Record<string, string>];
const events = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [])
      .map((a) => Array.from(a as ArrayLike<unknown>))
      .filter((a) => a[0] === "event"),
  ) as Promise<Ev[]>;

test.beforeEach(async ({ page }) => {
  // Never reach Google from tests; the dataLayer still records every call.
  await page.route(/googletagmanager\.com|google-analytics\.com/, (r) => r.abort());
  await page.route("https://lead.test/**", (r) =>
    r.fulfill({ status: 200, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }, body: '{"ok":true}' }),
  );
});

test("a finished quote is recorded as a lead without personal data", async ({ page }) => {
  const form = page.getByTestId("quote-form");
  const step = page.locator("section[data-active]");
  await page.goto("/quote");
  await page.getByLabel("Your name").fill("Amina Okafor");
  await page.getByLabel("Email").fill("amina@example.com");
  await page.getByTestId("quote-next").click();
  await expect(step).not.toHaveAttribute("data-step", "contact");
  await form.getByText("Transformers", { exact: true }).click();
  await form.getByText("Dry-type (cast resin)").click();
  await form.getByText("2–5 units").click();
  await page.getByLabel("Country").fill("ken");
  await page.getByRole("option", { name: "Kenya" }).click();
  await page.getByTestId("quote-next").click();
  await form.getByText("DAP your site").click();
  await expect(step).toHaveAttribute("data-step", "notes");
  await page.getByLabel("Notes (optional)").fill("Call Amina on +254 700 000 000");
  await page.getByTestId("quote-next").click();
  await expect(page.getByTestId("quote-success")).toBeVisible({ timeout: 8000 });

  const all = await events(page);
  expect(all.filter((e) => e[1] === "quote_step").map((e) => e[2].step)).toEqual([
    "contact",
    "product",
    "variety",
    "quantity",
    "destination",
    "terms",
  ]);
  const lead = all.find((e) => e[1] === "generate_lead");
  expect(lead?.[2]).toMatchObject({ lead_source: "quick_quote", product: "transformers", country: "Kenya" });
  expect(JSON.stringify(all)).not.toMatch(/amina|okafor|254 700/i);
});

test("WhatsApp and email clicks are recorded", async ({ page }) => {
  await page.goto("/about");
  await page.evaluate(() => document.addEventListener("click", (e) => e.preventDefault(), true));
  await page.locator('footer a[href^="https://wa.me"]').click();
  await page.locator('footer a[href^="mailto:"]').click();
  const methods = (await events(page)).filter((e) => e[1] === "contact_click").map((e) => e[2].method);
  expect(methods).toEqual(["whatsapp", "email"]);
});

test.describe("visitors in Europe", () => {
  test.use({ timezoneId: "Europe/Berlin" });
  test("are asked before analytics cookies, and the choice sticks", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Cookie choice" });
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Accept" }).click();
    await expect(banner).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("region", { name: "Cookie choice" })).toHaveCount(0);
  });
});

test.describe("visitors elsewhere", () => {
  test.use({ timezoneId: "Asia/Kolkata" });
  test("see no cookie banner", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(800);
    await expect(page.getByRole("region", { name: "Cookie choice" })).toHaveCount(0);
  });
});

test("gtag.js waits for the visitor's first interaction", async ({ page }) => {
  const gtagRequests: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("googletagmanager.com/gtag/js")) gtagRequests.push(r.url());
  });
  await page.goto("/about");
  await page.waitForTimeout(1500);
  expect(gtagRequests).toHaveLength(0);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => gtagRequests.length).toBe(1);
});
