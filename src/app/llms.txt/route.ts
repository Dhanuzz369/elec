import { buildLlmsTxt } from "@/lib/llms";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildLlmsTxt(await getAllPosts({ includeDrafts: false })), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
