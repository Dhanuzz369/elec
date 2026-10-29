import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/FaqList";
import { QuoteCta } from "@/components/QuoteCta";
import { JsonLd } from "@/components/JsonLd";
import { Bullet } from "@/components/Motif";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import {
  conformityInSentence,
  countryDescription,
  countryFaq,
  countrySlug,
  familyLineFor,
  getCountryBySlug,
} from "@/lib/countries";
import { breadcrumbLd, countryPageLd, faqLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return countries.map((c) => ({ country: countrySlug(c) }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const c = getCountryBySlug((await params).country);
  if (!c) return {};
  return pageMeta({
    title: `Electrical equipment for ${c.name}`,
    description: countryDescription(c),
    path: `/export/${countrySlug(c)}`,
    keywords: [
      `electrical equipment for ${c.name}`,
      `electrical panels ${c.name}`,
      `transformers for ${c.name}`,
      `LT panels ${c.lv} ${c.name}`,
      `switchgear export to ${c.name}`,
      `${c.hz} Hz electrical equipment`,
      c.conformity,
      `export electrical equipment from India to ${c.name}`,
    ],
  });
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const c = getCountryBySlug((await params).country);
  if (!c) notFound();
  const path = `/export/${countrySlug(c)}`;
  const faq = countryFaq(c);
  const facts: [string, string][] = [
    ["Low voltage", c.lv],
    ["Medium voltage", c.mv],
    ["Frequency", `${c.hz} Hz`],
    ["Standards", c.standard],
    ["Certificate", `${c.conformity}, arranged by GoodBiz Power Systems`],
    ["Design ambient", `${c.ambient} °C`],
    ["Nameplates", c.plate],
  ];

  return (
    <>
      <header className="country-head" data-stagger>
        <h1 data-reveal>{c.name}</h1>
        <p data-reveal>
          Electrical equipment for {c.name}: panels, transformers, RMUs and switchgear sourced from partner manufacturers to the grid, standards and
          paperwork of {c.name}, with the {conformityInSentence(c)} arranged for each shipment.
        </p>
        <div className="hero-actions" data-reveal>
          <Link href={`/configurator?country=${c.code}`} className="btn">
            Configure for {c.name}
          </Link>
          <Link href="/export" className="btn btn--quiet">
            All countries
          </Link>
        </div>
      </header>

      <section className="grid-facts" aria-labelledby="grid-title">
        <h2 id="grid-title" data-reveal>
          The grid at a glance
        </h2>
        <dl data-stagger>
          {facts.map(([k, v]) => (
            <div key={k} data-reveal>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="grid-note">
          Typical values for {c.name}. Your project specification and the local utility&apos;s approval list
          always take priority. Last updated <time dateTime="2026-10-19">19 October 2026</time>.
        </p>
      </section>

      <section className="country-families" aria-labelledby="families-title">
        <h2 id="families-title" data-reveal>
          What we supply
        </h2>
        <ul data-stagger>
          {families.map((f) => (
            <li key={f.slug} data-reveal>
              <Bullet />
              <Link href={`/products/${f.slug}`} className="link">
                {familyLineFor(c, f)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FaqList faq={faq} />

      <QuoteCta
        title={`Shipping to ${c.name}?`}
        text={`Pick your equipment and ratings. The rating plate fills in for ${c.name}, and we source to match and ship it.`}
        href={`/configurator?country=${c.code}`}
        action={`Configure for ${c.name}`}
      />

      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Countries we ship to", path: "/export" },
            { name: c.name, path },
          ]),
          countryPageLd(c, path),
          faqLd(faq),
        ]}
      />
    </>
  );
}
