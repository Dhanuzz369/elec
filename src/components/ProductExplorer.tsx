"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { families } from "@/data/products";

export function ProductExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const fam = families[active];

  // Arrow keys move between tabs (ARIA tabs pattern); the chosen tab is kept in
  // view on the phone's horizontal tab row.
  const select = (i: number, focus = false) => {
    const n = (i + families.length) % families.length;
    setActive(n);
    const el = tabs.current[n];
    if (focus) el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step) {
      e.preventDefault();
      select(active + step, true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      select(e.key === "Home" ? 0 : families.length - 1, true);
    }
  };

  return (
    <section className="explorer" aria-label="Product families">
      <div className="tabs" role="tablist" aria-orientation="vertical" onKeyDown={onKey}>
        {families.map((f, i) => (
          <button
            key={f.slug}
            id={`tab-${f.slug}`}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            tabIndex={i === active ? 0 : -1}
            type="button"
            className="tab"
            aria-selected={i === active}
            aria-controls="family-panel"
            onClick={() => select(i)}
          >
            <strong>{f.name}</strong>
            <span>{f.variants.length} product lines</span>
          </button>
        ))}
      </div>

      <div id="family-panel" role="tabpanel" aria-labelledby={`tab-${fam.slug}`} key={fam.slug} className="panel">
        <div className="panel-top">
          <p>{fam.summary}</p>
          <Link href={`/products/${fam.slug}`} className="btn btn--quiet">
            Open {fam.name}
          </Link>
        </div>
        {fam.gallery && (
          <div className="panel-photos">
            {fam.gallery.map((p) => (
              <figure key={p.src}>
                <Image src={p.src} alt={p.alt} width={1536} height={1024} sizes="(max-width: 860px) 33vw, 20vw" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
        <div className="bands">
          {fam.variants.map((v) => (
            <div key={v.name} className="band">
              <span className="rating num">{v.rating}</span>
              <div>
                <div className="title">{v.name}</div>
                <div className="note">{v.note}</div>
              </div>
              <div className="hsn num">
                HSN
                <b>{v.hsn}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
