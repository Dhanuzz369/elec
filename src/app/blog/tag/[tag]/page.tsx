import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostList, TagLinks } from "@/components/PostList";
import { pageMeta, trimDescription } from "@/lib/meta";
import { getAllPosts, getAllTags, tagSlug } from "@/lib/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllTags()).map((t) => ({ tag: t.slug }));
}

async function load(slug: string) {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const tag = tags.find((t) => t.slug === slug);
  return { tag, tags, posts: posts.filter((p) => p.tags.some((t) => tagSlug(t) === slug)) };
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await load((await params).tag);
  if (!tag) return {};
  return pageMeta({
    title: `${tag.tag} articles`,
    description: trimDescription(
      `Guides and notes on ${tag.tag} for buyers of electrical equipment exported from India: HSN codes, standards, certificates and shipping.`,
    ),
    path: `/blog/tag/${tag.slug}`,
    noindex: tag.count < 2,
  });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const slug = (await params).tag;
  const { tag, tags, posts } = await load(slug);
  if (!tag) notFound();

  return (
    <>
      <header className="page-head">
        <div data-stagger>
          <h1 data-reveal>{tag.tag}</h1>
          <p data-reveal>
            {posts.length} {posts.length === 1 ? "guide" : "guides"} on {tag.tag.toLowerCase()} for buyers of
            electrical equipment.
          </p>
        </div>
      </header>
      <section className="blog-body" aria-label={`Posts on ${tag.tag}`}>
        <TagLinks tags={tags} active={slug} />
        <PostList posts={posts} />
      </section>
      <div style={{ height: "var(--section)" }} />
    </>
  );
}
