"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TransformerDrawing, TransformerSymbol } from "./Motif";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => <TransformerDrawing className="hero-canvas-fallback" />,
});

const PHOTOS = [
  { src: "/images/high-voltage-switchgear.jpg", alt: "Lattice gantries of a high-voltage switchyard" },
  { src: "/images/high-voltage-switchgear-29.jpg", alt: "Outdoor circuit breakers and busbars in a substation" },
  { src: "/images/high-voltage-switchgear-01.jpg", alt: "Rows of switchyard equipment under steel gantries" },
  { src: "/images/japanese-transmission-tower-2022-05.jpg", alt: "A transmission tower carrying overhead lines" },
];

// Signature move: the switchyard photographs inside the secondary winding
// crossfade slowly, like light shifting. Paused when the tab is hidden;
// only the first picture under reduced motion.
export function HeroStage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const start = () => {
      timer = window.setInterval(() => setIndex((i) => (i + 1) % PHOTOS.length), 5600);
    };
    const onVis = () => {
      window.clearInterval(timer);
      if (!document.hidden) start();
    };
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="hero-stage">
      <div className="hero-photos">
        {PHOTOS.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            title={p.alt}
            aria-hidden={i === index ? undefined : true}
            width={1920}
            height={1440}
            data-on={i === index}
            fetchPriority={i === 0 ? "high" : "low"}
          />
        ))}
      </div>
      <TransformerSymbol className="hero-ring" strokeWidth={0.5} />
      <Hero3D />
      <div className="hero-plate">
        <div>
          <strong>Up to 33 kV · 2500 kVA</strong>
          oil-filled distribution transformer
        </div>
        <div className="hero-plate-hint">
          <strong>Drag to turn</strong>
          built to your grid
        </div>
      </div>
    </div>
  );
}
