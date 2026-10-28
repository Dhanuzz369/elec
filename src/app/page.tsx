import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brands } from "@/data/brands";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { HeroMosaic } from "@/components/HeroMosaic";
import { QuoteCta } from "@/components/QuoteCta";
import { Bullet, TransformerSymbol } from "@/components/Motif";
import { HOME_TITLE, pageMeta } from "@/lib/meta";

export const metadata: Metadata = {
  ...pageMeta({
  title: HOME_TITLE,
  description: "GoodBiz Power Systems exports LT panels, transformers, RMUs, MV switchgear and enclosures from India, matched to your country's grid and certificates.",
  path: "/",
  }),
  title: { absolute: HOME_TITLE },
};

const REASONS = [
  {
    title: "One partner, many products",
    text: "Panels, switchgear, transformers and enclosures from several manufacturers, consolidated into one order and one shipment.",
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
    title: "Certificates arranged",
    text: "SASO, SONCAP, PVoC, UL and the other destination certificates arranged with the shipment.",
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

export default function Home() {
  return (
    <>
      <section className="hero-wall" aria-labelledby="hero-title">
        <HeroMosaic />
        <div className="hero-wall-text" data-stagger>
          <h1 id="hero-title" data-reveal>
            Fit for your grid
          </h1>
          <p data-reveal>
            Your export partner for electrical panels, switchgear, transformers and enclosures, sourced from
            India&apos;s manufacturers to the voltage, standards and paperwork of your country.
          </p>
          <div className="hero-actions" data-reveal>
            <Link href="/configurator" className="btn btn--large">
              Configure your requirement
            </Link>
            <Link href="/products" className="btn btn--paper btn--large">
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
          <Link href="/products" className="btn btn--quiet">
            All products and HSN codes
          </Link>
        </div>
        <ul className="export-list" data-stagger>
          {families.map((f) => (
            <li key={f.slug} data-reveal>
              <Link href={`/products/${f.slug}`} className="export-row">
                <span className="export-thumb" aria-hidden="true">
                  {f.gallery?.length ? (
                    <Image src={f.gallery[0].src} alt="" width={240} height={160} sizes="120px" />
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
                  <img src={b.logo} alt={`${b.name} logo`} width={72} height={72} />
                  <span>{b.name}</span>
                </>
              ) : (
                b.name
              )}
            </div>
          ))}
        </div>
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
                <span>
                  <strong>{r.title}.</strong> {r.text}
                </span>
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

      <QuoteCta
        title="Looking for electrical solutions?"
        text="Contractors and plant owners: tell us the project and the country. We source to match, arrange the certificates and ship it."
        href="/configurator"
        action="Configure your requirement"
      />
    </>
  );
}
