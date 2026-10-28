import { defineConfig, devices } from "@playwright/test";

// Browser tests for the quick quote form. They build the site with a fake lead
// endpoint (https://lead.test/exec) that each test intercepts.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3020" },
  webServer: {
    command: "npm run build && npx next start -p 3020",
    port: 3020,
    env: { NEXT_PUBLIC_LEAD_ENDPOINT: "https://lead.test/exec" },
    reuseExistingServer: false,
    timeout: 240_000,
  },
  projects: [
    { name: "phone", use: { ...devices["iPhone 13"], browserName: "chromium" } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
});
