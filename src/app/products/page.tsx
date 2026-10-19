import type { Metadata } from "next";
import Link from "next/link";
import { ProductExplorer } from "@/components/ProductExplorer";
import { HsnFinder } from "@/components/HsnFinder";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import hsn from "@/data/hsn.json";
import { breadcrumbLd, faqLd, familiesListLd, hsnTermSetLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

const HSN_FAQ = [
  {
    q: "What is the HSN code for LT panels?",
    a: "85371000. India has one 8-digit line for boards and panels for 1000 V or less, covering PCC, MCC, APFC, ATS and PLC panels.",
  },
  {
    q: "What is the HSN code for MV switchgear and RMUs?",
    a: "85372000, the line for boards and panels for more than 1000 V, including complete ring main units.",
  },
  {
    q: "What is the HSN code for a transformer above 10 MVA?",
    a: "85042310 for 10 to 50 MVA, 85042320 for 50 to 100 MVA, 85042330 for 100 to 250 MVA and 85042340 above 250 MVA.",
  },
  {
    q: "Is 85371090 a valid HSN code?",
    a: "No. The Indian tariff does not split 853710, so the only valid 8-digit line is 85371000.",
  },
  {
    q: "Will my import code match the Indian HSN code?",
    a: "The first six digits match worldwide. The last digits are national, so your customs broker adds your country's own suffix.",
  },
];

const HSN_ENTRIES = (hsn as { code: string; description: string; product: string }[]).filter((e) =>
  e.code.startsWith("85"),
);

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
      <FaqList faq={HSN_FAQ} title="HSN questions" id="hsn-faq" />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          familiesListLd(),
          hsnTermSetLd(HSN_ENTRIES),
          faqLd(HSN_FAQ),
        ]}
      />
      <div style={{ height: "var(--section)" }} />
    </>
  );
}
