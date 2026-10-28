import { readFileSync } from "node:fs";
import path from "node:path";
import { families } from "@/data/products";

const read = (p: string) => readFileSync(path.resolve(__dirname, "../..", p), "utf8");

test("the footer carries no picture credits", () => {
  expect(read("src/components/SiteFooter.tsx")).not.toMatch(/Pictures:|wikimedia|credits/i);
});

// Photos that need a credit (CC BY, CC BY-SA) may only be shown alongside one;
// with the credits gone, none may appear on the site.
test("no page shows a stock photo that needs attribution", () => {
  for (const file of ["src/app/page.tsx", "src/app/products/[slug]/page.tsx"]) {
    expect(read(file)).not.toMatch(/cerepova|high-voltage-switchgear|chilime|japanese-transmission/);
  }
  for (const f of families) expect(f.image).toBeUndefined();
});
