import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brands } from "@/data/brands";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { site } from "@/data/site";
import { HeroMosaic } from "@/components/HeroMosaic";
import { QuoteCta } from "@/components/QuoteCta";
import { Bullet, TransformerSymbol } from "@/components/Motif";
import { JsonLd } from "@/components/JsonLd";
import { blogLd, faqLd, webPageLd } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/posts";
import { PostList } from "@/components/PostList";
import { FaqList } from "@/components/FaqList";
import { SITE_FAQ } from "@/data/site-faq";
import { HOME_TITLE, pageMeta } from "@/lib/meta";

export const metadata: Metadata = {
  ...pageMeta({
  title: HOME_TITLE,
  description: "GoodBiz Power Systems is an Indian exporter of LT panels, transformers, RMUs, MV switchgear and enclosures, matched to your country's grid and certificates.",
  path: "/",
  keywords: [
    "panels and transformers from India",
    "LT panels exporter",
    "PCC and MCC panels",
    "distribution transformer supplier",
    "ring main unit supplier",
    "MV switchgear exporter",
    "electrical enclosures and junction boxes",
    "HSN codes for electrical equipment",
    "electrical equipment for projects abroad",
    "25 years in power distribution",
  ],
  }),
  title: { absolute: HOME_TITLE },
};

const REASONS = [
  {
    title: "One partner, many products",
    text: "Switchgear, transformers and enclosures from several manufacturers, consolidated into one order and one shipment.",
  },
  {
    title: "The brands your project names",
    text: "Breakers, relays and meters from the brand on your specification or approved vendor list.",
  },
  {
    title: "Matched to your country",
    text: "Voltage, frequency, standards, design ambient and nameplate language set for the destination grid.",
  },
  {
    title: "Certificates handled",
    text: "SASO, SONCAP and PVoC certificates arranged with the shipment; UL, UKCA and utility approvals sourced from manufacturers that hold them.",
  },
  {
    title: "Export paperwork handled",
    text: "Commercial invoice, packing list, HSN code on every line and certificate of origin.",
  },
  {
    title: "Order sizes that fit",
    text: "From a single panel or a box of breakers to a full project package.",
  },
];

const INDUSTRIES = [
  "Power utilities",
  "Renewable energy",
  "EPC contractors",
  "Panel builders",
  "Manufacturing plants",
  "Infrastructure",
  "Railways and metros",
  "Data centres",
  "Government projects",
];

export default async function Home() {
  const guides = (await getAllPosts()).slice(0, 3);
  return (
    <>
      <section className="hero-wall" aria-labelledby="hero-title">
        <HeroMosaic />
        {/* No scroll reveal here: this text is the largest element on a phone, and hiding it
            until JavaScript runs delays the first meaningful paint. */}
        <div className="hero-wall-text">
          <h1 id="hero-title">Panels and transformers, fit for your grid</h1>
          <p>
            GoodBiz Power Systems is an Indian export partner for switchgear, transformers, enclosures and LT and
            MV panels, sourced from India&apos;s manufacturers to the voltage, standards and paperwork of your country.
          </p>
          <div className="hero-actions">
            <Link href="/configurator" className="btn btn--large" title="Configure your requirement by country, ratings and standards">
              Configure your requirement
            </Link>
            <Link href="/products" className="btn btn--paper btn--large" title="All products and HSN codes">
              See all products
            </Link>
          </div>
        </div>
      </section>

      <section className="about" aria-labelledby="about-title">
        <div data-stagger>
          <h2 id="about-title" data-reveal>
            Who we are
          </h2>
          <p className="about-statement" data-reveal>
            GoodBiz Power Systems is an India-based export house for electrical equipment, sourcing from India&apos;s
            manufacturers for buyers worldwide.
          </p>
          <p className="about-body" data-reveal>
            Utilities, EPC contractors, panel builders and plant owners abroad send us one requirement. We match
            every item to the grid and certificates of their country, consolidate it into one shipment and stay
            their single contact until it is delivered.
          </p>
          <p className="about-body" data-reveal>
            Behind it are 25+ years in power distribution: projects for KPTCL, and licensed EPC work for BESCOM and other public discoms.
          </p>
          <div className="about-more" data-reveal>
            <Link href="/about" className="btn btn--quiet" title="About GoodBiz Power Systems: 25+ years in power distribution">
              More about us
            </Link>
          </div>
        </div>
        <dl className="about-facts" data-stagger>
          <div data-reveal>
            <dt className="num">{families.length}</dt>
            <dd>product families, LT panels to 33 kV</dd>
          </div>
          <div data-reveal>
            <dt className="num">{countries.length}</dt>
            <dd>country grids mapped in our configurator</dd>
          </div>
          <div data-reveal>
            <dt>8-digit</dt>
            <dd>HSN code on every quotation line</dd>
          </div>
          <div data-reveal>
            <dt>1</dt>
            <dd>point of contact from enquiry to delivery</dd>
          </div>
        </dl>
      </section>

      <section className="exports" aria-labelledby="exports-title">
        <div className="exports-head">
          <h2 id="exports-title" data-reveal>
            What we export
          </h2>
          <Link href="/products" className="btn btn--quiet" title="All products and HSN codes">
            All products and HSN codes
          </Link>
        </div>
        <ul className="export-list" data-stagger>
          {families.map((f) => (
            <li key={f.slug} data-reveal>
              <Link href={`/products/${f.slug}`} className="export-row" title={`${f.name}: product lines and HSN codes`}>
                <span className="export-thumb" aria-hidden="true">
                  {f.gallery?.length ? (
                    <Image src={f.gallery[0].src} alt={f.gallery[0].alt} title={f.gallery[0].alt} width={240} height={160} sizes="120px" />
                  ) : (
                    <TransformerSymbol strokeWidth={1.6} />
                  )}
                </span>
                <strong>{f.name}</strong>
                <span className="export-desc">{f.variants.map((v) => v.name).join(" · ")}</span>
                <svg className="export-arrow" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M8 24h32M28 12l12 12-12 12" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="brands" aria-labelledby="brands-title">
        <div className="brand-board" data-stagger>
          <div className="brand-tile brand-tile--head" data-reveal>
            <h2 id="brands-title">Brands you trust</h2>
            <p>
              We source the breakers, relays and meters your specification names, so spares and approvals stay
              simple on site.
            </p>
          </div>
          {brands.map((b) => (
            <div key={b.name} className="brand-tile" data-logo={b.logo ? true : undefined} data-reveal>
              {b.logo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.logo} alt={`${b.name} logo`} title={b.name} width={72} height={72} loading="lazy" />
                  <span>{b.name}</span>
                </>
              ) : (
                b.name
              )}
            </div>
          ))}
        </div>
        <p className="brand-note">
          Logos show brands we source from. GoodBiz Power Systems is not an authorised distributor of these brands unless a
          quotation says so.
        </p>
      </section>

      <section className="field-notes why" aria-labelledby="why-title">
        <div data-stagger>
          <h2 id="why-title" data-reveal>
            Why buyers choose us
          </h2>
          <ul className="why-list" data-reveal>
            {REASONS.map((r) => (
              <li key={r.title}>
                <Bullet />
                <div>
                  <h3 className="why-title">{r.title}.</h3> {r.text}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="linked" data-stagger>
          <figure data-reveal-circle>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/free-container-ship-port-image.webp"
              alt="Containers stacked on a ship at a port"
              title="Electrical equipment shipped worldwide by sea"
              width={1024}
              height={709}
              loading="lazy"
            />
          </figure>
          <figure data-reveal-circle>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/lt-pcc-acb-incomers.webp"
              alt="LT power distribution panels with air circuit breaker incomers"
              title="LT power distribution panels with ACB incomers"
              width={1536}
              height={1024}
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="industries" aria-labelledby="industries-title">
        <h2 id="industries-title" data-reveal>
          Industries we serve
        </h2>
        <ul data-stagger>
          {INDUSTRIES.map((name) => (
            <li key={name} data-reveal>
              {name}
            </li>
          ))}
        </ul>
      </section>

      {guides.length > 0 && (
        <section className="home-guides" aria-labelledby="guides-title">
          <div className="home-guides-head">
            <h2 id="guides-title" data-reveal>
              Guides for buyers
            </h2>
            <Link href="/blog" className="btn btn--quiet" title="All guides for buyers of electrical equipment" data-reveal>
              All guides
            </Link>
          </div>
          <PostList posts={guides} />
        </section>
      )}

      <FaqList faq={SITE_FAQ} title="Questions buyers ask first" id="home-faq" />

      <QuoteCta
        title="Looking for electrical solutions?"
        text="Contractors and plant owners: tell us the project and the country. We source to match, handle the certificates and ship it."
        href="/configurator"
        action="Configure your requirement"
      />
      <JsonLd data={[webPageLd({ path: "/", name: HOME_TITLE, extra: { about: { "@id": `${site.url}/#organization` } } }), faqLd(SITE_FAQ), blogLd(guides)]} />
    </>
  );
}
