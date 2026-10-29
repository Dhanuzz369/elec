import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { breadcrumbLd, webPageLd } from "@/lib/jsonld";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Get a quote",
  description:
    "Ask GoodBiz Power Systems for a quote on panels, switchgear, transformers or parts in under a minute. Say what you need and where it ships; we reply in a day.",
  path: "/quote",
  keywords: [
    "electrical equipment quote",
    "LT panel quotation",
    "transformer price quote",
    "RMU quotation",
    "switchgear quote India",
    "request a quote electrical panels",
    "export quotation electrical equipment",
  ],
});

export default function QuotePage() {
  return (
    <>
      <div className="quote-page">
        <header className="quote-head">
          <h1>Get a quote</h1>
          <p>
            A few taps, no forms to wade through. Need to set ratings and standards in detail? Use the{" "}
            <Link href="/configurator" className="link" title="Configure your requirement by country, ratings and standards">
              configurator
            </Link>{" "}
            instead.
          </p>
        </header>
        <QuoteForm />
      </div>
      <JsonLd
        data={[webPageLd({ path: "/quote", name: "Get a quote", type: "ContactPage", extra: { mainEntity: { "@id": `${site.url}/#organization` } } }), breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Get a quote", path: "/quote" },
        ])]}
      />
    </>
  );
}
