import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/data/brands";
import { countries } from "@/data/countries";
import { families } from "@/data/products";
import { HeroStage } from "@/components/HeroStage";
import { Bullet } from "@/components/Motif";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Electrical equipment sourced for your grid",
  description: "GoodBiz exports LT panels, MCC, transformers, RMUs, MV switchgear and enclosures from India, sourced to your country's voltage, standards and certificates.",
  path: "/",
});

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
    text: "From a single panel or a box of breakers to a full substation package.",
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
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-card">
          <div className="busbars" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="hero-card-body" data-stagger>
            <h1 id="hero-title" data-reveal>
              Fit for your grid
            </h1>
            <p data-reveal>
              Your export partner for electrical panels, switchgear, transformers and enclosures, sourced from
              India&apos;s manufacturers to the voltage, standards and paperwork of your country.
            </p>
            <div className="hero-actions" data-reveal>
              <Link href="/configurator" className="btn">
                Configure your requirement
              </Link>
              <Link href="/products" className="btn btn--paper">
                See all products
              </Link>
            </div>
          </div>
          <div className="hero-links">
            <Link href="/products/lt-panels" className="link">
              LT & MCC panels
            </Link>
            <Link href="/products/transformers" className="link">
              Transformers
            </Link>
            <Link href="/products/mv-switchgear-rmu" className="link">
              MV switchgear & RMU
            </Link>
          </div>
        </div>
        <HeroStage />
      </section>

      <section className="about" aria-labelledby="about-title">
        <div data-stagger>
          <h2 id="about-title" data-reveal>
            Who we are
          </h2>
          <p className="about-statement" data-reveal>
            GoodBiz is an India-based export house for electrical equipment, sourcing from India&apos;s
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
            <dd>product families, LT to 220 kV</dd>
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
                <strong>{f.name}</strong>
                <span>{f.variants.map((v) => v.name).join(" · ")}</span>
                <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
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
            <div key={b} className="brand-tile" data-reveal>
              {b}
            </div>
          ))}
        </div>
      </section>

      <section className="field-notes why" aria-labelledby="why-title">
        <div data-stagger>
          <h2 id="why-title" data-reveal>
            Why buyers choose GoodBiz
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
              src="/images/electrical-substation-in-cerepova-daugavpils.jpg"
              alt="An outdoor substation with gantries and lightning masts"
              width={1920}
              height={1280}
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

      <Link href="/configurator" className="cta-band" aria-label="Configure your requirement">
        <div className="cta-top">
          <p>
            Are you a contractor looking for electrical solutions? Tell us the project and the country; we source
            to match, arrange the certificates and ship it.
          </p>
          <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 36 36 12M16 12h20v20" />
          </svg>
        </div>
        <span className="cta-word" aria-hidden="true" data-reveal>
          configure
        </span>
      </Link>
    </>
  );
}
