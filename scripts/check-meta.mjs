// Checks every prerendered page after `next build`: one unique <title>, one
// unique 120–160 character meta description, and a canonical link.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".next/server/app");
const SKIP = /(^|\/)(_not-found|404|500)\.html$/;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const problems = [];
const titles = new Map();
const descriptions = new Map();
const pages = walk(ROOT).filter((f) => !SKIP.test(path.relative(ROOT, f)));

for (const file of pages) {
  const route = "/" + path.relative(ROOT, file).replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
  const html = readFileSync(file, "utf8");
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  if (!title) problems.push(`${route}: missing <title>`);
  if (!description) problems.push(`${route}: missing meta description`);
  else if (description.length < 120 || description.length > 160)
    problems.push(`${route}: description is ${description.length} characters (keep 120–160)`);
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) problems.push(`${route}: missing canonical link`);
  const keywords = decode(html.match(/<meta name="keywords" content="([^"]*)"/)?.[1] ?? "");
  if (keywords.split(",").filter((k) => k.trim()).length < 8) problems.push(`${route}: fewer than 8 keywords`);
  if (!/<meta property="og:image" content="[^"]+"/.test(html)) problems.push(`${route}: missing og:image`);
  if (!/<meta name="geo.region" content="IN-KA"/.test(html)) problems.push(`${route}: missing geo.region`);
  // Product and post pages have their own share card (opengraph-image.tsx in the segment).
  if (/^\/(products|blog)\/[^/]+$/.test(route) && !route.startsWith("/blog/tag") && !html.includes(`${route}/opengraph-image`))
    problems.push(`${route}: share image is not the page's own card`);
  for (const [map, value] of [
    [titles, title],
    [descriptions, description],
  ]) {
    if (!value) continue;
    map.set(value, [...(map.get(value) ?? []), route]);
  }
}

for (const [value, routes] of titles) if (routes.length > 1) problems.push(`duplicate title "${value}": ${routes.join(", ")}`);
for (const [value, routes] of descriptions)
  if (routes.length > 1) problems.push(`duplicate description "${value.slice(0, 50)}…": ${routes.join(", ")}`);

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`OK ${pages.length} pages`);
