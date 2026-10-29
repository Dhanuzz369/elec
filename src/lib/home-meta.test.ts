import { readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/data/site";
import { HOME_TITLE } from "@/lib/meta";

const src = (f: string) => readFileSync(path.join(process.cwd(), f), "utf8");

test("home title leads with the brand and stays under 60 characters", () => {
  expect(HOME_TITLE.startsWith(site.name)).toBe(true);
  expect(HOME_TITLE.length).toBeLessThanOrEqual(60);
});

test("home page and layout both use the shared home title", () => {
  expect(src("src/app/page.tsx")).toContain("absolute: HOME_TITLE");
  expect(src("src/app/layout.tsx")).toContain("default: HOME_TITLE");
});

// Answer engines check that the page description and the company description agree.
test("the home description opens like the company description", () => {
  const src = readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
  const desc = src.match(/description:\s*"([^"]+)"/)![1];
  expect(site.description.toLowerCase().slice(0, 100)).toContain(desc.toLowerCase().slice(0, 30));
});

test("home has H3 subheadings under its H2 sections", () => {
  const src = readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
  expect(src).toMatch(/<h3[ >]/);
});
