import { existsSync } from "node:fs";
import path from "node:path";
import { getFamily } from "@/data/products";

const onDisk = (src: string) => existsSync(path.join(process.cwd(), "public", src));

test("transformers show the three transformer photos", () => {
  const g = getFamily("transformers")!.gallery ?? [];
  expect(g.map((p) => p.src)).toEqual([
    "/images/products/transformer-oil-onan.webp",
    "/images/products/transformer-power-onaf.webp",
    "/images/products/transformer-dry-cast-resin.webp",
  ]);
});

test("busbars and parts show the three parts photos", () => {
  const g = getFamily("parts")!.gallery ?? [];
  expect(g.map((p) => p.src)).toEqual([
    "/images/products/busbars-copper-supports.webp",
    "/images/products/insulators-epoxy-shrouds.webp",
    "/images/products/terminals-lugs-ducts.webp",
  ]);
});

test("every gallery photo exists and has alt text and a caption", () => {
  for (const slug of ["transformers", "parts"]) {
    for (const p of getFamily(slug)!.gallery ?? []) {
      expect(onDisk(p.src), p.src).toBe(true);
      expect(p.alt.length).toBeGreaterThan(20);
      expect(p.caption.length).toBeGreaterThan(3);
    }
  }
});
