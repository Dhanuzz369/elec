import type { Metadata } from "next";
import Link from "next/link";
import { ProductExplorer } from "@/components/ProductExplorer";
import { HsnFinder } from "@/components/HsnFinder";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Products and HSN codes",
  description:
    "LT panels, MCC, MV switchgear, RMUs, transformers, compact substations, breakers, enclosures, parts, cables and UPS, with 8-digit HSN codes.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <header className="page-head">
        <div data-stagger>
          <h1 data-reveal>
            Eight product families
          </h1>
          <p data-reveal>One export desk. Every line below is sourced to order and shipped with its HSN code.</p>
        </div>
        <Link href="/configurator" className="btn">
          Get a quote
        </Link>
      </header>
      <ProductExplorer />
      <HsnFinder />
      <div style={{ height: "var(--section)" }} />
    </>
  );
}
