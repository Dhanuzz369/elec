import Link from "next/link";
import { families } from "@/data/products";
import { SITE_UPDATED } from "@/data/updated";
import { formatDate } from "@/lib/format";
import { mailtoHref, site, whatsappHref } from "@/data/site";

const BLOCKS = [
  { ch: "G", h: 100, bg: "var(--accent)", fg: "var(--accent-ink)" },
  { ch: "o", h: 72, bg: "var(--field-1-ink)", fg: "var(--field-1)" },
  { ch: "o", h: 84, bg: "var(--field-1-surface)", fg: "var(--field-1-ink)" },
  { ch: "d", h: 96, bg: "var(--field-1-ink)", fg: "var(--field-1)" },
  { ch: "B", h: 100, bg: "var(--accent)", fg: "var(--accent-ink)" },
  { ch: "i", h: 64, bg: "var(--field-1-surface)", fg: "var(--field-1-ink)" },
  { ch: "z", h: 78, bg: "var(--field-1-ink)", fg: "var(--field-1)" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-mark" role="img" aria-label={site.name} data-stagger>
        {BLOCKS.map((b, i) => (
          <span key={i} aria-hidden="true" data-reveal style={{ height: `${b.h}%`, background: b.bg, color: b.fg }}>
            {b.ch}
          </span>
        ))}
      </div>
      <p className="footer-mark-sub" aria-hidden="true">
        {site.name.slice(site.shortName.length).trim()}
      </p>

      <div className="footer-cols">
        <nav aria-label="Panels and switchgear">
          <strong>Power equipment</strong>
          {families.slice(0, 3).map((f) => (
            <Link key={f.slug} href={`/products/${f.slug}`} className="link" title={`${f.name}: product lines and HSN codes`}>
              {f.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Components and supply">
          <strong>Components & enclosures</strong>
          {families.slice(3).map((f) => (
            <Link key={f.slug} href={`/products/${f.slug}`} className="link" title={`${f.name}: product lines and HSN codes`}>
              {f.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="For buyers">
          <strong>For buyers</strong>
          <Link href="/about" className="link" title="About GoodBiz Power Systems: 25+ years in power distribution">
            About us
          </Link>
          <Link href="/configurator" className="link" title="Configure your requirement by country, ratings and standards">
            Configure a requirement
          </Link>
          <Link href="/hsn-code-finder" className="link" title="Find the HSN code for electrical equipment">
            HSN code finder
          </Link>
          <Link href="/products" className="link" title="All products and HSN codes">
            All products
          </Link>
          <Link href="/blog" className="link" title="Guides for buyers of electrical equipment">
            Blog
          </Link>
          <Link href="/export" className="link" title="Countries we ship electrical equipment to">
            Countries we ship to
          </Link>
        </nav>
        <div className="footer-contact">
          <strong>{site.name} export desk</strong>
          <a className="link" href={mailtoHref()} title={`Email ${site.name}`}>
            {site.email}
          </a>
          <a className="link" href={whatsappHref()} title={`WhatsApp ${site.name}`}>
            WhatsApp {site.phone}
          </a>
          <span>Bangalore, Karnataka, India · shipping worldwide by sea and air</span>
        </div>
      </div>

      <div className="footer-last">
        <span>
          © {new Date().getFullYear()} GoodBiz Power Systems. Sourced in India, shipped worldwide. Updated{" "}
          <time dateTime={SITE_UPDATED}>{formatDate(SITE_UPDATED)}</time> ·{" "}
          <Link href="/privacy" className="link" title="Privacy policy">
            Privacy policy
          </Link>
        </span>
        <Link href="/quote" className="btn" title="Get a quote for electrical equipment">
          Get a quote
        </Link>
      </div>
    </footer>
  );
}
