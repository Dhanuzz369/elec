import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

// GoodBiz Power Systems sources every product; no page may claim it manufactures.
const BANNED = [
  /made in india/i,
  /our factory/i,
  /\bwe build\b/i,
  /built in india/i,
  /built or sourced/i,
  /\bwe fit\b/i,
  /\bwound in\b/i,
  /built for your grid/i,
  /\bwe manufacture\b/i,
  /manufactured by goodbiz/i,
];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    if (/\.test\.tsx?$/.test(name) || name === "hsn.json") return [];
    return /\.(tsx?|md|json)$/.test(name) ? [p] : [];
  });
}

test("no copy claims GoodBiz Power Systems manufactures", () => {
  const hits: string[] = [];
  for (const file of files(path.join(process.cwd(), "src"))) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (BANNED.some((re) => re.test(line))) hits.push(`${path.relative(process.cwd(), file)}:${i + 1}`);
      });
  }
  expect(hits).toEqual([]);
});

test("the company is called GoodBiz Power Systems everywhere", () => {
  const hits: string[] = [];
  const dirs = [path.join(process.cwd(), "src"), path.join(process.cwd(), "content/blog")];
  for (const file of dirs.flatMap(files).filter((f) => !f.includes("__fixtures__"))) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        // shortName is the one sanctioned use: the first word of the two-size wordmark.
        if (/GoodBiz(?! Power Systems)/.test(line) && !/shortName: "GoodBiz"/.test(line)) hits.push(`${path.relative(process.cwd(), file)}:${i + 1}`);
      });
  }
  expect(hits).toEqual([]);
});

test("the ban list allows honest sourcing language", () => {
  for (const ok of ["We don't manufacture, and that's deliberate.", "sourcing from India's manufacturers"])
    expect(BANNED.some((re) => re.test(ok))).toBe(false);
  for (const bad of ["We manufacture panels", "Manufactured by GoodBiz Power Systems"])
    expect(BANNED.some((re) => re.test(bad))).toBe(true);
});

// The owner's facts: 25+ years in power distribution (with group companies); licensed EPC for
// BESCOM and other public discoms; projects for KPTCL. Never fuse them into "25 years of EPC licence".
test("the track record is never overstated", () => {
  const hits: string[] = [];
  for (const file of files(path.join(process.cwd(), "src"))) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (/years as a licensed EPC|licensed EPC[^.]*KPTCL/i.test(line)) hits.push(`${path.relative(process.cwd(), file)}:${i + 1}`);
      });
  }
  expect(hits).toEqual([]);
});
