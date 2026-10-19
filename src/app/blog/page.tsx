import type { Metadata } from "next";
import Link from "next/link";
import { PostList, TagLinks } from "@/components/PostList";
import { JsonLd } from "@/components/JsonLd";
import { blogLd, breadcrumbLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description:
    "Weekly notes for buyers of electrical equipment exported from India: HSN codes, country standards and certificates, transformer and panel choices, and shipping.",
  path: "/blog",
});

export default async function BlogIndex() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return (
    <>
      <header className="page-head">
        <div data-stagger>
          <h1 data-reveal>Notes for buyers</h1>
          <p data-reveal>
            A new guide every week on HSN codes, country standards, certificates and choosing the right equipment
            for an export project.
          </p>
        </div>
        <a href="/feed.xml" className="btn btn--quiet">
          RSS feed
        </a>
      </header>

      <section className="blog-body" aria-label="Posts">
        <TagLinks tags={tags} />
        {posts.length ? (
          <PostList posts={posts} />
        ) : (
          <div className="empty">
            <p>No posts yet. The first one is on its way.</p>
            <Link href="/products#hsn" className="btn">
              Find an HSN code meanwhile
            </Link>
          </div>
        )}
      </section>
      <div style={{ height: "var(--section)" }} />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogLd(posts),
        ]}
      />
    </>
  );
}
