import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/posts";
import { tagSlug } from "@/lib/posts";

// Posts as banded rows, the same rhythm as the product explorer.
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ol className="post-list" data-stagger>
      {posts.map((p) => (
        <li key={p.slug} data-reveal>
          <Link href={`/blog/${p.slug}`} className="post-row" title={p.title}>
            <span className="post-row-thumb" aria-hidden="true" data-reveal-circle>
              {p.cover?.startsWith("/") ? (
                <Image src={p.cover} alt={p.coverAlt ?? p.title} title={p.coverAlt ?? p.title} width={240} height={240} sizes="120px" />
              ) : p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt={p.coverAlt ?? p.title} title={p.coverAlt ?? p.title} width={240} height={240} loading="lazy" />
              ) : null}
            </span>
            <span className="post-row-date num">
              <time dateTime={p.date}>{formatDate(p.date)}</time>
              {p.draft && <b className="draft-label">Draft</b>}
            </span>
            <span className="post-row-main">
              <strong>{p.title}</strong>
              <span>{p.description}</span>
            </span>
            <span className="post-row-meta">
              <span>{p.tags[0]}</span>
              <span className="num">{p.readingMinutes} min read</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function TagLinks({ tags, active }: { tags: { tag: string; slug: string }[]; active?: string }) {
  if (!tags.length) return null;
  return (
    <nav className="tag-links" aria-label="Topics" data-reveal>
      <Link href="/blog" className="chip" aria-current={active ? undefined : "page"} title="All topics">
        All topics
      </Link>
      {tags.map((t) => (
        <Link
          key={t.slug}
          href={`/blog/tag/${tagSlug(t.tag)}`}
          className="chip"
          title={`Articles on ${t.tag}`}
          aria-current={active === t.slug ? "page" : undefined}
        >
          {t.tag}
        </Link>
      ))}
    </nav>
  );
}
