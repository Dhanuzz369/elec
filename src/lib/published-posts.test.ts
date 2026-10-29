import { readFileSync } from "node:fs";
import path from "node:path";
import { getAllPosts } from "@/lib/posts";

// Checks on the real posts in content/blog, as the live site publishes them.
const published = () => getAllPosts({ includeDrafts: false, now: new Date("2026-10-29T12:00:00+05:30") });
const credits = JSON.parse(readFileSync(path.join(process.cwd(), "assets/credits.json"), "utf8")) as {
  file: string;
  creditRequired: boolean;
}[];

test("all three guides are published", async () => {
  expect((await published()).map((p) => p.slug).sort()).toEqual([
    "certificates-by-country-electrical-equipment",
    "hsn-codes-electrical-panels-switchgear",
    "oil-filled-vs-dry-type-transformer-export",
  ]);
});

// The site shows no picture credits, so no published cover may need one.
test("no published cover photo needs a credit", async () => {
  for (const p of await published()) {
    if (!p.cover) continue;
    const name = path.basename(p.cover);
    const entry = credits.find((c) => path.basename(c.file) === name);
    expect(entry?.creditRequired ?? false, `${p.slug}: ${p.cover}`).toBe(false);
  }
});

// UL listings, UKCA marks, RCM and utility approvals belong to the manufacturer;
// only shipment certificates (SASO, SONCAP, PVoC) are arranged per order.
test("no guide says GoodBiz Power Systems arranges every destination's certificate", async () => {
  const banned = [
    /arranges the certificate for each shipment/i,
    /arranges the destination certificate/i,
    /arranges the conformity certificate or approval/i,
    /how GoodBiz Power Systems arranges it/i,
  ];
  for (const p of await published()) {
    const text = [p.description, p.html, ...p.faq.flatMap((f) => [f.q, f.a])].join(" ");
    for (const re of banned) expect(text, `${p.slug}: ${re}`).not.toMatch(re);
  }
});

test("the dry-type HSN range starts at 16 kVA", async () => {
  const tx = (await published()).find((p) => p.slug === "oil-filled-vs-dry-type-transformer-export")!;
  const text = [tx.html, ...tx.faq.map((f) => f.a)].join(" ");
  expect(text).not.toMatch(/85043300 up to 500 kVA/);
  expect(text).toMatch(/85043300 from 16 kVA to 500 kVA/);
});
