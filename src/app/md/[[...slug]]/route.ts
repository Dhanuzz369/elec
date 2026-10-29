import { markdownPaths, pageMarkdown } from "@/lib/markdown-pages";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return markdownPaths().map((p) => ({ slug: p === "/" ? [] : p.slice(1).split("/") }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const md = pageMarkdown(`/${(slug ?? []).join("/")}`);
  if (!md) return new Response("Not found\n", { status: 404 });
  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept", "X-Robots-Tag": "noindex" },
  });
}
