"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { families } from "@/data/products";
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
      <Link href="/" className="wordmark" aria-label="GoodBiz home">
        <TransformerSymbol />
        GoodBiz
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
              <Link key={f.slug} href={`/products/${f.slug}`}>
                <strong>{f.name}</strong>
                {f.short}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/products" className="link nav-mobile">
          Products
        </Link>
        <Link href="/products#hsn" className="link nav-hide">
          HSN finder
        </Link>
        <Link href="/products" className="link nav-hide">
          All products
        </Link>
        <Link href="/configurator" className="btn">
          Get a quote
        </Link>
      </nav>
    </header>
  );
}
