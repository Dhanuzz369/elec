import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { families, getFamily } from "@/data/products";
import { Bullet, TransformerDrawing, TransformerSymbol } from "@/components/Motif";
import { pageMeta, trimDescription } from "@/lib/meta";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, faqLd, familyLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return families.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fam = getFamily(slug);
  if (!fam) return {};
  const codes = [...new Set(fam.variants.map((v) => v.hsn))].slice(0, 3).join(", ");
  return pageMeta({
    title: `${fam.name}: product lines and HSN codes`,
    description: trimDescription(`${fam.name} for export from India, HSN ${codes}. ${fam.short} ${fam.summary}`),
    path: `/products/${fam.slug}`,
  });
}

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fam = getFamily(slug);
  if (!fam) notFound();

  const i = families.indexOf(fam);
  const next = families[(i + 1) % families.length];

  return (
    <>
      <section className="family-hero" aria-labelledby="family-title">
        <div data-stagger>
          <h1 id="family-title" data-reveal>
            {fam.name}
          </h1>
          <p data-reveal>{fam.summary}</p>
          <div className="hero-actions" data-reveal>
            <Link href={`/configurator?family=${fam.slug}`} className="btn">
              Request {fam.name}
            </Link>
            <a href="#lines" className="btn btn--quiet">
              See product lines
            </a>
          </div>
        </div>
        {fam.gallery?.length ? (
          <figure className="product-stage" data-reveal>
            <Image
              src={fam.gallery[0].src}
              alt={fam.gallery[0].alt}
              width={1536}
              height={1024}
              sizes="(max-width: 860px) 100vw, 42vw"
              priority
            />
          </figure>
        ) : (
        <div className="family-visual" data-reveal-circle>
          {fam.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fam.image.src} alt={fam.image.alt} width={1920} height={1280} />
          ) : fam.slug === "transformers" ? (
            <TransformerDrawing />
          ) : (
            <TransformerSymbol strokeWidth={0.8} />
          )}
        </div>
        )}
      </section>

      {fam.gallery && fam.gallery.length > 1 && (
        <section className="gallery" aria-labelledby="gallery-title">
          <h2 id="gallery-title" data-reveal>
            From our range
          </h2>
          <div className="gallery-grid" data-stagger>
            {fam.gallery.map((p) => (
              <figure key={p.src} data-reveal>
                <Image src={p.src} alt={p.alt} width={1536} height={1024} sizes="(max-width: 860px) 100vw, 33vw" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <div className="range" data-stagger>
        {fam.range.map((r) => (
          <div key={r.label} data-reveal>
            <b className="num">{r.value}</b>
            <span>{r.label}</span>
          </div>
        ))}
      </div>

      <section className="spec" id="lines" aria-labelledby="lines-title">
        <h2 id="lines-title" data-reveal>
          Product lines and HSN codes
        </h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Typical rating</th>
              <th scope="col">HSN (India, 8-digit)</th>
            </tr>
          </thead>
          <tbody>
            {fam.variants.map((v) => (
              <tr key={v.name}>
                <td>
                  {v.name}
                  <small>{v.note}</small>
                </td>
                <td className="num">{v.rating}</td>
                <td className="num">{v.hsn}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginTop: 20 }}>
          Codes are the Indian export tariff lines; confirm the import line with your customs broker.
        </p>
      </section>

      <section className="facts" aria-label="Standards, applications and options">
        {[
          { h: "Standards", items: fam.standards },
          { h: "Built for", items: fam.builtFor },
          { h: "Options", items: fam.options },
        ].map((col) => (
          <div key={col.h} data-reveal>
            <h3>{col.h}</h3>
            <ul>
              {col.items.map((it) => (
                <li key={it}>
                  <Bullet />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <FaqList faq={fam.faq} />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: fam.name, path: `/products/${fam.slug}` },
          ]),
          familyLd(fam),
          faqLd(fam.faq),
        ]}
      />

      <Link href={`/products/${next.slug}`} className="next-family">
        <strong>Next: {next.name}</strong>
        <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M8 24h32M28 12l12 12-12 12" />
        </svg>
      </Link>

      <Link href={`/configurator?family=${fam.slug}`} className="cta-band" aria-label={`Request ${fam.name}`}>
        <div className="cta-top">
          <p>Tell us the country and the rating. We source to match and ship it.</p>
          <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 36 36 12M16 12h20v20" />
          </svg>
        </div>
        <span className="cta-word" aria-hidden="true">
          request
        </span>
      </Link>
    </>
  );
}
