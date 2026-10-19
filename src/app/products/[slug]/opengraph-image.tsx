import { families, getFamily } from "@/data/products";
import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "GoodBiz product family";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return families.map((f) => ({ slug: f.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const fam = getFamily((await params).slug);
  return renderOg(fam ? `${fam.name}: lines and HSN codes` : "Products and HSN codes");
}
