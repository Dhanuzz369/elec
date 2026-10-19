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
      <div className="footer-mark" role="img" aria-label="GoodBiz" data-stagger>
        {BLOCKS.map((b, i) => (
          <span key={i} aria-hidden="true" data-reveal style={{ height: `${b.h}%`, background: b.bg, color: b.fg }}>
            {b.ch}
          </span>
        ))}
      </div>

      <div className="footer-cols">
        <nav aria-label="Panels and switchgear">
          <strong>Panels & switchgear</strong>
          {families.slice(0, 4).map((f) => (
            <Link key={f.slug} href={`/products/${f.slug}`} className="link">
              {f.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Components and supply">
          <strong>Components & supply</strong>
          {families.slice(4).map((f) => (
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
        </nav>
        <div className="footer-contact">
          <strong>{site.name} export desk</strong>
          <a className="link" href={mailtoHref()}>
            {site.email}
          </a>
          <a className="link" href={whatsappHref()}>
            WhatsApp {site.phone}
          </a>
          <span>India · shipping worldwide by sea and air</span>
        </div>
      </div>

      <p className="credits">
        Pictures: <a href="https://commons.wikimedia.org/w/index.php?curid=76620069">“Chilime Switchyard”</a> by
        Lipiram, <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>;{" "}
        <a href="https://commons.wikimedia.org/w/index.php?curid=12794488">
          “Electrical substation in Čerepova, Daugavpils”
        </a>{" "}
        by mihalich.barak, <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>;{" "}
        <a href="https://commons.wikimedia.org/w/index.php?curid=80318888">“High voltage switchgear”</a> by
        Novoklimov, <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en/">CC0</a>;{" "}
        <a href="https://commons.wikimedia.org/w/index.php?curid=195871846">“High-voltage switchgear 29”</a> and{" "}
        <a href="https://commons.wikimedia.org/w/index.php?curid=157627995">“High-voltage switchgear 01”</a> by
        Novoklimov, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>;{" "}
        <a href="https://wordpress.org/photos/photo/2146876aa9/">“A power transformer mounted on a wooden utility pole”</a>{" "}
        by Moses Cursor Ssebunya, <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>;{" "}
        <a href="https://www.rawpixel.com/image/5925310/photo-image-background-public-domain-free">
          “Container ship port”
        </a>
        , <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>, via rawpixel;{" "}
        <a href="https://commons.wikimedia.org/w/index.php?curid=124731292">“Japanese Transmission tower 2022-05”</a> by
        Minirexs, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. All via Wikimedia
        Commons unless noted; shown in greyscale. These pictures show the kind of sites our equipment serves, not
        GoodBiz products.
      </p>

      <div className="footer-last">
        <span>© {new Date().getFullYear()} GoodBiz. Sourced in India, shipped worldwide.</span>
        <Link href="/configurator" className="btn">
          Get a quote
        </Link>
      </div>
    </footer>
  );
}
