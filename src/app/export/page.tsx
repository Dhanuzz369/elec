import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { countries } from "@/data/countries";
import { countrySlug } from "@/lib/countries";
import { breadcrumbLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Countries we ship to",
  description:
    "Electrical panels, transformers and switchgear exported from India to the Gulf, Africa, Asia, Australia, the UK and the US, matched to each country's grid.",
  path: "/export",
});

const REGIONS = ["Gulf", "Africa", "Asia", "Oceania", "Europe", "Americas"];

export default function ExportIndex() {
  return (
    <>
      <header className="page-head">
        <div data-stagger>
          <h1 data-reveal>Countries we ship to</h1>
          <p data-reveal>
            Each country has its own voltage, standards and certificate. Pick yours to see what we supply and how
            it is matched.
          </p>
        </div>
      </header>

      <section className="regions" aria-label="Countries by region">
        {REGIONS.map((region) => (
          <div key={region} className="region" data-reveal>
            <h2>{region}</h2>
            <ul>
              {countries
                .filter((c) => c.region === region)
                .map((c) => (
                  <li key={c.code}>
                    <Link href={`/export/${countrySlug(c)}`} className="region-link">
                      <strong>{c.name}</strong>
                      <span>
                        {c.lv} · {c.hz} Hz · {c.conformity}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
      <div style={{ height: "var(--section)" }} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Countries we ship to", path: "/export" },
        ])}
      />
    </>
  );
}
