import type { Post } from "@/lib/posts";

// Post HTML is produced at build time from sanitised Markdown (src/lib/posts.ts).
export function ArticleBody({ post }: { post: Post }) {
  const toc = post.headings.filter((h) => h.depth === 2);
  return (
    <div className="article-layout">
      {toc.length >= 3 && (
        <nav className="toc" aria-label="On this page" data-reveal>
          <strong>On this page</strong>
          <ol>
            {toc.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="link">
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="prose" data-reveal dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}
