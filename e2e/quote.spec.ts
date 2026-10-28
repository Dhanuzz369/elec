import { expect, test, type Page } from "@playwright/test";

type Lead = Record<string, string>;

// Intercepts the lead endpoint, records every body, and answers {ok:true}
// unless `fail` says which stages should get a server error.
async function mockEndpoint(page: Page, fail: (lead: Lead) => boolean = () => false) {
  const leads: Lead[] = [];
  await page.route("https://lead.test/**", async (route) => {
    const lead = JSON.parse(route.request().postData() ?? "{}") as Lead;
    leads.push(lead);
    const bad = fail(lead);
    await route.fulfill({
      status: bad ? 500 : 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ ok: !bad }),
    });
  });
  return leads;
}

const step = (page: Page) => page.locator("section[data-active]");
const form = (page: Page) => page.getByTestId("quote-form");

async function fillContact(page: Page) {
  await page.getByLabel("Your name").fill("Amina Okafor");
  await page.getByLabel("Email").fill("amina@example.com");
  await page.getByTestId("quote-next").click();
  await expect(step(page)).not.toHaveAttribute("data-step", "contact");
}

test("contact is sent on the first Next", async ({ page }) => {
  const leads = await mockEndpoint(page);
  await page.goto("/quote");
  await fillContact(page);
  await expect.poll(() => leads.length).toBe(1);
  expect(leads[0].stage).toBe("contact");
  expect(leads[0].email).toBe("amina@example.com");
  expect(leads[0].leadId).toMatch(/-/);
});

test("invalid contact shows an inline error and focuses the field", async ({ page }) => {
  const leads = await mockEndpoint(page);
  await page.goto("/quote");
  await page.getByLabel("Your name").fill("Amina");
  await page.getByTestId("quote-next").click();
  await expect(page.locator("#qf-email-error")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeFocused();
  await expect(step(page)).toHaveAttribute("data-step", "contact");
  expect(leads).toHaveLength(0);
});

test("tapping a card advances; arrow keys do not", async ({ page }) => {
  await mockEndpoint(page);
  await page.goto("/quote");
  await fillContact(page);
  await expect(step(page)).toHaveAttribute("data-step", "product");

  const first = page.locator('input[name="product"][value="lt-panels"]');
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(600);
  await expect(step(page)).toHaveAttribute("data-step", "product");
  await expect(page.locator('input[name="product"]:checked')).not.toHaveValue("lt-panels");

  await form(page).getByText("Transformers", { exact: true }).click();
  await expect(step(page)).toHaveAttribute("data-step", "variety", { timeout: 1000 });

  await page.getByRole("button", { name: "Back" }).click();
  await expect(step(page)).toHaveAttribute("data-step", "product");
  await expect(page.locator('input[name="product"][value="transformers"]')).toBeChecked();
});

test("pre-fill skips steps", async ({ page }) => {
  await mockEndpoint(page);
  await page.goto("/quote?product=lt-panels&variety=motor-control-centre-mcc");
  await expect(page.getByTestId("quote-progress")).toHaveText("Step 1 of 5");
  await fillContact(page);
  await expect(step(page)).toHaveAttribute("data-step", "quantity");
  await expect(page.getByTestId("quote-progress")).toHaveText("Step 2 of 5");
});

test("hostile pre-fill is ignored", async ({ page }) => {
  await mockEndpoint(page);
  await page.goto("/quote?product=%3Cscript%3E&variety=x");
  await expect(page.getByTestId("quote-progress")).toHaveText("Step 1 of 7");
});

test("something else skips the variety step", async ({ page }) => {
  const leads = await mockEndpoint(page);
  await page.goto("/quote");
  await fillContact(page);
  await form(page).getByText("Something else", { exact: true }).click();
  await expect(page.getByLabel("Which product?")).toBeFocused();
  await page.getByLabel("Which product?").fill("cable trays");
  await page.keyboard.press("Enter");
  await expect(step(page)).toHaveAttribute("data-step", "quantity");
  await expect.poll(() => leads.at(-1)?.productOther).toBe("cable trays");
});

async function walkToNotes(page: Page) {
  await page.goto("/quote");
  await fillContact(page);
  await form(page).getByText("Transformers", { exact: true }).click();
  await form(page).getByText("Dry-type (cast resin)").click();
  await form(page).getByText("2–5 units").click();
  await page.getByLabel("Country").fill("ken");
  await page.getByRole("option", { name: "Kenya" }).click();
  await page.getByTestId("quote-next").click();
  await form(page).getByText("DAP your site").click();
  await expect(step(page)).toHaveAttribute("data-step", "notes");
  await page.getByLabel("Notes (optional)").fill("Needed by March.");
}

test("full flow keeps one leadId and ends submitted", async ({ page }) => {
  const leads = await mockEndpoint(page);
  await walkToNotes(page);
  await page.getByTestId("quote-next").click();
  await expect(page.getByTestId("quote-success")).toBeFocused({ timeout: 6000 });
  const last = leads.at(-1)!;
  expect(last.stage).toBe("submitted");
  expect(last.product).toBe("Transformers");
  expect(last.variety).toBe("Dry-type (cast resin)");
  expect(last.country).toBe("Kenya");
  expect(last.terms).toBe("DAP your site");
  expect(new Set(leads.map((l) => l.leadId)).size).toBe(1);
  expect(leads.map((l) => l.stage)).toEqual(["contact", "product", "variety", "quantity", "destination", "terms", "submitted"]);
});

test("refresh keeps the lead id", async ({ page }) => {
  const leads = await mockEndpoint(page);
  await page.goto("/quote");
  await fillContact(page);
  await page.reload();
  await fillContact(page);
  const contacts = leads.filter((l) => l.stage === "contact");
  expect(contacts).toHaveLength(2);
  expect(contacts[0].leadId).toBe(contacts[1].leadId);
});

test("double-click sends once", async ({ page }) => {
  const leads = await mockEndpoint(page);
  await walkToNotes(page);
  await page.getByTestId("quote-next").dblclick();
  await expect(page.getByTestId("quote-success")).toBeVisible({ timeout: 6000 });
  expect(leads.filter((l) => l.stage === "submitted")).toHaveLength(1);
});

test("failure shows the fallback with the request written in", async ({ page }) => {
  await mockEndpoint(page, (l) => l.stage === "submitted");
  await walkToNotes(page);
  await page.getByTestId("quote-next").click();
  const whatsapp = page.getByTestId("fallback-whatsapp");
  await expect(whatsapp).toBeVisible({ timeout: 6000 });
  const href = decodeURIComponent((await whatsapp.getAttribute("href")) ?? "");
  expect(href).toContain("wa.me/");
  expect(href).toContain("Country: Kenya");
  expect(await page.getByTestId("fallback-email").getAttribute("href")).toMatch(/^mailto:/);
  await expect(page.getByLabel("Notes (optional)")).toHaveValue("Needed by March.");
});

test("honeypot shows success without sending", async ({ page }) => {
  const leads = await mockEndpoint(page);
  await page.goto("/quote");
  // Real visitors never see it; a bot ticks it.
  await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => el.click());
  await fillContact(page);
  await form(page).getByText("Something else", { exact: true }).click();
  await page.getByLabel("Which product?").fill("x");
  await page.keyboard.press("Enter");
  await form(page).getByText("Single unit / sample").click();
  await page.getByLabel("Country").fill("Kenya");
  await page.getByTestId("quote-next").click();
  await form(page).getByText("Not sure", { exact: true }).click();
  await expect(step(page)).toHaveAttribute("data-step", "notes");
  await page.getByTestId("quote-next").click();
  await expect(page.getByTestId("quote-success")).toBeVisible({ timeout: 6000 });
  expect(leads.filter((l) => l.stage === "submitted")).toHaveLength(0);
});

test("the page fits a phone without sideways scrolling", async ({ page }) => {
  await page.goto("/quote");
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("every step shows with one submit button", async ({ page }) => {
    await page.goto("/quote");
    await expect(page.locator("section[data-step]")).toHaveCount(6);
    for (const s of await page.locator("section[data-step]").all()) await expect(s).toBeVisible();
    await expect(page.getByRole("button", { name: "Send request" })).toBeVisible();
    await expect(page.locator("form")).toHaveAttribute("action", "https://lead.test/exec");
  });
});
