import type { Metadata } from "next";
import Link from "next/link";
import { ProductExplorer } from "@/components/ProductExplorer";
import { JsonLd } from "@/components/JsonLd";
import { families } from "@/data/products";
import { breadcrumbLd, familiesListLd, webPageLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Products and HSN codes",
  description:
    "LT panels, MCC, MV switchgear, RMUs, transformers, breakers, enclosures, junction boxes, busbars and panel parts from India, with 8-digit HSN codes.",
  path: "/products",
  keywords: [
    ...families.map((f) => f.name),
    "electrical products from India",
    "HSN code finder",
    "HSN codes for electrical equipment",
    "8-digit HSN code",
    "PCC MCC panels",
    "busbars and panel parts",
  ],
});

export default function ProductsPage() {
  return (
    <>
      <header className="page-head">
        <div data-stagger>
          <h1 data-reveal>
            Six product families
          </h1>
          <p data-reveal>
            A complete range of LT and MV electrical equipment, sourced from India&apos;s manufacturers and shipped
            with its HSN code. Mix families and brands in one order; we consolidate them into one shipment.
          </p>
        </div>
        <Link href="/configurator" className="btn" title="Get a quote for electrical equipment">
          Get a quote
        </Link>
      </header>
      <ProductExplorer />
      <section className="hsn-pointer" aria-labelledby="hsn-pointer-title">
        <h2 id="hsn-pointer-title" data-reveal>
          Looking for an HSN code?
        </h2>
        <p data-reveal>
          Every product line above lists its Indian 8-digit HSN code. To search all tariff lines for electrical
          equipment, use the HSN code finder.
        </p>
        <Link href="/hsn-code-finder" className="btn" title="Find the HSN code for electrical equipment" data-reveal>
          Open the HSN code finder
        </Link>
      </section>
      <JsonLd
        data={[
          webPageLd({ path: "/products", name: "Products and HSN codes", type: "CollectionPage" }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          familiesListLd(),
        ]}
      />
      <div style={{ height: "var(--section)" }} />
    </>
  );
}
