"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { families } from "@/data/products";
import { defaultHsnEntries, hsnEntries } from "@/lib/hsn";

const ENTRIES = hsnEntries();
const DEFAULTS = defaultHsnEntries();
const familyName = (slug: string) => families.find((f) => f.slug === slug)?.name;

export function HsnFinder() {
  const [q, setQ] = useState("");

  // Opened from a search action (/hsn-code-finder?q=8537), start on that query. Read
  // from window.location so the page stays static and works without JavaScript.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q")?.trim().slice(0, 60);
    if (initial) setQ(initial);
  }, []);
  const query = useDeferredValue(q.trim().toLowerCase());

  const results = useMemo(() => {
    if (!query) return DEFAULTS;
    const digits = query.replace(/\s/g, "");
    return ENTRIES.filter(
      (e) =>
        (/^\d+$/.test(digits) && e.code.startsWith(digits)) ||
        e.product.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query),
    ).slice(0, 40);
  }, [query]);

  return (
    <section className="finder" id="hsn" aria-labelledby="hsn-title">
      <div data-stagger>
        <h2 id="hsn-title" data-reveal>
          Find it by HSN code
        </h2>
        <p data-reveal>
          Type a product or the first digits of an HSN code. These are Indian 8-digit tariff lines; your import
          code will share the first six digits.
        </p>
        <p className="updated" data-reveal>
          Codes checked against the Indian Customs Tariff. Last updated <time dateTime="2026-10-19">19 October 2026</time>.
        </p>
      </div>
      <div>
        <label className="search">
          <span className="sr-only">Search products or HSN codes</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="MCCB, RMU, 8537…"
            autoComplete="off"
          />
        </label>
        <div className="results" aria-live="polite">
          {results.length === 0 && (
            <p className="hint" style={{ padding: 18 }}>
              No tariff line matches “{q}”. Ask us: we export it if it carries current.
            </p>
          )}
          {results.map((e) => {
            const fam = familyName(e.family);
            return (
              <div key={e.code + e.product} className="result">
                <b className="num">{e.code}</b>
                <div>
                  <p>{e.product}</p>
                  <span>{e.description}</span>
                  {fam && (
                    <>
                      {" · "}
                      <Link href={`/products/${e.family}`} className="link" title={`${fam}: product lines and HSN codes`} style={{ color: "var(--ink)" }}>
                        {fam}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
