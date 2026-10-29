import type { Metadata } from "next";
import Link from "next/link";
import { PostList, TagLinks } from "@/components/PostList";
import { JsonLd } from "@/components/JsonLd";
import { blogLd, breadcrumbLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";
import { getAllPosts, getAllTags } from "@/lib/posts";

// Until the first post is published the page has nothing to rank for, so it stays out of search.
export async function generateMetadata(): Promise<Metadata> {
  const posts = await getAllPosts();
  return pageMeta({
    title: "Blog",
    description:
      "Guides for buyers of electrical equipment exported from India: HSN codes, country standards and certificates, transformer and panel choices, and shipping.",
    path: "/blog",
    noindex: posts.length === 0,
    keywords: [
      "electrical equipment export guides",
      "HSN codes guide",
      "country electrical standards",
      "electrical certificates for export",
      "transformer buying guide",
      "LT panel buying guide",
      "shipping electrical equipment from India",
    ],
  });
}

export default async function BlogIndex() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return (
    <>
      <header className="page-head">
        <div data-stagger>
          <h1 data-reveal>Notes for buyers</h1>
          <p data-reveal>
            Guides on HSN codes, country standards, certificates and choosing
            the right equipment for an export project.
          </p>
        </div>
        <a
          href="/feed.xml"
          className="btn btn--quiet"
          title="Subscribe to the blog by RSS"
        >
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
            <Link
              href="/products#hsn"
              className="btn"
              title="Find the HSN code for electrical equipment"
            >
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
