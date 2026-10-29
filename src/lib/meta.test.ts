import { site } from "@/data/site";
import { pageMeta, trimDescription } from "@/lib/meta";

const desc = "x".repeat(130);

test("canonical defaults to the path", () => {
  expect(pageMeta({ title: "T", description: desc, keywords: ["k"], path: "/blog" }).alternates?.canonical).toBe("/blog");
});

test("explicit canonical wins", () => {
  const m = pageMeta({ title: "T", description: desc, keywords: ["k"], path: "/blog/a", canonical: "https://other.example/a" });
  expect(m.alternates?.canonical).toBe("https://other.example/a");
  expect((m.openGraph as { url?: string }).url).toBe("https://other.example/a");
});

test("noindex keeps links followed", () => {
  expect(pageMeta({ title: "T", description: desc, keywords: ["k"], path: "/x", noindex: true }).robots).toEqual({
    index: false,
    follow: true,
  });
});

test("articles carry publish and modified times", () => {
  const og = pageMeta({
    title: "T",
    description: desc,
    keywords: ["k"], path: "/blog/a",
    type: "article",
    publishedTime: "2026-10-10",
    modifiedTime: "2026-10-12",
  }).openGraph as Record<string, unknown>;
  expect(og).toMatchObject({ type: "article", publishedTime: "2026-10-10", modifiedTime: "2026-10-12" });
});

test("open graph and twitter are filled", () => {
  const m = pageMeta({ title: "T", description: desc, keywords: ["k"], path: "/x" });
  expect(m.openGraph).toMatchObject({ siteName: site.name, locale: "en", title: `T · ${site.name}`, description: desc });
  expect(m.twitter).toMatchObject({ card: "summary_large_image", title: `T · ${site.name}`, description: desc });
});

test("rejects descriptions outside 120-160 characters", () => {
  expect(() => pageMeta({ title: "T", description: "short", keywords: ["k"], path: "/x" })).toThrow(RangeError);
  expect(() => pageMeta({ title: "T", description: "x".repeat(161), keywords: ["k"], path: "/x" })).toThrow(RangeError);
});

test("rejects a description equal to the title", () => {
  expect(() => pageMeta({ title: desc, description: desc, keywords: ["k"], path: "/x" })).toThrow(RangeError);
});

test("trimDescription cuts at a word boundary within 160", () => {
  const long = "word ".repeat(50).trim();
  const out = trimDescription(long);
  expect(out.length).toBeLessThanOrEqual(160);
  expect(out.endsWith("word.")).toBe(true);
});

test("every page carries its own keywords plus the company's", () => {
  const m = pageMeta({ title: "T", description: desc, path: "/x", keywords: ["BESCOM EPC contractor", "goodbiz power systems"] });
  const k = m.keywords as string[];
  expect(k[0]).toBe("BESCOM EPC contractor");
  expect(k).toContain("electrical equipment exporter India");
  expect(k.filter((x) => x.toLowerCase() === site.name.toLowerCase())).toHaveLength(1);
});

test("every page has a share image, even without its own", () => {
  const m = pageMeta({ title: "T", description: desc, path: "/x", keywords: ["k"] });
  expect((m.openGraph as { images: { url: string }[] }).images[0].url).toBe("/opengraph-image");
  expect((m.twitter as { images: string[] }).images[0]).toBe("/opengraph-image");
});

test("the home title is not branded twice", () => {
  const m = pageMeta({ title: `${site.name} · Panels`, description: desc, path: "/", keywords: ["k"] });
  expect((m.openGraph as { title: string }).title).toBe(`${site.name} · Panels`);
});
