import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { Bullet } from "@/components/Motif";
import { countries } from "@/data/countries";
import { getFamily } from "@/data/products";
import { countrySlug } from "@/lib/countries";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/meta";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { blogPostingLd, breadcrumbLd, faqLd } from "@/lib/jsonld";
import { getAllPosts, getPost, tagSlug } from "@/lib/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: `/blog/${post.slug}/opengraph-image`,
    keywords: [post.title, ...post.tags],
    canonical: post.canonical,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated,
    noindex: post.draft,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const posts = await getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  const post = posts[i];
  if (!post) notFound();

  const newer = posts[i - 1];
  const older = posts[i + 1];
  const family = post.family ? getFamily(post.family) : undefined;

  return (
    <article className="article">
      <header className="article-head" data-stagger>
        <h1 data-reveal>{post.title}</h1>
        <p className="article-lead" data-reveal>
          {post.description}
        </p>
        <p className="article-meta" data-reveal>
          {post.draft && <b className="draft-label">Draft</b>}
          <span>
            Published <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {post.updated && (
            <span>
              Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          )}
          <span>{post.author}</span>
          <span className="num">{post.readingMinutes} min read</span>
        </p>
        <div className="tag-links" data-reveal>
          {post.tags.map((t) => (
            <Link key={t} href={`/blog/tag/${tagSlug(t)}`} className="chip">
              {t}
            </Link>
          ))}
        </div>
      </header>

      {post.cover && (
        <figure className="article-cover" data-reveal>
          {post.cover.startsWith("/") ? (
            <Image src={post.cover} alt={post.coverAlt ?? ""} width={1600} height={900} priority />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt={post.coverAlt ?? ""} width={1600} height={900} />
          )}
        </figure>
      )}

      <ArticleBody post={post} />

      <FaqList faq={post.faq} />

      <aside className="article-related" aria-label="Related" data-reveal>
        <h2>Take it further</h2>
        <ul>
          {family && (
            <li>
              <Bullet />
              <Link href={`/products/${family.slug}`} className="link">
                {family.name}: product lines and HSN codes
              </Link>
            </li>
          )}
          <li>
            <Bullet />
            <Link href={family ? `/configurator?family=${family.slug}` : "/configurator"} className="link">
              Configure a requirement for your country
            </Link>
          </li>
          <li>
            <Bullet />
            <Link href="/products#hsn" className="link">
              Look up an HSN code
            </Link>
          </li>
          {countries
            .filter((c) => post.countries?.includes(c.code))
            .map((c) => (
              <li key={c.code}>
                <Bullet />
                <Link href={`/export/${countrySlug(c)}`} className="link">
                  Exporting to {c.name}: grid, standards and certificate
                </Link>
              </li>
            ))}
        </ul>
      </aside>

      {(newer || older) && (
        <nav className="article-pager" aria-label="More posts">
          {older ? (
            <Link href={`/blog/${older.slug}`} className="next-family">
              <strong>Earlier: {older.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/blog/${newer.slug}`} className="next-family">
              <strong>Next: {newer.title}</strong>
            </Link>
          )}
        </nav>
      )}
      <div style={{ height: "var(--section)" }} />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          blogPostingLd(post),
          faqLd(post.faq),
        ]}
      />
    </article>
  );
}
