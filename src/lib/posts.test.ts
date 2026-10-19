import path from "node:path";
import { getAllPosts, getAllTags, getPost, PostValidationError, tagSlug } from "@/lib/posts";

const FIX = path.join(__dirname, "__fixtures__");
const DIR = path.join(FIX, "posts");
const now = new Date("2026-10-19T00:00:00Z");

test("lists published posts newest first", async () => {
  const posts = await getAllPosts({ dir: DIR, now, includeDrafts: false });
  expect(posts.map((p) => p.slug)).toEqual(["valid-post", "syndicated"]);
});

test("drafts appear only with includeDrafts", async () => {
  const posts = await getAllPosts({ dir: DIR, now, includeDrafts: true });
  expect(posts.map((p) => p.slug)).toContain("draft-post");
  expect(posts.find((p) => p.slug === "draft-post")?.draft).toBe(true);
});

test("future posts stay hidden even with drafts shown", async () => {
  const posts = await getAllPosts({ dir: DIR, now, includeDrafts: true });
  expect(posts.map((p) => p.slug)).not.toContain("future-post");
});

test("missing required field names file and field", async () => {
  const err = await getAllPosts({ dir: path.join(FIX, "posts-bad/missing"), now }).catch((e) => e);
  expect(err).toBeInstanceOf(PostValidationError);
  expect(err.field).toBe("title");
  expect(err.message).toContain("missing-title.md");
});

test("date must be YYYY-MM-DD", async () => {
  const err = await getAllPosts({ dir: path.join(FIX, "posts-bad/date"), now }).catch((e) => e);
  expect(err).toBeInstanceOf(PostValidationError);
  expect(err.field).toBe("date");
  expect(err.message).toContain("bad-date.md");
});

test("slug must match the file-name pattern", async () => {
  const err = await getAllPosts({ dir: path.join(FIX, "posts-bad/slug"), now }).catch((e) => e);
  expect(err).toBeInstanceOf(PostValidationError);
  expect(err.field).toBe("slug");
});

test("strips raw html from the body", async () => {
  const post = await getPost("valid-post", { dir: DIR, now });
  expect(post?.html).not.toContain("<script");
  expect(post?.html).not.toContain("onclick");
});

test("renders gfm tables and heading ids", async () => {
  const post = await getPost("valid-post", { dir: DIR, now });
  expect(post?.html).toContain("<table");
  expect(post?.headings[0]).toEqual({ id: "why-the-code-matters", text: "Why the code matters", depth: 2 });
  expect(post?.html).toContain('id="why-the-code-matters"');
});

test("front matter is normalised", async () => {
  const post = await getPost("valid-post", { dir: DIR, now });
  expect(post).toMatchObject({
    date: "2026-10-10",
    updated: "2026-10-12",
    family: "lt-panels",
    countries: ["SA", "NG"],
    faq: [{ q: "What is the HSN code for an MCC panel?", a: "Use 85371000." }],
    draft: false,
  });
});

test("tagSlug normalises", () => {
  expect(tagSlug("Export Compliance")).toBe("export-compliance");
  expect(tagSlug("HSN & customs")).toBe("hsn-customs");
  expect(tagSlug("  Transformers ")).toBe("transformers");
});

test("tags merge by slug", async () => {
  const tags = await getAllTags({ dir: path.join(FIX, "posts-tags"), now });
  expect(tags).toEqual([{ tag: "Export Compliance", slug: "export-compliance", count: 2 }]);
});

test("reading time is at least one minute", async () => {
  const post = await getPost("syndicated", { dir: DIR, now });
  expect(post?.readingMinutes).toBe(1);
});

test("canonical is kept", async () => {
  const post = await getPost("syndicated", { dir: DIR, now });
  expect(post?.canonical).toBe("https://other.example/a");
});

test("getPost returns undefined for unknown slugs", async () => {
  expect(await getPost("nope", { dir: DIR, now })).toBeUndefined();
});
