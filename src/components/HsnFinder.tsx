"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import hsn from "@/data/hsn.json";
import { families } from "@/data/products";

type Entry = { code: string; description: string; product: string; family: string };
const ENTRIES = (hsn as Entry[]).filter((e) => e.code.startsWith("85"));
const familyName = (slug: string) => families.find((f) => f.slug === slug)?.name;

export function HsnFinder() {
  const [q, setQ] = useState("");
  const query = useDeferredValue(q.trim().toLowerCase());

  const results = useMemo(() => {
    if (!query) return ENTRIES.filter((e) => /^853(6|7|8)/.test(e.code) || /^85042/.test(e.code)).slice(0, 12);
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
                      <Link href={`/products/${e.family}`} className="link" style={{ color: "var(--ink)" }}>
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
