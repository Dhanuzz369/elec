import Image from "next/image";
import { families } from "@/data/products";

const COLUMNS = 5;

// Every product photo on the site, interleaved by family so neighbouring tiles differ.
function photos() {
  const lists = families.map((f) => f.gallery ?? []).filter((g) => g.length);
  const out: { src: string; alt: string }[] = [];
  for (let i = 0; out.length < lists.reduce((n, g) => n + g.length, 0); i++) {
    for (const g of lists) if (g[i]) out.push(g[i]);
  }
  return out;
}

// A wall of our product photographs behind the hero text. Each column holds its
// tiles twice so a CSS drift of -50% loops without a seam; odd columns run the
// other way. Only the first tile per column loads eagerly, the rest lazily, so
// the wall never competes with the headline for bandwidth. Purely decorative:
// the photos are also on the product pages.
export function HeroMosaic() {
  const all = photos();
  const columns = Array.from({ length: COLUMNS }, (_, c) => all.filter((_, i) => i % COLUMNS === c));

  return (
    <div className="mosaic" aria-hidden="true">
      {columns.map((col, c) => (
        <div key={c} className="mosaic-col" data-dir={c % 2 ? "down" : "up"} style={{ "--dur": `${70 + c * 9}s` } as React.CSSProperties}>
          {[...col, ...col].map((p, i) => (
            <div key={`${p.src}-${i}`} className="mosaic-tile">
              <Image
                src={p.src}
                alt=""
                width={480}
                height={320}
                sizes="(max-width: 860px) 34vw, 20vw"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
