import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { families } from "@/data/products";
import { aboutFaq, photoAlt, projectTypes } from "@/data/projects";

const pub = (src: string) => path.join(process.cwd(), "public", src);

test("four project types in page order", () => {
  expect(projectTypes.map((p) => p.id)).toEqual(["apartments", "commercial", "it-parks", "industries"]);
  for (const p of projectTypes) {
    expect(p.needs).toHaveLength(5);
    expect(p.watch).toHaveLength(3);
  }
});

test("every photo exists and every link goes to a real product family", () => {
  const slugs = families.map((f) => `/products/${f.slug}`);
  for (const p of projectTypes) {
    expect(existsSync(pub(p.photo.src))).toBe(true);
    for (const n of p.needs) {
      if (n.image) expect(existsSync(pub(n.image))).toBe(true);
      if (n.href) expect(slugs).toContain(n.href);
    }
  }
});

test("project photos are free to use without credit", () => {
  const credits = JSON.parse(readFileSync(path.join(process.cwd(), "assets/credits.json"), "utf8")) as {
    file: string;
    license: string;
    creditRequired: boolean;
  }[];
  for (const p of projectTypes) {
    const c = credits.find((x) => x.file === `public${p.photo.src}`);
    expect(c?.license).toMatch(/^(CC0|Public domain)$/);
    expect(c?.creditRequired).toBe(false);
  }
});

test("watch lines are not India-only rules", () => {
  expect(JSON.stringify(projectTypes)).not.toMatch(/BESCOM|KPTCL|discom/i);
});

test("the About questions answer with what is on the page", () => {
  const faq = aboutFaq();
  expect(faq).toHaveLength(projectTypes.length + 1);
  expect(faq[0].a).toMatch(/25\+ years in power distribution/);
  projectTypes.forEach((p, i) => {
    for (const n of p.needs) expect(faq[i + 1].a).toContain(n.name);
    for (const w of p.watch) expect(faq[i + 1].a).toContain(w);
  });
});

// An alt text that repeats the card's own label is read twice by screen readers.
test("each product card photo has its own description, not the card label", () => {
  for (const p of projectTypes)
    for (const n of p.needs) {
      if (!n.image) continue;
      const alt = photoAlt(n.image);
      expect(alt, n.name).toBeTruthy();
      expect(alt.toLowerCase()).not.toBe(n.name.toLowerCase());
    }
});
