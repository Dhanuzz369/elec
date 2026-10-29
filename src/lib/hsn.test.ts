import { readFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_HSN_COUNT, defaultHsnEntries, hsnEntries } from "@/lib/hsn";

test("default rows are the first ones shown before any search", () => {
  const rows = defaultHsnEntries();
  expect(rows).toHaveLength(DEFAULT_HSN_COUNT);
  expect(rows.every((e) => /^853[678]|^85042/.test(e.code))).toBe(true);
});

test("all entries are 85-chapter codes", () => {
  expect(hsnEntries().every((e) => e.code.startsWith("85"))).toBe(true);
});

test("the HSN finder page term set uses only the default-visible rows", () => {
  const src = readFileSync(path.join(process.cwd(), "src/app/hsn-code-finder/page.tsx"), "utf8");
  expect(src).toContain("hsnTermSetLd(defaultHsnEntries())");
});

test("the HSN finder shows the same default rows", () => {
  const src = readFileSync(path.join(process.cwd(), "src/components/HsnFinder.tsx"), "utf8");
  expect(src).toContain("defaultHsnEntries()");
});
