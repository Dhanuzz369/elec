"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { families } from "@/data/products";
import { site } from "@/data/site";
import { TransformerSymbol } from "./Motif";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label={`${site.name} home`} title={`${site.name} home`}>
        <TransformerSymbol />
        <span className="wordmark-text">
          {site.shortName}
          <small>{site.name.slice(site.shortName.length).trim()}</small>
        </span>
      </Link>
      <nav className="nav" aria-label="Main">
        <div className="nav-products" ref={ref}>
          <button
            ref={trigger}
            type="button"
            className="link"
            aria-expanded={open}
            aria-controls="products-menu"
            onClick={() => setOpen((o) => !o)}
          >
            Products
          </button>
          <div id="products-menu" className="menu" data-open={open} inert={!open}>
            {families.map((f) => (
              <Link key={f.slug} href={`/products/${f.slug}`} title={`${f.name}: product lines and HSN codes`}>
                <strong>{f.name}</strong>
                {f.short}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/products" className="link nav-mobile" title="All products and HSN codes">
          Products
        </Link>
        <Link href="/hsn-code-finder" className="link nav-hide" title="Find the HSN code for electrical equipment">
          HSN finder
        </Link>
        <Link href="/blog" className="link" title="Guides for buyers of electrical equipment">
          Blog
        </Link>
        <Link href="/about" className="link nav-hide" title="About GoodBiz Power Systems: 25+ years in power distribution">
          About
        </Link>
        <Link href="/products" className="link nav-hide" title="All products and HSN codes">
          All products
        </Link>
        <Link href="/quote" className="btn" title="Get a quote for electrical equipment">
          Get a quote
        </Link>
      </nav>
    </header>
  );
}
