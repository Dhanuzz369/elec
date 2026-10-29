import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { HsnFinder } from "@/components/HsnFinder";
import { JsonLd } from "@/components/JsonLd";
import { HSN_FAQ } from "@/data/hsn-faq";
import { defaultHsnEntries } from "@/lib/hsn";
import { breadcrumbLd, faqLd, hsnTermSetLd, webPageLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "HSN code finder for electrical equipment",
  description:
    "Find the Indian 8-digit HSN code for LT panels, MV switchgear, RMUs, transformers, breakers, enclosures and parts. Search by product or by the first digits.",
  path: "/hsn-code-finder",
  keywords: [
    "HSN code finder",
    "HSN code for electrical panel",
    "HSN code for LT panel",
    "HSN code for transformer",
    "HSN code for RMU",
    "HSN code for MCCB",
    "8537 HSN code",
    "8504 HSN code",
    "Indian customs tariff electrical equipment",
  ],
});

export default function HsnCodeFinderPage() {
  return (
    <>
      <header className="page-head">
        <div data-stagger>
          <h1 data-reveal>HSN code finder for electrical equipment</h1>
          <p data-reveal>
            Every export from India is declared under an 8-digit HSN code. Search the tariff lines for panels,
            switchgear, transformers, breakers, enclosures and parts, then check the product page for the ratings
            each line covers.
          </p>
        </div>
        <Link href="/products" className="btn btn--quiet" title="All products and HSN codes">
          All products
        </Link>
      </header>
      <HsnFinder />
      <FaqList faq={HSN_FAQ} title="HSN questions" id="hsn-faq" />
      <JsonLd
        data={[
          webPageLd({ path: "/hsn-code-finder", name: "HSN code finder for electrical equipment" }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "HSN code finder", path: "/hsn-code-finder" },
          ]),
          hsnTermSetLd(defaultHsnEntries()),
          faqLd(HSN_FAQ),
        ]}
      />
      <div style={{ height: "var(--section)" }} />
    </>
  );
}
