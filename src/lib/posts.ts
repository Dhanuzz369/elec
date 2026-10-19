import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Element, Root } from "hast";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { countries } from "@/data/countries";
import { families } from "@/data/products";

// Blog posts are Markdown files in content/blog/<slug>.md, written by people or
// by the publishing automation. The contract is documented in content/blog/README.md.
// Everything here runs at build time on the server.

export type Faq = { q: string; a: string };

export type Heading = { id: string; text: string; depth: 2 | 3 };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  family?: string;
  countries?: string[];
  cover?: string;
  coverAlt?: string;
  faq: Faq[];
  draft: boolean;
  canonical?: string;
  html: string;
  headings: Heading[];
  readingMinutes: number;
};

type Options = { dir?: string; now?: Date; includeDrafts?: boolean };

export class PostValidationError extends Error {
  constructor(
    public file: string,
    public field: string,
    problem: string,
  ) {
    super(`content/blog/${file}: "${field}" ${problem}`);
    this.name = "PostValidationError";
  }
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const WORDS_PER_MINUTE = 220;

export function showDrafts(): boolean {
  return process.env.NODE_ENV === "development" || process.env.SHOW_DRAFTS === "1";
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function defaultDir() {
  return path.join(process.cwd(), "content/blog");
}

function toDateString(value: unknown): unknown {
  // YAML turns 2026-10-10 into a Date; keep the calendar day it was written as.
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function validate(file: string, slug: string, data: Record<string, unknown>) {
  const fail = (field: string, problem: string): never => {
    throw new PostValidationError(file, field, problem);
  };
  const str = (field: string, required: boolean) => {
    const v = data[field];
    if (v === undefined || v === null || v === "") {
      if (required) fail(field, "is required");
      return undefined;
    }
    if (typeof v !== "string") fail(field, "must be text");
    return (v as string).trim();
  };
  const strList = (field: string, required: boolean) => {
    const v = data[field];
    if (v === undefined) {
      if (required) fail(field, "is required");
      return undefined;
    }
    if (!Array.isArray(v) || v.length === 0 || !v.every((x) => typeof x === "string" && x.trim()))
      fail(field, "must be a non-empty list of text values");
    return (v as string[]).map((x) => x.trim());
  };

  if (!SLUG.test(slug)) fail("slug", `"${slug}" must be lowercase letters, digits and hyphens (rename the file)`);

  const title = str("title", true)!;
  const description = str("description", true)!;
  const author = str("author", true)!;

  const date = toDateString(data.date);
  if (date === undefined) fail("date", "is required");
  if (typeof date !== "string" || !DATE.test(date)) fail("date", "must be YYYY-MM-DD");
  const updatedRaw = toDateString(data.updated);
  if (updatedRaw !== undefined && (typeof updatedRaw !== "string" || !DATE.test(updatedRaw)))
    fail("updated", "must be YYYY-MM-DD");

  const tags = strList("tags", true)!;

  const family = str("family", false);
  if (family && !families.some((f) => f.slug === family))
    fail("family", `"${family}" is not a product family slug (${families.map((f) => f.slug).join(", ")})`);

  const postCountries = strList("countries", false);
  postCountries?.forEach((code) => {
    if (!countries.some((c) => c.code === code)) fail("countries", `"${code}" is not a country code in countries.ts`);
  });

  const cover = str("cover", false);
  const coverAlt = str("coverAlt", false);
  if (cover && !coverAlt) fail("coverAlt", "is required when cover is set");

  const faqRaw = data.faq ?? [];
  if (
    !Array.isArray(faqRaw) ||
    !faqRaw.every((f) => f && typeof f.q === "string" && f.q.trim() && typeof f.a === "string" && f.a.trim())
  )
    fail("faq", "must be a list of { q, a } text pairs");
  const faq = (faqRaw as Faq[]).map((f) => ({ q: f.q.trim(), a: f.a.trim() }));

  if (data.draft !== undefined && typeof data.draft !== "boolean") fail("draft", "must be true or false");

  const canonical = str("canonical", false);
  if (canonical && !/^https:\/\/[^\s/]+\.[^\s]+$/.test(canonical)) fail("canonical", "must be an absolute https:// URL");

  return {
    slug,
    title,
    description,
    date: date as string,
    updated: updatedRaw as string | undefined,
    author,
    tags,
    family,
    countries: postCountries,
    cover,
    coverAlt,
    faq,
    draft: data.draft === true,
    canonical,
  };
}

const schema = {
  ...defaultSchema,
  clobberPrefix: "",
  attributes: { ...defaultSchema.attributes, h2: ["id"], h3: ["id"] },
};

function textOf(node: Element): string {
  return node.children
    .map((c) => (c.type === "text" ? c.value : c.type === "element" ? textOf(c) : ""))
    .join("");
}

async function render(markdown: string) {
  const headings: Heading[] = [];
  const collect = () => (tree: Root) => {
    const walk = (node: Root | Element) => {
      for (const child of node.children) {
        if (child.type !== "element") continue;
        if ((child.tagName === "h2" || child.tagName === "h3") && typeof child.properties.id === "string") {
          headings.push({ id: child.properties.id, text: textOf(child), depth: child.tagName === "h2" ? 2 : 3 });
        }
        walk(child);
      }
    };
    walk(tree);
  };
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeSanitize, schema)
    .use(collect)
    .use(rehypeStringify)
    .process(markdown);
  return { html: String(file), headings };
}

async function loadAll(dir: string): Promise<Post[]> {
  const names = (await readdir(dir)).filter((n) => n.endsWith(".md") && n.toLowerCase() !== "readme.md");
  return Promise.all(
    names.map(async (name) => {
      const { data, content } = matter(await readFile(path.join(dir, name), "utf8"));
      const meta = validate(name, name.replace(/\.md$/, ""), data);
      const { html, headings } = await render(content);
      const words = content.split(/\s+/).filter(Boolean).length;
      return { ...meta, html, headings, readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)) };
    }),
  );
}

export async function getAllPosts(opts: Options = {}): Promise<Post[]> {
  const today = (opts.now ?? new Date()).toISOString().slice(0, 10);
  const includeDrafts = opts.includeDrafts ?? showDrafts();
  const posts = await loadAll(opts.dir ?? defaultDir());
  return posts
    .filter((p) => p.date <= today && (includeDrafts || !p.draft))
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
}

export async function getPost(slug: string, opts: Options = {}): Promise<Post | undefined> {
  return (await getAllPosts(opts)).find((p) => p.slug === slug);
}

export async function getAllTags(opts: Options = {}): Promise<{ tag: string; slug: string; count: number }[]> {
  const bySlug = new Map<string, { tag: string; slug: string; count: number }>();
  for (const post of await getAllPosts(opts)) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const entry = bySlug.get(slug) ?? { tag, slug, count: 0 };
      entry.count += 1;
      bySlug.set(slug, entry);
    }
  }
  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}
