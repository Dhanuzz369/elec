import { buildRss } from "@/lib/feed";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildRss(await getAllPosts({ includeDrafts: false })), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
