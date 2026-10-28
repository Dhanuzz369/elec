import Link from "next/link";
import { families } from "@/data/products";
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
            <Link key={f.slug} href={`/products/${f.slug}`} className="link">
              {f.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Components and supply">
          <strong>Components & enclosures</strong>
          {families.slice(3).map((f) => (
            <Link key={f.slug} href={`/products/${f.slug}`} className="link">
              {f.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="For buyers">
          <strong>For buyers</strong>
          <Link href="/configurator" className="link">
            Configure a requirement
          </Link>
          <Link href="/products#hsn" className="link">
            HSN code finder
          </Link>
          <Link href="/products" className="link">
            All products
          </Link>
          <Link href="/blog" className="link">
            Blog
          </Link>
          <Link href="/export" className="link">
            Countries we ship to
          </Link>
        </nav>
        <div className="footer-contact">
          <strong>{site.name} export desk</strong>
          <a className="link" href={mailtoHref()}>
            {site.email}
          </a>
          <a className="link" href={whatsappHref()}>
            WhatsApp {site.phone}
          </a>
          <span>Bangalore, Karnataka, India · shipping worldwide by sea and air</span>
        </div>
      </div>

      <div className="footer-last">
        <span>© {new Date().getFullYear()} GoodBiz Power Systems. Sourced in India, shipped worldwide.</span>
        <Link href="/quote" className="btn">
          Get a quote
        </Link>
      </div>
    </footer>
  );
}
