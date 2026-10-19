import { OG_SIZE, renderOg } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/posts";

export const alt = "GoodBiz blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  return renderOg(post?.title ?? "Notes for buyers", "GoodBiz blog");
}
