import { site } from "@/data/site";
import { pageMeta, trimDescription } from "@/lib/meta";

const desc = "x".repeat(130);

test("canonical defaults to the path", () => {
  expect(pageMeta({ title: "T", description: desc, path: "/blog" }).alternates?.canonical).toBe("/blog");
});

test("explicit canonical wins", () => {
  const m = pageMeta({ title: "T", description: desc, path: "/blog/a", canonical: "https://other.example/a" });
  expect(m.alternates?.canonical).toBe("https://other.example/a");
  expect((m.openGraph as { url?: string }).url).toBe("https://other.example/a");
});

test("noindex keeps links followed", () => {
  expect(pageMeta({ title: "T", description: desc, path: "/x", noindex: true }).robots).toEqual({
    index: false,
    follow: true,
  });
});

test("articles carry publish and modified times", () => {
  const og = pageMeta({
    title: "T",
    description: desc,
    path: "/blog/a",
    type: "article",
    publishedTime: "2026-10-10",
    modifiedTime: "2026-10-12",
  }).openGraph as Record<string, unknown>;
  expect(og).toMatchObject({ type: "article", publishedTime: "2026-10-10", modifiedTime: "2026-10-12" });
});

test("open graph and twitter are filled", () => {
  const m = pageMeta({ title: "T", description: desc, path: "/x" });
  expect(m.openGraph).toMatchObject({ siteName: site.name, locale: "en", title: "T", description: desc });
  expect(m.twitter).toMatchObject({ card: "summary_large_image", title: "T", description: desc });
});

test("rejects descriptions outside 120-160 characters", () => {
  expect(() => pageMeta({ title: "T", description: "short", path: "/x" })).toThrow(RangeError);
  expect(() => pageMeta({ title: "T", description: "x".repeat(161), path: "/x" })).toThrow(RangeError);
});

test("rejects a description equal to the title", () => {
  expect(() => pageMeta({ title: desc, description: desc, path: "/x" })).toThrow(RangeError);
});

test("trimDescription cuts at a word boundary within 160", () => {
  const long = "word ".repeat(50).trim();
  const out = trimDescription(long);
  expect(out.length).toBeLessThanOrEqual(160);
  expect(out.endsWith("word.")).toBe(true);
});
