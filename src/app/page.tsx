import Link from "next/link";
import { brands } from "@/data/brands";
import { HeroStage } from "@/components/HeroStage";
import { Bullet } from "@/components/Motif";

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
              Built for your grid
            </h1>
            <p data-reveal>
              Panels, transformers, RMUs and switchgear from India, made to the voltage, standard and paperwork of
              the country they ship to.
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

      <section className="brands" aria-labelledby="brands-title">
        <div className="brand-board" data-stagger>
          <div className="brand-tile brand-tile--head" data-reveal>
            <h2 id="brands-title">Brands you trust</h2>
            <p>
              We fit the breakers, relays and meters your specification names, so spares and approvals stay simple
              on site.
            </p>
          </div>
          {brands.map((b) => (
            <div key={b} className="brand-tile" data-reveal>
              {b}
            </div>
          ))}
        </div>
      </section>

      <section className="field-notes" aria-labelledby="export-title">
        <div data-stagger>
          <h2 id="export-title" data-reveal>
            Shipped ready to energise
          </h2>
          <p data-reveal>
            Every order leaves India tested, documented and packed for the voyage, with the HSN codes and
            certificates your customs broker will ask for.
          </p>
          <ul data-reveal>
            <li>
              <Bullet />
              Routine tests witnessed, or by video, before dispatch
            </li>
            <li>
              <Bullet />
              Seaworthy packing for container or break-bulk
            </li>
            <li>
              <Bullet />
              Invoice, packing list, HSN and certificate of origin
            </li>
            <li>
              <Bullet />
              Nameplates and drawings in the language of site
            </li>
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

      <Link href="/configurator" className="cta-band" aria-label="Configure your requirement">
        <div className="cta-top">
          <p>
            Are you a contractor looking for electrical solutions? Tell us the project and the country; we build
            to match and ship it.
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
